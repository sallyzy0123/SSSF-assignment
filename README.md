# SSSF-assignment
This repository is for Server-side Scripting Frameworks assignment. Based on the 2nd-year course 'Basic Concepts of Web Applications', the course goal is to get command of TypeScript, MongoDB, and GraphQL API.

- Week 1: Convert express app made with JS to TypeScript
- Week 2: Convert SQL database to MongoDB
- Week 3: Convert Rest API to GraphQL API
- Week 4 & 5: Add user authentication.

## Getting started

- Clone this repo
- create .env based on .env.example
- `npm i` to install dependencies
- `npm run dev` to start development server
- `npm run test` to run tests


## Create types/interfaces based on these objects:

Cat:

```json
{
  "cat_id": 41,
  "cat_name": "Siiri",
  "weight": 4,
  "filename": "9434b5b5d9222ed366d22ebcc8e5c828",
  "birthdate": "2010-03-04",
  "lat": 60.258116666666666,
  "lng": 24.84575,
  "owner": {
    "user_id": 37,
    "user_name": "Test User"
  }
}
```

User:

```json
{
  "user_id": 37,
  "user_name": "Test User",
  "email": "john@metropolia.fi",
  "role": "user", // or "admin"
  "password": "1234"
}
```

