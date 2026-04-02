# Stage 1: Build PHP dependencies
FROM composer:2 AS composer_deps

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist

# Stage 2: Build Node.js assets
FROM node:20-alpine AS node_assets

WORKDIR /app
COPY --from=composer_deps /app/vendor/ vendor/
COPY package.json package-lock.json ./
COPY webpack.config.js ./
COPY assets/ ./assets/
COPY templates/ ./templates/
RUN npm ci && npm run build

# Stage 3: Final production image
FROM php:8.3-apache

WORKDIR /var/www/html

# Install system packages and PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql zip intl \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Copy composer dependencies
COPY --from=composer_deps /app/vendor/ /var/www/html/vendor/

# Copy built assets
COPY --from=node_assets /app/public/build/ /var/www/html/public/build/

# Copy application code
COPY . .

# Apache virtualhost config
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Permissions
RUN mkdir -p var/cache var/log var/pdf_storage \
    && chown -R www-data:www-data var \
    && chmod -R 775 var

# Optimize autoloader
RUN php vendor/bin/symfony-scripts 2>/dev/null || true \
    && composer dump-autoload --no-dev --optimize --no-scripts 2>/dev/null || true

EXPOSE 80
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
CMD ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
