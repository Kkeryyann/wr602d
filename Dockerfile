# Stage 1: Build PHP dependencies
FROM composer:2 AS composer_deps

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist

# Stage 2: Final production image
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

# Copy application code (includes public/build/ already built locally)
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
RUN composer dump-autoload --no-dev --optimize --no-scripts 2>/dev/null || true

ENV APP_ENV=prod
ENV APP_DEBUG=0

EXPOSE 80
CMD ["bash", "-c", "chown -R www-data:www-data /var/www/html/var && php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration && exec apache2-foreground"]
