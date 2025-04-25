# Project Setup Guide

This project consists of an Angular frontend (Sakai Admin) and a Laravel backend. Follow these steps to get it running:

## Prerequisites

1. XAMPP installed with Apache and MySQL services
2. Node.js and npm installed
3. Composer installed (for PHP/Laravel)

## Backend Setup (Laravel)

1. **Start XAMPP**
   - Start Apache and MySQL services from XAMPP Control Panel

2. **Create Database**
   - Navigate to the Laravel project directory:
     ```
     cd stage_projet_laravel
     ```
   - Run the database creation script:
     ```
     php create_database.php
     ```
   - This will create the database `platforme_collaboration` in MySQL if it doesn't already exist

3. **Install Dependencies**
   - Run the following command to install PHP dependencies:
     ```
     composer install
     ```

4. **Run Migrations**
   - Set up your database tables:
     ```
     php artisan migrate
     ```
   - (Optional) Seed the database with test data:
     ```
     php artisan db:seed
     ```

5. **Start Laravel Server**
   - Start the Laravel development server:
     ```
     php artisan serve
     ```
   - The backend will be available at http://localhost:8000

## Frontend Setup (Angular)

1. **Install Dependencies**
   - Navigate to the Angular project directory:
     ```
     cd sakai-admin
     ```
   - Install the required npm packages:
     ```
     npm install
     ```

2. **Start Angular Development Server**
   - Launch the Angular application:
     ```
     ng serve
     ```
   - The frontend will be available at http://localhost:4200

## Testing the Connection

1. Open your browser and navigate to http://localhost:4200
2. Try registering a new user or logging in with existing credentials
3. If everything is set up correctly, the Angular frontend will communicate with the Laravel backend

## Troubleshooting

- **CORS Issues**: If you encounter CORS errors, ensure that your Laravel CORS configuration (in `config/cors.php`) allows requests from http://localhost:4200
- **Database Connection Errors**: Verify your database credentials in the Laravel `.env` file
- **API Connection Issues**: Make sure the Laravel server is running on port 8000, or update the API URL in the Angular environment files if using a different port