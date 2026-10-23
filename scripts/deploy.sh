#!/usr/bin/env bash
# Despliega Datecito al VPS: API (Laravel), sitio web y CRM.
#
#   scripts/deploy.sh                 despliega todo
#   scripts/deploy.sh --solo-api      sólo backend
#   scripts/deploy.sh --solo-web      sólo sitio web y CRM
#
# Requiere: la llave ~/.ssh/datecito_vps y scripts/deploy.config.sh con SERVER_IP, DOMAIN y ACME_EMAIL.
# La primera vez crea el .env del servidor con secretos aleatorios; después sólo actualiza código.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=deploy.config.sh
source "$ROOT/scripts/deploy.config.sh"
: "${SERVER_IP:?Falta SERVER_IP en scripts/deploy.config.sh}"
: "${DOMAIN:?Falta DOMAIN en scripts/deploy.config.sh}"
: "${ACME_EMAIL:?Falta ACME_EMAIL en scripts/deploy.config.sh}"

SSH=(ssh -i "$HOME/.ssh/datecito_vps" -o BatchMode=yes "root@$SERVER_IP")
REMOTE=/srv/datecito
API=1; WEB=1
case "${1:-}" in
  --solo-api) WEB=0 ;;
  --solo-web) API=0 ;;
esac

paso() { printf '\n\033[1;32m▶ %s\033[0m\n' "$*"; }

# Sube una carpeta con tar por SSH (sin depender de rsync en Windows).
subir() { # subir <carpeta local> <destino remoto> [excluir...]
  local src="$1" dest="$2"; shift 2
  local ex=(); for e in "$@"; do ex+=(--exclude="$e"); done
  "${SSH[@]}" "mkdir -p '$dest'"
  tar -C "$src" "${ex[@]}" -czf - . | "${SSH[@]}" "tar -C '$dest' -xzf -"
}

if [ "$WEB" = 1 ]; then
  paso "Compilando sitio web y CRM"
  (cd "$ROOT/web" && npm run build >/dev/null)
  (cd "$ROOT/crm" && VITE_API_URL="https://api.$DOMAIN/api/v1" npm run build >/dev/null)
  paso "Subiendo sitio web y CRM"
  "${SSH[@]}" "rm -rf $REMOTE/web.new $REMOTE/crm.new"
  subir "$ROOT/web/dist" "$REMOTE/web.new"
  subir "$ROOT/crm/dist" "$REMOTE/crm.new"
  # Cambio atómico: nunca queda el sitio a medias.
  "${SSH[@]}" "rm -rf $REMOTE/web.old $REMOTE/crm.old; [ -d $REMOTE/web ] && mv $REMOTE/web $REMOTE/web.old; [ -d $REMOTE/crm ] && mv $REMOTE/crm $REMOTE/crm.old; mv $REMOTE/web.new $REMOTE/web; mv $REMOTE/crm.new $REMOTE/crm; rm -rf $REMOTE/web.old $REMOTE/crm.old"
fi

if [ "$API" = 1 ]; then
  paso "Subiendo backend"
  subir "$ROOT/backend" "$REMOTE/backend" ./vendor ./node_modules ./.env ./.env.testing ./storage/logs ./storage/framework/cache ./storage/framework/sessions ./storage/framework/views ./.git ./tests ./.phpunit.cache

  paso "Configurando y arrancando en el servidor"
  "${SSH[@]}" bash -s -- "$DOMAIN" "$ACME_EMAIL" <<'REMOTE_SCRIPT'
set -euo pipefail
DOMAIN="$1"; ACME_EMAIL="$2"
cd /srv/datecito/backend
mkdir -p storage/logs storage/framework/{cache/data,sessions,views} bootstrap/cache

if [ ! -f .env ]; then
  echo "Primera vez: creando .env con secretos aleatorios"
  gen() { openssl rand -hex 24; }
  awk -v d="$DOMAIN" -v e="$ACME_EMAIL" '
    { while (index($0, "__GEN__")) { cmd = "openssl rand -hex 24"; cmd | getline s; close(cmd); sub("__GEN__", s) }
      gsub("__DOMAIN__", d); gsub("__ACME_EMAIL__", e); print }' .env.production.example > .env
  chmod 600 .env
fi

docker compose -f docker-compose.prod.yml up -d --build --remove-orphans
# Espera a que PHP esté listo
for i in $(seq 1 30); do docker compose -f docker-compose.prod.yml exec -T app php -v >/dev/null 2>&1 && break; sleep 2; done

ART="docker compose -f docker-compose.prod.yml exec -T app php artisan"
docker compose -f docker-compose.prod.yml exec -T app composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --quiet
grep -q '^APP_KEY=$' .env && $ART key:generate --force --no-interaction
docker compose -f docker-compose.prod.yml exec -T app chown -R www-data:www-data storage bootstrap/cache
$ART migrate --force --no-interaction
$ART datecito:storage-setup --no-interaction || true
$ART optimize --no-interaction
$ART queue:restart --no-interaction
docker compose -f docker-compose.prod.yml restart queue scheduler >/dev/null

# Respaldo diario de la base de datos a las 3:30 (hora del servidor), 14 días de historial.
install -m 755 /srv/datecito/backend/docker/backup.sh /usr/local/bin/datecito-backup
( crontab -l 2>/dev/null | grep -v datecito-backup; echo "30 3 * * * /usr/local/bin/datecito-backup >> /var/log/datecito-backup.log 2>&1" ) | crontab -

echo
docker compose -f docker-compose.prod.yml ps --format '{{.Service}}: {{.Status}}'
REMOTE_SCRIPT
fi

paso "Listo"
echo "  Sitio:  https://$DOMAIN"
echo "  API:    https://api.$DOMAIN/api/v1"
echo "  CRM:    https://crm.$DOMAIN"
echo "  Fotos:  https://fotos.$DOMAIN"
