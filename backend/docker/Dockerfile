FROM php:8.1-fpm

# Set working directory
WORKDIR /var/www

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    libzip-dev \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libmagickwand-dev --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip exif pcntl sockets && docker-php-ext-enable sockets
RUN docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/
RUN docker-php-ext-install gd

# Install opcache
RUN docker-php-ext-configure opcache --enable-opcache \
    && docker-php-ext-install opcache

# Install imagick extension
RUN pecl install imagick && docker-php-ext-enable imagick

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy existing application directory contents
COPY . /var/www

RUN chown -R www-data:www-data /var/www/
USER www-data

#при следующем сборке включить  !!! для работы скачивания картинок товара
# Установка прав для Laravel
#RUN chown -R www-data:www-data /var/www/my-laravel-project/storage /var/www/my-laravel-project/bootstrap/cache
#RUN chmod -R 775 /var/www/my-laravel-project/storage /var/www/my-laravel-project/bootstrap/cache
#RUN chown -R www-data:www-data /var/www/my-laravel-project/storage/app/public/images
#RUN chmod -R 775 /var/www/my-laravel-project/storage/app/public/images

EXPOSE 9000
CMD ["php-fpm"]