#!/bin/bash
# One-shot provisioning on the apps VPS (idempotent). Run as root from /opt/details-filehub-ui
# after the code is copied there. Builds the frontend, installs the systemd unit, and swaps the
# tunnel nginx vhost to path-split between the existing backend (3500) and this new staff frontend
# (3501). Public client-facing pages (/r, /s, /public, /api/public) and the staff API (/api/app)
# keep going to the unchanged backend. Rollback: cp the *.tunnel.bak file back over the live one,
# nginx -t && systemctl reload nginx, then systemctl disable --now details-filehub-ui.
set -euo pipefail
APP=/opt/details-filehub-ui
TUNNEL=/etc/nginx/sites-available/files.details-wms.cloud.tunnel
[ -f "$TUNNEL" ] || TUNNEL=/etc/nginx/sites-enabled/files.details-wms.cloud.tunnel

id -u details-files >/dev/null 2>&1 || { echo "المستخدم details-files غير موجود — شغّل تثبيت details-files أولًا" >&2; exit 1; }

cd "$APP"
npm install --no-audit --no-fund
NITRO_PRESET=node-server npm run build
chown -R root:details-files "$APP"; chmod -R g+rX "$APP"

install -m 644 "$APP/deploy/details-filehub-ui.service" /etc/systemd/system/details-filehub-ui.service

if [ -f "$TUNNEL" ] && [ ! -f "$TUNNEL.bak" ]; then
  cp "$TUNNEL" "$TUNNEL.bak"
  echo "نسخة احتياطية من الإعداد القديم: $TUNNEL.bak"
fi
install -m 644 "$APP/deploy/nginx-apps-tunnel.conf" "$TUNNEL"

systemctl daemon-reload
systemctl enable --now details-filehub-ui
systemctl restart details-filehub-ui
nginx -t && systemctl reload nginx
echo "install done — تحقق: curl -s http://127.0.0.1:3501/ -o /dev/null -w 'frontend: %{http_code}\n'"
