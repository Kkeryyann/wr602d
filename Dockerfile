# Stage 3: Final production image
FROM php:8.3-apache

WORKDIR /var/www/html

# Install required system packages and PHP extensions
RUN apk add --no-cache libzip-dev zip unzip postgresql-dev 2>/dev/null || \
    apt-get update && apt-get install -y libzip-dev libpq-dev zip unzip && \
    docker-php-ext-install pdo pdo_pgsql zip && \
    a2enmod rewrite

# Copy composer dependencies
COPY --from=composer_deps /app/vendor/ /var/www/html/vendor/

# Copy built assets
COPY --from=node_assets /app/public/build/ /var/www/html/public/build/

# Copy application code
COPY . .

# Apache config
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Set permissions
RUN mkdir -p var/cache var/log && \
    chown -R www-data:www-data var && \
    chmod -R 775 var

RUN composer dump-autoload --no-dev --optimize || true

EXPOSE 80
CMD ["apache2-foreground"]
