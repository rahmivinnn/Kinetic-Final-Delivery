#!/bin/bash

# Kinetic Rehab - Fly.io Deployment Script
# This script automates the deployment process to Fly.io

echo "🚀 Starting Kinetic Rehab deployment to Fly.io..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it first:"
    echo "   Visit: https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi

# Check if user is logged in to Fly.io
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Please log in to Fly.io first:"
    echo "   Run: flyctl auth login"
    exit 1
fi

echo "✅ flyctl is installed and you are logged in"

# Build the application
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to Fly.io
echo "🚀 Deploying to Fly.io..."
flyctl deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your app should be available at: https://kinetic-rehab.fly.dev"
    echo "📊 Check status: flyctl status"
    echo "📝 View logs: flyctl logs"
else
    echo "❌ Deployment failed. Check the logs for more details."
    echo "📝 View logs: flyctl logs"
    exit 1
fi