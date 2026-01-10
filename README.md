# LAON ATHENAEUM E-Learning Management System (LMS) Project

A full-stack Learning Management System built with Laravel (Backend API) and React (Frontend).

## Prerequisites

Before you begin, ensure you have the following installed on your computer:
* [PHP](https://www.php.net/downloads) (v8.2 or higher)
* [Composer](https://getcomposer.org/) (PHP Dependency Manager)
* [Node.js & npm](https://nodejs.org/) (JavaScript Runtime)

---
## Installation Guide

Since this project has a separate Backend and Frontend, you need to set them up individually.

### 1. Backend Setup (Laravel)

The backend resides in the root directory.

1. **Download from Google Drive**
Download the full project zip file from the provided 
Google Drive link: https://drive.google.com/drive/folders/1tPIqmEsMlEVrpB2JO2HWo9U3_CW3MWTj?usp=sharing
Extract the zip file to your desired folder.

**Open your terminal and navigate into this folder:**
    cd "Laon Athenaeum E-Learning Platform"

*Optional: if vendor/ and node_modules/ are present, you can skip install steps*
2.  **Install PHP Dependencies**
    type this in the terminal:

    composer install
   
3.  **Environment Configuration**
    Copy the example environment file to create the local configuration.
    Type this in the terminal to create the .env file
    cp .env.example .env
   
4.  **Generate Application Key**
    Type this in the terminal to generate a key.
    php artisan key:generate
  
5.  **Database Setup** 
    (See "Database Configuration" section below).

6.  **Open the .env file**
    Edit the database connection like shown or copy the code.
    DB_CONNECTION=mysql 
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=lms_db
    DB_USERNAME=root
    DB_PASSWORD=

## Database Configuration

7. **Import the Database (Sql Text File)**
    Open Laragon -> Press Start All -> 
    Open the Database -> Find the Load SQL file 
    -> Press yes, after that it will be opened on the Open query 
    -> Press F9 or the Execute SQL (The Blue Play Button)
    -> After that refresh the database it should now show on the left side of the screen 
    `lms_db`

### 2. Frontend Setup (React)

The frontend is located in the `LMS-Frontend` subfolder.

1.  **Navigate to the frontend directory**
    Type this in the terminal
    cd "LMS-Frontend"

*Optional: if vendor/ and node_modules/ are present, you can skip install steps*
2.  **After navigating Install the Frontend Dependencies**
    Type this in the terminal
    npm install

3. **Run locally**
    npm run dev
---

## Running the Application
To run the full application, you need **two** terminal windows open simultaneously.

### Terminal 1: Start Backend Server
Inside the root folder (`Laon Athenaeum E-Learning Platform`), 
run: php artisan serve

### Terminal 2: Start Frontend Server
Type this in the terminal
cd LMS-Frontend
run: npm run dev
