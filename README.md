# Tea Farm Management App

🏆Got funding and Awards winner for "Meet Pacific 2024" event in Hualien, Taiwan.🏆

A comprehensive solution for managing tea farms using modern web technologies and containerization.

## Features

- React Native frontend for cross-platform mobile support
- Node.js/Express backend for robust API services
- Firebase integration for real-time data management and authentication
- Dockerized for easy deployment and scalability

## Prerequisites

- Docker and Docker Compose
- Node.js and npm
- Firebase account and project set up

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/tea-farm-management-app.git
   cd tea-farm-management-app
   ```

2. Set up environment variables:
   - Create a `.env` file in the `client` directory for frontend environment variables
   - Create a `.env` file in the `server` directory for backend environment variables

3. Build and run the Docker containers:
   ```
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:19000
   - Backend API: http://localhost:3000

## Project Structure

```
tea-farm-app/
├── client/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── server/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci-cd.yml
└── README.md
```

## Development

- To add new features or fix bugs, create a new branch and submit a pull request
- Ensure all tests pass before merging changes
- Follow the established coding standards and practices

## Deployment

CI/CD Pipeline
This project uses GitHub Actions for Continuous Integration and Continuous Deployment. The pipeline automatically builds Docker images for both the client and server, pushes them to Docker Hub, and deploys Firestore rules to Firebase.
Workflow

On push or pull request to the main branch, the CI/CD pipeline is triggered.
Docker images are built for both client and server.
Images are pushed to Docker Hub with the 'latest' tag.
Firestore rules are deployed to Firebase.

Setup
To use the CI/CD pipeline:

Ensure Dockerfile and docker-compose.yml are present in the repository.
Set up the following secrets in your GitHub repository settings:

DOCKERHUB_USERNAME: Your Docker Hub username
DOCKERHUB_TOKEN: Your Docker Hub access token
FIREBASE_TOKEN: Your Firebase CI token (if using Firebase)


The workflow file is located at .github/workflows/ci-cd.yml.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
