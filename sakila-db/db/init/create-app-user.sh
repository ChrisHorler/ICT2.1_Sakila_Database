#!/bin/sh
set -e

APP_USER="${SAKILAAPP_USER:-sakilaapp}"
APP_PASS="${SAKILAAPP_PASSWORD:-sakilaapp_pw}"
DB_NAME="sakila"

echo "[sakila] Creating application user '${APP_USER}' with privileges on ${DB_NAME}..."

mariadb -uroot -p"${MARIADB_ROOT_PASSWORD}" <<SQL
CREATE USER IF NOT EXISTS '${APP_USER}'@'%' IDENTIFIED BY '${APP_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${APP_USER}'@'%';
FLUSH PRIVILEGES;
SQL

echo "[sakila] App user '${APP_USER}' ready."
