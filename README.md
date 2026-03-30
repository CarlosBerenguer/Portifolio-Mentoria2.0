# PsyControl – Management System for Psychologists

PsyControl is a web system designed to help psychologists manage their patients and clinical progress notes. The system allows patient registration, recording of session notes, and provides an intuitive interface to track the full history of appointments.

## Features

- **User Authentication**: Secure login and registration system for psychologists.
- **Patient Management**: Create, edit, view, and delete patients.
- **Progress Notes**: Record session notes and clinical follow-up.
- **Image Upload**: Add profile photos for users and patients.
- **Documented API**: Full API documentation using Swagger.

## 🛠️ Technologies Used

### 🖥️ Backend
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) **Node.js** – JavaScript runtime
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white) **Express.js** – Web framework
- ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white) **MySQL** – Relational database
- ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) **JWT** – Authentication and authorization
- ![Multer](https://img.shields.io/badge/Multer-FF6B6B?style=for-the-badge&logo=node.js&logoColor=white) **Multer** – File upload
- ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) **Swagger** – API documentation
- ![bcrypt](https://img.shields.io/badge/bcrypt-4A90E2?style=for-the-badge&logo=security&logoColor=white) **bcryptjs** – Password hashing
- ![CORS](https://img.shields.io/badge/CORS-FF6B35?style=for-the-badge&logo=cors&logoColor=white) **CORS** – Cross-Origin Resource Sharing
- ![Day.js](https://img.shields.io/badge/Day.js-FF5F56?style=for-the-badge&logo=javascript&logoColor=white) **Day.js** – Date handling
- ![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black) **dotenv** – Environment variables

### 🎨 Frontend
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) **HTML5** – Page structure
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) **CSS3** – Styling
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) **JavaScript** – Interactivity
- ![Materialize](https://img.shields.io/badge/Materialize-EE6E73?style=for-the-badge&logo=material-design&logoColor=white) **MaterializeCSS** – CSS framework
- ![Material Icons](https://img.shields.io/badge/Material_Icons-757575?style=for-the-badge&logo=material-design&logoColor=white) **Material Icons** – UI icons

### 🧪 Testing and QA

#### E2E Testing
- ![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white) **Cypress** – End-to-end testing
- ![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=for-the-badge&logo=cucumber&logoColor=white) **Cucumber** – BDD (Behavior Driven Development)
- ![ESBuild](https://img.shields.io/badge/ESBuild-FFCF00?style=for-the-badge&logo=esbuild&logoColor=black) **ESBuild** – Bundler for preprocessing

#### API Testing
- ![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white) **Mocha** – Test framework
- ![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white) **Chai** – Assertion library
- ![Supertest](https://img.shields.io/badge/Supertest-07BA82?style=for-the-badge&logo=testing-library&logoColor=white) **Supertest** – HTTP API testing
- ![Mochawesome](https://img.shields.io/badge/Mochawesome-FF6B6B?style=for-the-badge&logo=mocha&logoColor=white) **Mochawesome** – Test reporting

#### Performance Testing
- ![K6](https://img.shields.io/badge/K6-7D64FF?style=for-the-badge&logo=k6&logoColor=white) **K6** – Load and performance testing

### 🔧 Development Tools
- ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white) **Nodemon** – Server auto-reload
- ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) **Git** – Version control
- ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) **npm** – Package manager
- ![PowerShell](https://img.shields.io/badge/PowerShell-5391FE?style=for-the-badge&logo=powershell&logoColor=white) **PowerShell** – Development terminal

### 📊 Database
- ![MySQL2](https://img.shields.io/badge/MySQL2-4479A1?style=for-the-badge&logo=mysql&logoColor=white) **mysql2** – MySQL driver for Node.js

### 🔐 Security
- ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) **jsonwebtoken** – Authentication tokens
- ![bcrypt](https://img.shields.io/badge/bcrypt-4A90E2?style=for-the-badge&logo=security&logoColor=white) **bcryptjs** – Password hashing

### 📝 Documentation
- ![Swagger](https://img.shields.io/badge/Swagger_JSDoc-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) **swagger-jsdoc** – Documentation generation
- ![Swagger UI](https://img.shields.io/badge/Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) **swagger-ui-express** – Documentation UI
- ![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white) **Markdown** – Project documentation

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-user/psycontrol.git
   cd psycontrol
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file at the project root based on `.env.example`
   - Fill in the database connection information and other required settings

4. Initialize the database:
   ```bash
   npm run init-db
   ```

5. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

7. Access the application at `http://localhost:3000`

## Project Structure

```text
├── docs/                  # Project documentation
├── src/
│   ├── backend/
│   │   ├── config/        # Server and database configuration
│   │   ├── controllers/   # Application controllers
│   │   ├── middlewares/   # Custom middlewares
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── uploads/       # Directory for uploaded files
│   │   ├── app.js         # Express app configuration
│   │   └── server.js      # Server entry point
│   └── frontend/          # Frontend files (HTML, CSS, JS)
├── .env                   # Environment variables
├── .env.example           # Environment variables example
└── package.json           # Dependencies and scripts
```

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when the server is running.

## Default User (after running seed)

- **User**: `carlos`
- **Password**: `123`

## Testing and Quality Assurance (QA)

The project includes a complete automated test suite to ensure system quality and reliability.

### Test Structure

```text
QA/
├── Cypress/              # E2E tests with Cypress
├── Supertest-API/        # API tests with Supertest
└── K6-Performance/       # Performance tests with K6
```

### 1. E2E Tests with Cypress

User interface and full application flow tests.

#### Installation and Execution

```bash
# Go to the Cypress directory
cd QA/Cypress

# Install dependencies
npm install

# Run tests in headless mode
npx cypress run

# Run tests in interactive mode
npx cypress open
```

#### Features Covered
- ✅ User registration with random CPF
- ✅ Login and authentication
- ✅ Navigation between pages
- ✅ Form validation

#### Fixes Implemented
- Fixed CSS selectors in the Page Object Model
- Implemented random CPF generation for tests
- Configured correct `baseUrl`
- Fixed asynchronous custom commands

### 2. API Tests with Supertest

Automated tests to validate API endpoints.

#### Installation and Execution

```bash
# Go to the Supertest directory
cd QA/Supertest-API

# Install dependencies
npm install 

# Run tests
npm test
```

#### Endpoints Tested
- ✅ POST /api/auth/login – Login with valid credentials (200)
- ✅ POST /api/auth/login – Login with invalid credentials (401)

#### Fixes Implemented
- Resolved `ERR_REQUIRE_ESM` error by downgrading `chai` (6.0.1 → 4.5.0)
- Fixed API endpoint URLs
- Adjusted HTTP request payload formats

### 3. Performance Tests with K6

Load and performance tests to evaluate application behavior under stress.

#### K6 Installation

```bash
# Windows (via Chocolatey)
choco install k6

# Or download directly from: https://k6.io/docs/get-started/installation/
```

#### Execution

```bash
# Go to the K6 directory
cd QA/K6-Performance

# Run the login test
k6 run tests/login.k6.js

# Run with HTML report
k6 run --out html=html-report.html tests/login.k6.js
```

#### Metrics Evaluated
- ✅ API response time
- ✅ Request success rate
- ✅ Throughput (requests per second)
- ✅ Latency and connection time

#### Fixes Implemented
- Fixed login API URL
- Implemented `JSON.stringify` for correct payload format
- Enabled HTTP status checks

## Fixes and Improvements Implemented

### Frontend
- ✅ Fixed inconsistent IDs between HTML and JavaScript
- ✅ Implemented data validation on the patient detail page
- ✅ Improved user experience with clear error messages

### Backend
- ✅ Robust validation on API endpoints
- ✅ Proper HTTP error handling
- ✅ Performance optimizations for database queries

### Tests
- ✅ Full E2E test implementation with Cypress
- ✅ Automated API tests with Supertest
- ✅ Performance tests with K6
- ✅ Random data generation for tests (CPF, names, etc.)

## How to Run the Entire Project

### 1. Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd Portifolio-Mentoria2.0

# Install main project dependencies
npm install

# Set up the database
npm run init-db
npm run seed
```

### 2. Run the Application

```bash
# Start the server
npm run dev

# The application will be available at http://localhost:3000
```

### 3. Run All Tests

```bash
# E2E Tests (Cypress)
cd QA/Cypress
npm install
npx cypress run

# API Tests (Supertest)
cd ../Supertest-API
npm install
npm test

# Performance Tests (K6)
cd ../K6-Performance
k6 run tests/login.k6.js
```

## Test Dependencies

### Cypress
- cypress: ^13.16.1
- @badeball/cypress-cucumber-preprocessor: ^21.0.2
- @bahmutov/cypress-esbuild-preprocessor: ^2.2.3

### Supertest-API
- chai: ^4.5.0 (downgrade for CommonJS compatibility)
- mocha: ^11.7.1
- supertest: ^7.1.4

### K6-Performance
- k6 (global installation required)

## License

This project is licensed under the MIT License – see the LICENSE file for details.

## Author

Developed as part of the portfolio for the **Mentoria 2.0** program by **Julio de Lima**.
