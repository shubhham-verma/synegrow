# Synegrow Task Manager

A simple RESTful API for managing tasks, built with Node.js, Express, Sequelize, and SQLite.

## Features

- Create one or more tasks at once
- Retrieve all tasks with pagination
- Search tasks by status and title
- Get, update, or delete a task by ID
- Task status management (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
- Uses SQLite for persistent storage

## Project Structure

```
.
├── controller/
│   └── taskController.js
├── db/
│   ├── index.js
│   └── tasks.sqlite
├── models/
│   └── taskModel.js
├── routes/
│   └── taskRoutes.js
├── index.js
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd synegrow
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Server

Start the server in development mode (with auto-reload):

```sh
npm run dev
```

Or in production mode:

```sh
npm start
```

The API will be available at [http://localhost:3000/api](http://localhost:3000/api).

## API Endpoints

| Method | Endpoint                | Description                        |
|--------|-------------------------|------------------------------------|
| POST   | `/api/tasks/create`     | Create one or more tasks           |
| GET    | `/api/tasks/get`        | Get all tasks (paginated)          |
| GET    | `/api/tasks/get/:id`    | Get a task by ID                   |
| PUT    | `/api/tasks/update/:id` | Update a task by ID                |
| DELETE | `/api/tasks/delete/:id` | Delete a task by ID                |
| GET    | `/api/tasks/search`     | Search tasks by status and/or title|

### Example: Creating Tasks

POST `/api/tasks/create`

```json
[
  {
    "title": "Buy groceries",
    "description": "Milk, Bread, Eggs",
    "status": "PENDING"
  },
  {
    "title": "Read a book",
    "description": "Finish reading 'Atomic Habits'"
  }
]
```

### Example: Searching Tasks

GET `/api/tasks/search?status=COMPLETED&title=groceries&page=1&limit=5`

## Task Model

- `id` (UUID, auto-generated)
- `title` (string, required)
- `description` (string, optional)
- `status` (enum: `PENDING`, `IN_PROGRESS`, `COMPLETED`)

## License

ISC