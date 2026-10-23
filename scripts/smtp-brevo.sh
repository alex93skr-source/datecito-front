#!/usr/bin/env bash
# Configura el correo SMTP de Brevo en el servidor de producción sin que la clave pase por el chat
# ni quede en el historial: se pide aquí, se envía por SSH y se escribe sólo en /srv/datecito/backend/.env.
#
#   bash scripts/smtp-brevo.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/deploy.config.sh"
SSH=(ssh -i "$HOME/.ssh/datecito_vps" -o BatchMode=yes "root@$SERVER_IP")
REMOTE_ENV="/srv/datecito/backend/.env"

echo "Datos de Brevo › SMTP y API › pestaña SMTP"
echo "  • Usuario = el campo \"Login\" de esa pantalla (un correo o algo terminado en @smtp-brevo.com)."
echo "  • Clave   = la clave generada, que empieza con xsmtpsib-"
echo
# Descarta teclas que hayan quedado pendientes antes de empezar a preguntar.
while read -r -t 0.2 -n 1000 _; do :; done
read -r -p "Usuario SMTP (Login): " SMTP_USER
SMTP_USER="${SMTP_USER//[[:space:]]/}"
case "$SMTP_USER" in
  xsmtpsib-*) echo "Eso es la CLAVE, no el usuario. El usuario es el campo Login de Brevo."; exit 1 ;;
  *@*|*smtp-brevo.com) ;;
  *) echo "El usuario no parece un login de Brevo (debe ser un correo o terminar en @smtp-brevo.com)."; exit 1 ;;
esac
read -r -s -p "Clave SMTP (no se muestra al escribir; pégala y da Enter): " SMTP_PASS; echo
SMTP_PASS="${SMTP_PASS//[[:space:]]/}"
case "$SMTP_PASS" in
  xsmtpsib-*) ;;
  *) echo "La clave debe empezar con xsmtpsib-. Genera una nueva en Brevo y vuelve a correr el script."; exit 1 ;;
esac
read -r -p "Correo donde quieres recibir la prueba: " TEST_TO
[ -n "$TEST_TO" ] || { echo "Falta el correo de prueba."; exit 1; }

echo "Guardando en el servidor…"
printf '%s\n%s\n' "$SMTP_USER" "$SMTP_PASS" | "${SSH[@]}" "
  set -e
  IFS= read -r u; IFS= read -r p
  cd /srv/datecito/backend
  cp $REMOTE_ENV $REMOTE_ENV.bak
  grep -v -E '^(MAIL_MAILER|MAIL_HOST|MAIL_PORT|MAIL_USERNAME|MAIL_PASSWORD|MAIL_ENCRYPTION)=' $REMOTE_ENV > $REMOTE_ENV.tmp
  printf 'MAIL_MAILER=smtp\nMAIL_HOST=smtp-relay.brevo.com\nMAIL_PORT=587\nMAIL_USERNAME=\"%s\"\nMAIL_PASSWORD=\"%s\"\nMAIL_ENCRYPTION=tls\n' \"\$u\" \"\$p\" >> $REMOTE_ENV.tmp
  mv $REMOTE_ENV.tmp $REMOTE_ENV
  chmod 600 $REMOTE_ENV
  docker compose -f docker-compose.prod.yml exec -T app php artisan optimize --quiet
  docker compose -f docker-compose.prod.yml exec -T app php artisan queue:restart --quiet
"

echo "Enviando correo de prueba a $TEST_TO…"
"${SSH[@]}" "cd /srv/datecito/backend && docker compose -f docker-compose.prod.yml exec -T app php artisan tinker --execute '
  Illuminate\Support\Facades\Mail::raw(\"Hola, este es un correo de prueba de Datecito enviado desde el servidor con Brevo.\", fn(\$m) => \$m->to(\"$TEST_TO\")->subject(\"Prueba de correo Datecito\"));
  echo \"Enviado\", PHP_EOL;
'"
echo
echo "Listo. Revisa tu bandeja (y spam). Si llegó, los códigos de verificación ya saldrán por correo."
echo "Si falló, el servidor conserva una copia anterior en $REMOTE_ENV.bak."
