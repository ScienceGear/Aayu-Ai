# Aayu AI

Your trusted elder care companion

## Version 0.3.1

### Features
- Elder care dashboard
- Caregiver portal
- Organization management
- Medicine reminders
- Emergency assistance
- Exercise tracking
- Virtual garden
- AI assistant

## Development

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Bun installed - [install Bun](https://bun.sh/docs/installation)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone git@github.com:ScienceGear/Aayu-Ai.git

# Step 2: Navigate to the project directory.
cd Aayu-Ai

# Step 3: Install the necessary dependencies.
bun install

# Step 4: Start the development server with auto-reloading and an instant preview.

# Step 4: Start the development server with auto-reloading and an instant preview.
bun run dev --host --port 8080
```

## Running Locally (Single Port Mode)

To run the application on a single port (localhost:3000), simulating a production environment:

1. Double-click `start-app.bat` (Windows)
   OR run:
   ```sh
   npm start
   ```
   This will build the frontend and start the server at [http://localhost:3000](http://localhost:3000).


## What technologies are used for this project?

This project is built with:

- Bun 1.3.4
- Vite 7.2.7
- TypeScript
- React 19.2.1
- shadcn-ui
- Tailwind CSS

## Deployment

Build the project for production:

```sh
bun run build
```
