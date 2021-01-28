# In-Store Credit Management System
![Mocha Tests](https://github.com/aidanvanleuven/isc-mgmt/workflows/Mocha%20Tests/badge.svg)
![Mocha Tests](https://github.com/aidanvanleuven/isc-mgmt/workflows/Deploy/badge.svg)

Project that mainly performs CRUD operations on a MySQL database. The application uses a PIN only authentication. An admin-level user is the only one that can add other users to the database. By default, the admin user has pin 1234, and the regular user has pin 4321. 

## Frontend
- EJS as a templating engine for building HTML
- Bootstrap for UI
- jQuery for AJAX calls

## Backend
- Node.js for the backend language
- Express for routing
- Passport.js for authentication
- MySQL for data storage

### Local Development
To run this on your local machine, follow these instructions:
- Clone the repository
- Run `npm install`
- Set up the database using the `etc/startup.sql` file
- Make a copy of `.env.example` and rename it to `.env`
- Edit the `.env` file to match your desired configuration
- Use `npm start` to start the server with no logging, or `npm run debug` for verbose logging. Tests are run with `npm test`.

Passing Mocha tests are required to merge pull requests, and automatic deployment is run on any master branch commit. All CI and CD is through GitHub actions. The application is hosted at [https://sc.aidanvanleuven.com](https://sc.aidanvanleuven.com).