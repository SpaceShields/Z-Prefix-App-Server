# Node.js Express API

## Overview
This project is a RESTful API built using Node.js, Express, Prisma, and Jest. The API provides endpoints for managing resources, following best practices for structure, security, and performance.

---

## Prerequisites

- [Node.js v23.6.0](https://nodejs.org/): Ensure you have this specific version installed.
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/): Package manager for Node.js.
- A PostgreSQL, MySQL, or SQLite database for Prisma.

---

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   - Update the `DATABASE_URL` in the `.env` file with your database connection string.
   - Run the Prisma migrations to set up the database schema:
     ```bash
     npx prisma migrate dev
     ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000` by default.

---

## Scripts

- **Start the development server**:
  ```bash
  npm run dev
  ```
- **Run tests**:
  ```bash
  npm test
  ```
- **Build for production**:
  ```bash
  npm run build
  ```
- **Run production build**:
  ```bash
  npm start
  ```
- **Run Prisma commands**:
  ```bash
  npx prisma <command>
  ```

---

## Technologies Used

### Backend
- **Node.js v23.6.0**: JavaScript runtime.
- **Express v4.21.2**: Web framework.

### ORM
- **Prisma v6.2.1**: Database ORM and query engine.

### Testing
- **Jest v29.7.0**: JavaScript testing framework.

---

## File Structure
```
├── controllers    # Route handlers
├── routes         # Express routes
├── app.js         # Express app configuration
├── prisma
│   ├── schema.prisma  # Prisma schema
│   └── migrations     # Database migrations
├── .env               # Environment variables
├── package.json       # Project metadata and dependencies
└── README.md          # Documentation
```

---

## Environment Variables

Create a `.env` file in the root of the project with the following keys:
```env
DATABASE_URL=<your-database-connection-string>
PORT=5000
```

---

## Example Endpoints

### GET `/items`
- **Description**: Fetch all items.
- **Response**:
  ```json
  [
    {
        "id": 1,
        "itemName": "Item Name",
        "description": "Item Description",
        "userId": 1,
        "quantity": 1
    },
    {
        "id": 2,
        "itemName": "Item 2 Name",
        "description": "Item 2 Description",
        "userId": 1,
        "quantity": 2
    }
  ]
  ```

### POST `/users/login`
- **Description**: Log in an existing user.
- **Request Body**:
  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "JWT token"
  }
  ```

---

## Testing

Run all test cases with Jest:
```bash
npm test
```

- Test files are located in the `tests` directory.
- Use the `.test.js` suffix for test files.

---

## Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Start the production server**:
   ```bash
   npm start
   ```

Deploy the application on platforms like [Heroku](https://www.heroku.com/), [Vercel](https://vercel.com/), or [AWS](https://aws.amazon.com/).

---

## License
This project is licensed under the [MIT License](LICENSE).
