# Tea Farm App Development Documentation

## Table of Contents
1. Git Workflow
2. Docker Image Usage
3. Firebase Integration
4. Mobile App Development and Testing
5. Continuous Integration and Deployment (CI/CD)

## 1. Git Workflow

We'll use a feature branch workflow for our development process. Here's the step-by-step process:

1. Ensure your local main branch is up-to-date:
   ```
   git checkout main
   git pull origin main
   ```

2. Create a new feature branch:
   ```
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit them:
   ```
   git add .
   git commit -m "Descriptive commit message"
   ```

4. Push your feature branch to GitHub:
   ```
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request (PR) on GitHub from your feature branch to the main branch.

6. After review and approval, merge the PR into the main branch.

7. Delete the feature branch after merging:
   ```
   git branch -d feature/your-feature-name
   ```

**Note:** Never push directly to the main branch. All changes should go through Pull Requests.

## 2. Docker Image Usage

Our CI/CD pipeline builds and pushes Docker images to Docker Hub. Here's how to use them:

### For development:
Use the docker-compose.yml file in the repository to build and run the containers locally:

```
docker-compose up --build
```

This ensures you're working with the latest code and allows for easy local development.

### For testing the latest production build:
Pull the latest images from Docker Hub:

```
docker pull yourdockerhubusername/tea-farm-client:latest
docker pull yourdockerhubusername/tea-farm-server:latest
```

Then run them using docker-compose:

```
docker-compose up
```

This allows you to test the exact images that are deployed in production.

## 3. Firebase Integration

Our app uses Firebase for backend services. Here's what you need to know:

1. Data Storage: When you create forms or store data, it will be stored on the Firebase cloud servers, not locally.

2. Local Development:
   - Use the Firebase Emulator Suite for local development. This allows you to work offline and not affect the production data.
   - Install the Firebase CLI: `npm install -g firebase-tools`
   - Start the emulator: `firebase emulators:start`

3. Accessing Production Data:
   - Be cautious when working with production data.
   - Use Firebase Security Rules to protect your data in both development and production environments.

4. Deploying Firebase Changes:
   - Firebase configuration changes (like security rules) are deployed through the CI/CD pipeline when merged to main.
   - For manual deployment (if necessary), use: `firebase deploy --only firestore`

## 4. Mobile App Development and Testing

Our React Native app can be tested on both simulators and physical devices:

### Using Expo Go:

1. Start your development server:
   ```
   cd client
   npm start
   ```

2. Scan the QR code:
   - iOS: Use the Camera app
   - Android: Use the Expo Go app

3. The app will load on your device and refresh as you make changes.

### Using Simulators:

1. iOS Simulator (Mac only):
   - Install Xcode
   - Run `npm run ios` in the client directory

2. Android Simulator:
   - Install Android Studio and set up an AVD (Android Virtual Device)
   - Run `npm run android` in the client directory

### Building Standalone Apps:

For testing production builds:

1. Create a production build:
   ```
   expo build:android
   expo build:ios
   ```

2. Follow Expo's instructions to download and install the APK (Android) or IPA (iOS) file.

## 5. Continuous Integration and Deployment (CI/CD)

Our CI/CD pipeline automates building, testing, and deployment:

1. Pushing to the main branch triggers the pipeline.
2. The pipeline builds Docker images and pushes them to Docker Hub.
3. It deploys the latest Firestore rules and indexes to Firebase.

To take advantage of CI/CD:
- Ensure all tests pass before merging to main.
- After a successful merge and pipeline run, the latest version will be available on Docker Hub.
- For major updates, consider using versioned tags in addition to 'latest'.

Remember: The main branch should always be in a deployable state. Use feature branches and PRs to maintain code quality.

