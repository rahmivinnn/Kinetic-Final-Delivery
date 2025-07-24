# 🚀 Kinetic Rehab - Deployment Guide

Comprehensive guide for deploying the Kinetic Rehab application to Fly.io and setting up continuous deployment with GitHub Actions.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** or **npm** package manager
3. **Fly.io CLI** (flyctl)
4. **Fly.io account**
5. **Git** (for version control)
6. **GitHub account** (for continuous deployment)

## 🛠️ Setup Fly.io

### 1. Install Fly.io CLI

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**macOS/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Login ke Fly.io
```bash
flyctl auth login
```

### 3. Verify Installation
```bash
flyctl version
flyctl auth whoami
```

## 🚀 Deployment Methods

### Method 1: Using Deployment Script

1. **Run the deployment script:**
   ```bash
   # Make the script executable (Linux/macOS)
   chmod +x deploy.sh
   
   # Run the script
   ./deploy.sh
   ```

### Method 2: Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   # or
   pnpm build
   ```

2. **Launch the application on Fly.io (first-time only):**
   ```bash
   flyctl launch
   ```
   - Choose an app name (default: kinetic-rehab)
   - Select a region (recommended: Singapore - sin)
   - Skip database setup for now
   - Deploy now? **Yes**

3. **Deploy the application (for subsequent deployments):**
   ```bash
   flyctl deploy
   ```

### Method 3: Continuous Deployment with GitHub Actions

1. **Push your code to GitHub:**
   ```bash
   # Initialize Git repository (if not already done)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Add remote repository
   git remote add origin https://github.com/rahmivinnn/Kinetic-Final-Delivery.git
   
   # Push to GitHub
   git push -u origin main
   ```

2. **Create a Fly.io API token:**
   ```bash
   flyctl tokens create deploy -x 999999h
   ```
   Copy the generated token (including the `FlyV1` prefix).

3. **Add the token as a GitHub secret:**
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `FLY_API_TOKEN`
   - Value: Paste the token you copied
   - Click "Add secret"

4. **GitHub Actions workflow:**
   The repository already includes a GitHub Actions workflow file at `.github/workflows/deploy.yml` that will automatically deploy your application when you push to the main branch.

## 📁 Configuration Files

### fly.toml
Main Fly.io configuration file that contains:
- App name and region
- HTTP service configuration
- VM specifications
- Health checks
- Deployment settings

### Dockerfile
Multi-stage Docker build for:
- Installing dependencies with pnpm
- Building the Next.js application
- Creating a production image
- Optimizing for deployment

### .dockerignore
Excludes unnecessary files from the Docker build:
- node_modules
- .next
- Development files
- Git files

### .github/workflows/deploy.yml
GitHub Actions workflow file for continuous deployment:
- Triggers on push to the main branch
- Sets up Fly.io CLI
- Deploys the application using the FLY_API_TOKEN secret

## 🔧 Environment Variables

### Setting Environment Variables in Fly.io

```bash
# Set a single variable
flyctl secrets set NODE_ENV=production

# Set multiple variables at once
flyctl secrets set DATABASE_URL=your_db_url API_KEY=your_api_key
```

### Viewing Current Environment Variables

```bash
flyctl secrets list
```

### Removing Environment Variables

```bash
flyctl secrets unset DATABASE_URL
```

### Environment Variables in GitHub Actions

For sensitive environment variables that need to be used during the GitHub Actions deployment process:

1. Add them as GitHub repository secrets (Settings > Secrets and variables > Actions)
2. Reference them in the workflow file:

```yaml
env:
  MY_SECRET: ${{ secrets.MY_SECRET }}
```

## 🔍 Monitoring and Troubleshooting

### View Application Logs

```bash
flyctl logs
```

### Check Application Status

```bash
flyctl status
```

### SSH into the VM

```bash
flyctl ssh console
```

## 📚 Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

## 📊 Monitoring & Management

### Check App Status
```bash
flyctl status
```

### View Logs
```bash
# Real-time logs
flyctl logs

# Historical logs
flyctl logs --since=1h
```

### Scale Application
```bash
# Scale to 2 instances
flyctl scale count 2

# Scale VM size
flyctl scale vm shared-cpu-2x
```

### SSH into Container
```bash
flyctl ssh console
```

## 🌐 Custom Domain

1. **Add custom domain:**
   ```bash
   flyctl certs create your-domain.com
   ```

2. **Check certificate status:**
   ```bash
   flyctl certs show your-domain.com
   ```

3. **Update DNS records** sesuai instruksi dari Fly.io

## 🔄 CI/CD with GitHub Actions

The repository already includes a GitHub Actions workflow file at `.github/workflows/deploy.yml` with the following configuration:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    concurrency: deploy-group    # ensure only one action runs at a time
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

This workflow will automatically deploy your application to Fly.io whenever you push changes to the main branch of your GitHub repository.

## 🐛 Troubleshooting

### Common Issues

1. **Build fails:**
   - Check Node.js version compatibility (v18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors
   - Review build logs: `flyctl deploy --build-only`

2. **App won't start:**
   - Check logs: `flyctl logs`
   - Verify PORT environment variable is set to 3000
   - Check health check endpoint configuration in fly.toml
   - Ensure the app is listening on the correct port

3. **Memory issues:**
   - Scale VM: `flyctl scale vm shared-cpu-1x --memory 1024`
   - Check memory usage: `flyctl ssh console` then `htop`
   - Consider optimizing the application for lower memory usage

4. **GitHub Actions deployment fails:**
   - Verify the FLY_API_TOKEN secret is correctly set
   - Check if the main branch name matches your repository's default branch
   - Review the GitHub Actions logs in the repository's Actions tab

### Useful Commands

```bash
# Restart app
flyctl apps restart kinetic-rehab

# Open app in browser
flyctl open

# Destroy app (careful!)
flyctl apps destroy kinetic-rehab

# List all apps
flyctl apps list

# Check app status
flyctl status

# View real-time logs
flyctl logs
```

## 🔒 Security Considerations

- Never commit sensitive environment variables or API keys to your repository
- Use GitHub secrets for storing sensitive information
- Regularly update dependencies to patch security vulnerabilities
- Consider setting up security scanning for your repository
- Review Fly.io's security documentation for best practices

## 💰 Pricing

Estimated Fly.io pricing for this application:
- **Shared CPU (1x):** ~$1.94/month
- **Memory (1GB):** ~$2.23/month
- **Bandwidth:** $0.02/GB
- **Estimated total:** ~$5-10/month

Refer to the [Fly.io pricing page](https://fly.io/docs/about/pricing/) for the most up-to-date information.

## 📞 Support Resources

- **Fly.io Documentation:** [https://fly.io/docs/](https://fly.io/docs/)
- **Fly.io Community:** [https://community.fly.io/](https://community.fly.io/)
- **GitHub Actions Documentation:** [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Next.js Deployment Documentation:** [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

**Happy Deploying! 🚀**