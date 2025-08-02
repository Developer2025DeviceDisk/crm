# AWS Deployment Guide

This project includes automated deployment to AWS Elastic Beanstalk using GitHub Actions and CloudFormation.

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Set up the required environment variables

## Setup Instructions

### 1. AWS Configuration

#### Create IAM User for GitHub Actions
1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach the following policies:
   - `AWSElasticBeanstalkFullAccess`
   - `AWSCloudFormationFullAccess`
   - `IAMFullAccess` (for creating roles)
   - `EC2FullAccess`

#### Get AWS Credentials
- Save the Access Key ID and Secret Access Key

### 2. GitHub Secrets Configuration

In your GitHub repository, go to Settings > Secrets and Variables > Actions, and add:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
```

**Note**: Choose your preferred AWS region for `AWS_REGION` (e.g., us-east-1, us-west-2, eu-west-1, ap-southeast-1, etc.)

### 3. Environment Variables Setup

Since we're using hardcoded values in the `env.js` file, no additional environment variables need to be configured in AWS Elastic Beanstalk. However, for production, consider using AWS Secrets Manager or Elastic Beanstalk environment properties for sensitive data.

### 4. Deployment Process

The deployment happens automatically when you push to the `main` or `develop` branches. The GitHub Actions workflow is located in `.github/workflows/deploy.yml` within this backend directory.

1. **Push to GitHub**: Commit and push your changes
2. **GitHub Action Triggers**: The workflow runs automatically
3. **Infrastructure Setup**: CloudFormation creates/updates AWS resources
4. **Application Deployment**: Your app is deployed to Elastic Beanstalk

### 5. Manual Deployment (if needed)

You can also deploy manually using AWS CLI:

```bash
# Install AWS CLI and configure credentials
aws configure

# Deploy CloudFormation stack
cd contact-us-admin-panel-nodejs
aws cloudformation create-stack \
  --stack-name contact-us-backend-stack \
  --template-body file://cloudformation/eb-app.yaml \
  --parameters ParameterKey=ApplicationName,ParameterValue=contact-us-backend \
               ParameterKey=EnvironmentName,ParameterValue=contact-us-backend-dev \
  --capabilities CAPABILITY_IAM

# Create deployment package
npm install
zip -r application.zip . -x "*.git*" "node_modules/*" ".env*"

# Deploy to Elastic Beanstalk (requires EB CLI)
eb init
eb deploy
```

## Configuration Files

- `cloudformation/eb-app.yaml`: Infrastructure as Code template
- `.github/workflows/deploy.yml`: GitHub Actions workflow (located in this directory)
- `.ebextensions/environment.config`: Elastic Beanstalk configuration (auto-generated during deployment)

## Monitoring

After deployment, you can monitor your application:

1. **AWS Console**: Check Elastic Beanstalk dashboard for health and logs
2. **Application URL**: Your app will be available at `http://contact-us-backend-dev.<your-region>.elasticbeanstalk.com`
3. **Health Check**: Visit `/api/admin/health` to verify the application is running

**Note**: Replace `<your-region>` with your actual AWS region (e.g., us-east-1, eu-west-1, etc.)

## Troubleshooting

### Common Issues:

1. **Deployment Fails**: Check GitHub Actions logs for detailed error messages
2. **Health Check Fails**: Ensure your health endpoint returns status 200
3. **Environment Variables**: Verify all required environment variables are set in AWS
4. **MongoDB Connection**: Ensure your MongoDB cluster allows connections from AWS

### Logs:

- **GitHub Actions**: Check the Actions tab in your GitHub repository
- **AWS Logs**: Go to Elastic Beanstalk > Logs to download application logs
- **CloudFormation**: Check CloudFormation events for infrastructure issues

## Cost Optimization

For development:
- Uses `t3.micro` instance (eligible for free tier)
- Single instance configuration
- Auto-scaling disabled

## Security Notes

- Ensure your MongoDB cluster has proper network access controls
- Use strong secrets for SESSION_SECRET and JWT_SECRET
- Consider using AWS Secrets Manager for production environments
- The current CORS configuration allows all origins - restrict this for production
