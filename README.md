# WELCOME TO MY AUTHENTICATION & AUTHORIZATION EXAMPLE FOR CNPM

## Description

A Nodejs application using JWT for authentication and authorization.

## Installation

```bash
# install dependencies
$ pnpm install
```

## Running the app

```bash
# production mode
$ pnpm run start

# development mode
$ pnpm run dev
```

## API Requests and Responses

``` bash
# Signup
$ POST /signup
# Request
{
    "username": "username",
    "password": "password",
    "isAdmin": true
}
# Response
{
    "message": "Signup successfully"
}

# Login
$ POST /login
# Request
{
    "username": "username",
    "password": "password"
}
# Response
{
    "message": "Signup successfully",
    "user": {
        "username": "username",
        "password": "password",
        "isAdmin": true
    },
    "token": "token"
}

# Get all users
$ GET /users
# Request
{
    "token": "token"
}
# Response
[
    {
        "username": "username",
        "password": "password",
        "isAdmin": true
    },
    {
        "username": "username",
        "password": "password",
        "isAdmin": false
    }
]

# Get user by id
$ GET /users/:id
# Request 
{
    "token": "token"
}
# Response
{
    "username": "username",
    "password": "password",
    "isAdmin": true
}
```

## Author

Hoàng Mạnh Đức - DucDevComplicated
