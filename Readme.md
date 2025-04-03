# Employee Management System

This is a full-stack application for managing employees, built using Angular for the frontend and Node.js with MongoDB for the backend. The application is containerized using Docker and orchestrated with Docker Compose.

## Features

- **Frontend**: Built with Angular, providing a user-friendly interface for managing employees.
- **Backend**: Built with Node.js and Express, connected to a MongoDB database for storing employee data.
- **Dockerized**: Both the frontend and backend are containerized for easy deployment.
- **MongoDB Integration**: Persistent storage for employee data.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd 101411302_comp3133_assignment2
```

### 2. Build and Run the Containers

Use Docker Compose to build and start the containers:

```bash
docker-compose up --build
```
 
### 3. Access the Application
- Frontend: Open your browser and navigate to http://localhost:4200.
- Backend: The backend server runs on http://localhost:5000.

## Project Structure
```bash
.
├── frontend/               # Angular frontend application
│   ├── Dockerfile          # Dockerfile for the frontend
│   └── ...                 # Other Angular files
├── backend/                # Node.js backend application
│   ├── Dockerfile          # Dockerfile for the backend
│   └── ...                 # Other backend files
├── [docker-compose.yml]    # Docker Compose configuration
└── [README.md]             # Project documentation
```

## Author
- Name: Conor Le (Thanh Vu Le)
- Student ID: 101411302
- Course: COMP3133