# Cat API Backend 🐱

This project is a backend API for managing cat data. It allows you to perform CRUD (Create, Read, Update and Delete) 
operations on a collection of cats stored in a Supabase database for the front-end UI. 

## Technologies 

- Supabase: Database backend for managing and storing cat data. Utilizing Supabase functions to manage how cat data is stored.
- Deno: for testing using unit tests

## Features

- **Fetch Cats** - Retrieves all cats from the database in alphabetical order via a ``GET`` request
- **Adds a New Cat** -  Stores a new cat record using a ``POST`` request
- **Edits a cat** - Updates an existing cat using a ``PUT`` request
- **Removes a cat** - Deletes a cat from the database using a ``DELETE`` request
- **Validation and Error handling** - Ensures only valid data is stored

## Testing

- This project includes a mock supabase database to ensure validation and other util functions can be tested without making calls to the database

- To run tests locally first  `` npm install `` 
- navigate to supabase  `` cd supabase ``
- Run `` npx deno test --no-check ``
- CURL tests and POSTMAN have been used throughout the project to ensure correct information was being received and sent 

## Server and API Integration

- The server that makes API calls to specific endpoints lives on the front-end codebase 
https://github.com/tarynJade/tb-frontend-project.git

- The frontend interacts with the API and can be run seperately within the same project
- For more details head to the project above.





