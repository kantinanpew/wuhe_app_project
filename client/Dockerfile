FROM node:20

WORKDIR /app

# Install expo-cli globally
RUN npm install -g expo-cli

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose necessary ports
EXPOSE 19000 19001 19002

# Set the command to run the Expo app with tunnel option
CMD ["npx", "expo", "start", "--tunnel"]