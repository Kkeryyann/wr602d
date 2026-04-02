cat > /var/www/html/wr602d/docker-entrypoint.sh << 'EOF'
#!/bin/bash
set -e
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
apache2-foreground
EOF
