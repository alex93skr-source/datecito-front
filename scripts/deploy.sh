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
  (cd "$ROOT/web" && VITE_API_URL="https://api.$DOMAIN/api/v1" npm run build >/dev/null)
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
  # El script remoto va como archivo (subido con el backend): si se mandara por stdin,
  # docker compose se lo comería y los pasos posteriores no correrían.
  "${SSH[@]}" bash /srv/datecito/backend/docker/remote-deploy.sh "$DOMAIN" "$ACME_EMAIL"
fi

paso "Listo"
echo "  Sitio:  https://$DOMAIN"
echo "  API:    https://api.$DOMAIN/api/v1"
echo "  CRM:    https://crm.$DOMAIN"
echo "  Fotos:  https://fotos.$DOMAIN"
