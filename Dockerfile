# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies
# RUN npm install
RUN rm -rf node_modules package-lock.json \
&& npm install --no-optional

# Copy the rest of your application code to the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3011

# Define the command to run the app
CMD ["npm", "start"]
