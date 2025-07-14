#!/bin/bash

echo "Starting Mindschool Development Environment..."

echo "1. Creating .env file..."
cp .env.example .env

# Generate Laravel key
docker-compose run --rm backend php artisan key:generate

# Install backend dependencies
docker-compose run --rm backend composer install

# Install frontend dependencies
docker-compose run --rm frontend npm install

# Run migrations
docker-compose run --rm backend php artisan migrate

# Start containers
docker-compose up -d

echo "\nEnvironment is now running!"
echo "Access the application at:"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
