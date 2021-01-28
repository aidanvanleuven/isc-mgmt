# In-Store Credit Management System
![Mocha Tests](https://github.com/aidanvanleuven/isc-mgmt/workflows/Mocha%20Tests/badge.svg)

Project that mainly performs CRUD operations on a MySQL database. The application uses PIN only authentication. An admin-level user is the only one that can add other users to the database.

## Frontend
- EJS as a templating engine for building HTML
- Bootstrap for UI
- jQuery for AJAX calls

## Backend
- Node.js for the backend language
- Express for routing
- Passport.js for authentication
- MySQL for data storage

Mocha tests are run on pull requests, and deployment is run on master branch commits, both through GitHub actions. The application is hosted at [https://sc.aidanvanleuven.com](https://sc.aidanvanleuven.com).