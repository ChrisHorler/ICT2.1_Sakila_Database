#!/bin/sh
set -e

SCHEMA="/sakila-ro/sakila-schema.sql"
DATA="/sakila-ro/sakila-data.sql"

echo "[sakila] Checking for Sakila SQL files..."
if [ ! -f "$SCHEMA" ] || [ ! -f "$DATA" ]; then
  echo "[sakila] Missing SQL files."
  echo "Place 'sakila-schema.sql' and 'sakila-data.sql' in ./db/sakila on the host."
  exit 1
fi

echo "[sakila] Ensuring server is ready..."
for i in $(seq 1 30); do
  if mariadb -uroot -p"${MARIADB_ROOT_PASSWORD}" -e "SELECT 1" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "[sakila] Creating database if needed..."
mariadb -uroot -p"${MARIADB_ROOT_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS sakila CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "[sakila] Importing schema..."
mariadb -uroot -p"${MARIADB_ROOT_PASSWORD}" sakila < "$SCHEMA"

echo "[sakila] Importing data..."
mariadb -uroot -p"${MARIADB_ROOT_PASSWORD}" sakila < "$DATA"

echo "[sakila] Import complete."
