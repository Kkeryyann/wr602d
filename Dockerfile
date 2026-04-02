# Stage 1: Build PHP dependencies
FROM composer:2 as composer_deps

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist

# Stage 2: Build Node.js assets
FROM node:20-alpine as node_assets

WORKDIR /app
COPY --from=composer_deps /app/vendor/ vendor/
COPY package.json package-lock.json ./
COPY webpack.config.js ./
COPY assets/ ./assets/
RUN npm ci && npm run build

# Stage 3: Final production image
FROM php:8.3-fpm-alpine

WORKDIR /var/www/html

# Install required system packages and PHP extensions
RUN apk add --no-cache \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql zip

# Copy composer dependencies
COPY --from=composer_deps /app/vendor/ /var/www/html/vendor/

# Copy built assets
COPY --from=node_assets /app/public/build/ /var/www/html/public/build/

# Copy application code
COPY . .

# Set permissions for cache and logs
RUN mkdir -p var/cache var/log && \
    chown -R www-data:www-data var && \
    chmod -R 775 var

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
