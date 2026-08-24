# Use the official PHP 8.2 CLI image
FROM php:8.2-cli

# Install system dependencies, Node.js, and PostgreSQL drivers
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    nodejs \
    npm

# Install necessary PHP extensions for PostgreSQL
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory inside the container
WORKDIR /app

# Copy all your application files into the container
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies and compile the React/Vite frontend
RUN npm install
RUN npm run build

# Expose the port Render assigns
EXPOSE $PORT

# Start the Laravel built-in web server
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}