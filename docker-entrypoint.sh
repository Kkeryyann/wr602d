cat > /var/www/html/wr602d/docker-entrypoint.sh << 'EOF'
#!/bin/bash
set -e

# Run migrations
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

# Start Apache
apache2-foreground
EOF
