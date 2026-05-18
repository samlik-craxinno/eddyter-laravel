FROM php:8.2-cli

WORKDIR /app

# Install system packages + Node.js
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    sqlite3 \
    libsqlite3-dev \
    gnupg \
    && docker-php-ext-install pdo pdo_sqlite

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install JS dependencies
RUN npm install

# Build Vite assets
RUN npm run build

# Create SQLite database
RUN mkdir -p database
RUN touch database/database.sqlite

# Permissions
RUN chmod -R 775 storage bootstrap/cache

# Clear Laravel caches
RUN php artisan config:clear
RUN php artisan route:clear
RUN php artisan view:clear

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000