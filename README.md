# Kinetic Rehab Platform

[![Deployed on Fly.io](https://img.shields.io/badge/Deployed%20on-Fly.io-purple?style=for-the-badge&logo=fly-dot-io)](https://kinetic-rehab.fly.dev)

## Overview

Kinetic Rehab is a comprehensive physiotherapy platform that combines AI-powered movement analysis with personalized rehabilitation programs. The platform enables remote monitoring, real-time feedback, and seamless communication between patients and physiotherapists.

## Features

- **AI-Powered Movement Analysis**: Real-time pose estimation and movement tracking
- **Personalized Rehabilitation Programs**: Customized exercise routines based on patient needs
- **Video Library**: Store and review exercise demonstrations and patient submissions
- **Progress Tracking**: Monitor recovery metrics and improvement over time
- **Secure Messaging**: Direct communication between patients and physiotherapists
- **Appointment Scheduling**: Book and manage virtual consultation sessions
- **Feedback System**: Detailed analysis and recommendations for exercise improvement

## Deployment

The project is deployed on Fly.io at:

**[https://kinetic-rehab.fly.dev](https://kinetic-rehab.fly.dev)**

### Manual Deployment

To deploy manually to Fly.io:

1. Install the Fly.io CLI:
   ```bash
   # On macOS
   brew install flyctl
   
   # On Linux
   curl -L https://fly.io/install.sh | sh
   
   # On Windows (using PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. Login to Fly.io:
   ```bash
   flyctl auth login
   ```

3. Deploy the application:
   ```bash
   ./deploy.sh
   ```
   
   Or use the flyctl command directly:
   ```bash
   flyctl deploy
   ```

### GitHub Actions Deployment

The project is configured for continuous deployment using GitHub Actions:

1. Push your code to the GitHub repository:
   ```bash
   git remote add origin https://github.com/rahmivinnn/Kinetic-Final-Delivery.git
   git push -u origin main
   ```

2. Set up a Fly.io API token in GitHub:
   - Generate a token: `flyctl tokens create deploy -x 999999h`
   - Add the token as a repository secret named `FLY_API_TOKEN` in your GitHub repository settings

3. The GitHub Actions workflow will automatically deploy your application when you push to the main branch

## Local Development

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/rahmivinnn/Kinetic-Final-Delivery.git
   cd Kinetic-Final-Delivery
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
# or
pnpm build
```

## Technologies

- **Frontend**: Next.js, React, Tailwind CSS
- **AI**: TensorFlow.js for pose estimation
- **Deployment**: Fly.io
- **CI/CD**: GitHub Actions
