#!/bin/bash

domains=(thibanglaixe.pro.vn www.thibanglaixe.pro.vn)
rsa_key_size=4096
data_path="./certbot"
email="lamvinhkien1709@gmail.com"
staging=0

main_domain=${domains[0]}
domain_path="/etc/letsencrypt/live/${main_domain}"

echo "Checking existing certificates..."

if [ -d "$data_path" ]; then
  read -p "Existing data found for $main_domain. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "Downloading recommended TLS parameters..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "Creating dummy certificate for $main_domain..."
mkdir -p "$data_path/conf/live/$main_domain"
docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$domain_path/privkey.pem' \
    -out '$domain_path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo

echo "Starting core containers..."
docker compose -p quiz up -d mysqldb
docker compose -p quiz up -d backend
docker compose -p quiz up --force-recreate -d nginx
echo

echo "Deleting dummy certificate for $main_domain..."
docker compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$main_domain && \
  rm -Rf /etc/letsencrypt/archive/$main_domain && \
  rm -Rf /etc/letsencrypt/renewal/$main_domain.conf" certbot
echo

echo "Requesting Let's Encrypt certificate for: ${domains[*]} ..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done


if [ -z "$email" ]; then
  email_arg="--register-unsafely-without-email"
else
  email_arg="--email $email"
fi

[ $staging != "0" ] && staging_arg="--staging"


docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

echo "Reloading nginx with real certificates..."
docker compose -p quiz exec nginx nginx -s reload

echo "SSL setup complete!"
