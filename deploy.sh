#!/bin/bash

# Development deployment helper script

set -e

echo "🚀 Contact Us Backend Deployment Helper"
echo "========================================"

# Function to check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo "❌ AWS CLI is not installed. Please install it first:"
        echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
    echo "✅ AWS CLI found"
}

# Function to check if AWS credentials are configured
check_aws_credentials() {
    if ! aws sts get-caller-identity &> /dev/null; then
        echo "❌ AWS credentials not configured. Run 'aws configure' first"
        exit 1
    fi
    echo "✅ AWS credentials configured"
}

# Function to validate environment file
check_env_file() {
    if [ ! -f ".env" ]; then
        echo "⚠️  .env file not found. Creating from template..."
        cp .env.example .env
        echo "📝 Please edit .env file with your actual values before deploying"
        return 1
    fi
    echo "✅ Environment file found"
}

# Function to install dependencies
install_deps() {
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
}

# Function to create deployment package
create_package() {
    echo "📦 Creating deployment package..."
    
    # Clean up previous package
    rm -rf deploy-package application.zip
    
    # Create deployment directory
    mkdir -p deploy-package/.ebextensions
    
    # Copy application files
    cp -r models routes middlewares services public deploy-package/
    cp server.js package.json package-lock.json deploy-package/
    
    # Create Elastic Beanstalk configuration
    cat > deploy-package/.ebextensions/environment.config << 'EOF'
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:container:nodejs:staticfiles:
    /public: public
EOF
    
    # Create zip package
    cd deploy-package
    zip -r ../application.zip . -x "*.git*" "node_modules/*" ".env*"
    cd ..
    
    echo "✅ Deployment package created: application.zip"
}

# Function to deploy CloudFormation stack
deploy_infrastructure() {
    echo "🏗️  Deploying infrastructure..."
    
    STACK_NAME="contact-us-backend-stack"
    
    if aws cloudformation describe-stacks --stack-name $STACK_NAME 2>/dev/null; then
        echo "📝 Updating existing CloudFormation stack..."
        aws cloudformation update-stack \
            --stack-name $STACK_NAME \
            --template-body file://cloudformation/eb-app.yaml \
            --parameters ParameterKey=ApplicationName,ParameterValue=contact-us-backend \
                        ParameterKey=EnvironmentName,ParameterValue=contact-us-backend-dev \
            --capabilities CAPABILITY_IAM
        
        aws cloudformation wait stack-update-complete --stack-name $STACK_NAME
    else
        echo "🆕 Creating new CloudFormation stack..."
        aws cloudformation create-stack \
            --stack-name $STACK_NAME \
            --template-body file://cloudformation/eb-app.yaml \
            --parameters ParameterKey=ApplicationName,ParameterValue=contact-us-backend \
                        ParameterKey=EnvironmentName,ParameterValue=contact-us-backend-dev \
            --capabilities CAPABILITY_IAM
        
        aws cloudformation wait stack-create-complete --stack-name $STACK_NAME
    fi
    
    echo "✅ Infrastructure deployed"
}

# Function to get application URL
get_app_url() {
    APP_URL=$(aws elasticbeanstalk describe-environments \
        --environment-names contact-us-backend-dev \
        --query 'Environments[0].CNAME' \
        --output text)
    
    if [ "$APP_URL" != "None" ] && [ "$APP_URL" != "" ]; then
        echo "🌐 Application URL: http://$APP_URL"
        echo "🔍 Health check: http://$APP_URL/api/admin/health"
    else
        echo "⚠️  Could not retrieve application URL"
    fi
}

# Main execution
main() {
    case "${1:-deploy}" in
        "check")
            echo "🔍 Checking prerequisites..."
            check_aws_cli
            check_aws_credentials
            check_env_file || exit 1
            echo "✅ All checks passed"
            ;;
        "build")
            echo "🔨 Building application..."
            install_deps
            create_package
            echo "✅ Build complete"
            ;;
        "infrastructure")
            echo "🏗️  Deploying infrastructure only..."
            check_aws_cli
            check_aws_credentials
            deploy_infrastructure
            get_app_url
            ;;
        "deploy")
            echo "🚀 Full deployment..."
            check_aws_cli
            check_aws_credentials
            check_env_file || exit 1
            install_deps
            create_package
            deploy_infrastructure
            
            echo "⏳ Waiting for environment to be ready for deployment..."
            sleep 30
            
            echo "📤 Deploying application package..."
            echo "   Note: Use EB CLI for application deployment or GitHub Actions"
            echo "   This script creates the package but doesn't deploy it to avoid complexity"
            echo "   Package ready: application.zip"
            
            get_app_url
            ;;
        "url")
            get_app_url
            ;;
        "help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  check         - Check prerequisites"
            echo "  build         - Build application package"
            echo "  infrastructure - Deploy infrastructure only"
            echo "  deploy        - Full deployment (default)"
            echo "  url           - Get application URL"
            echo "  help          - Show this help"
            ;;
        *)
            echo "❌ Unknown command: $1"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

main "$@"
