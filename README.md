# Mini Library API

This project is a sample API for assessing student competencies. This repository provides backend API only and Swagger documentation.

## Prerequisite

1. Internet connection for installation
2. An active Github account
3. An empty PostgreSQL database
4. NodeJS installed

## Installation

To install this project, you need to clone the repository

```
git clone https://github.com/setiawanjoko/minilibrary.git
```

## Usage

Before using it, make sure you already made an empty PostgreSQL database. Then follow instructions below.

1. Locate your project folder
    ```
    cd {PROJECT_FOLDER}
    ```

2. Install Node package
    ```
    npm install
    ```

3. Copy ```.env-example``` to ```.env```
    ```
    cp .env-example .env
    ```

4. Modify ```.env``` to match your database credentials
    ```
    port=3000
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASSWORD=password
    DB_NAME=minilibrary
    DB_PORT=5432

    JWT_SECRET=rahasia_super_aman
    JWT_EXPIRES_IN=1d
    ```

5. Run pre-scripted runner script to migrate and seed your database
    ```
    npm run first-run
    ```

6. Run the project
    ```
    npm run dev
    ```

7. Read the documentation by opening the link in browser