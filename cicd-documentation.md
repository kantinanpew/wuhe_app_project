# CI/CD Documentation for Tea Farm Management App

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) setup for the Tea Farm Management App.

## Overview

The CI/CD pipeline is implemented using GitHub Actions. It automates the process of building, testing, and deploying the application whenever changes are pushed to the main branch.

## Workflow Steps

1. **Trigger**: The workflow is triggered on pushes to the main branch and pull requests targeting the main branch.

2. **Environment Setup**: The workflow runs on an Ubuntu latest runner.

3. **Checkout**: The repository is checked out using the `actions/checkout@v2` action.

4. **Docker Setup**: Docker Buildx is set up for building multi-platform images.

5. **Docker Hub Login**: The workflow logs into Docker Hub using credentials stored in GitHub Secrets.

6. **Build and Push Client Image**:
   - Builds the client Docker image
   - Tags the image with the latest tag
   - Pushes the image to Docker Hub

7. **Build and Push Server Image**:
   - Builds the server Docker image
   - Tags the image with the latest tag
   - Pushes the image to Docker Hub

8. **Deploy to Firebase**: (If applicable)
   - Uses the Firebase CLI to deploy Firestore rules and configurations

## Configuration

The CI/CD pipeline is configured in the `.github/workflows/ci-cd.yml` file. Key configurations include:

- Docker Hub credentials (stored as GitHub Secrets)
- Firebase token (stored as a GitHub Secret)
- Build contexts for client and server images

## GitHub Secrets

The following secrets need to be set in the GitHub repository settings:

- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token
- `FIREBASE_TOKEN`: Your Firebase CI token (if using Firebase deployment)

## Deployment

The deployment process involves pushing the Docker images to Docker Hub. For production deployment:

1. Pull the latest images from Docker Hub
2. Update the `docker-compose.yml` file on the production server if necessary
3. Run `docker-compose up -d` on the production server to deploy the updated containers

## Monitoring and Logging

- GitHub Actions provides logs for each workflow run
- Docker Hub shows the history of pushed images
- For production monitoring, consider setting up logging and monitoring solutions like ELK stack or Prometheus/Grafana

## Rollback Procedure

In case of issues with a new deployment:

1. Identify the last known good image tags
2. Update the `docker-compose.yml` file on the production server to use these tags
3. Run `docker-compose up -d` to deploy the previous version

## Best Practices

- Keep secrets and environment variables secure using GitHub Secrets
- Regularly update dependencies and Docker base images
- Implement proper versioning for your Docker images (e.g., using git SHA or semantic versioning)
- Include automated tests in the CI pipeline to ensure code quality

## Troubleshooting

Common issues and their solutions:

- Build failures: Check Dockerfile and dependency issues
- Push failures: Verify Docker Hub credentials and repository permissions
- Deployment failures: Check Firebase token and project configurations

For any persistent issues, review the GitHub Actions logs and Docker Hub push history.
