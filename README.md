# Exercise Tracker API

This project is an Exercise Tracker API built with Node.js, Express, and MongoDB. It allows users to create accounts, log exercises, and retrieve exercise logs with optional filtering.

[Project Demo](https://exercise-tracker-hrk-2942297fa708.herokuapp.com)

[Examp Requirements](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker)

## Features

- Create a new user
- Add exercises for a user
- Retrieve a list of all users
- Retrieve exercise logs for a user with optional date range and limit

## Endpoints

### Create a New User

**POST** `/api/users`

- **Request Body**: `{ "

username

": "fcc_test" }`
- **Response**: `{ "username": "fcc_test", "_id": "5fb5853f734231456ccb3b05" }`

### Get All Users

**GET** `/api/users`

- **Response**: `[ { "username": "fcc_test", "_id": "5fb5853f734231456ccb3b05" }, ... ]`

### Add an Exercise

**POST** `/api/users/:_id/exercises`

- **Request Body**: `{ "description": "test", "duration": 60, "date": "1990-01-01" }`
- **Response**: `{ "username": "fcc_test", "description": "test", "duration": 60, "date": "Mon Jan 01 1990", "_id": "5fb5853f734231456ccb3b05" }`

### Get Exercise Logs

**GET** `/api/users/:_id/logs`

- **Query Parameters**: `from`, `to`, `limit`
- **Response**: 
  ```json
  {
    "username": "fcc_test",
    "count": 1,
    "_id": "5fb5853f734231456ccb3b05",
    "log": [
      {
        "description": "test",
        "duration": 60,
        "date": "Mon Jan 01 1990"
      }
    ]
  }
  ```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/agmt92/-GitHub-b-boilerplate-project-exercisetracker-
   cd -GitHub-b-boilerplate-project-exercisetracker-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB URI:
   ```
   MONGO_URI=your_mongodb_uri
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. The server will be running on `http://localhost:3000`.

## Dependencies

- express
- mongoose
- body-parser
- cors
- dotenv

## License

This project is licensed under the MIT License.

This is the last test in the Back End Development and APIs Projects course at freeCodeCamp. Please do not copy my code if solving the test.

Test URL: https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker
