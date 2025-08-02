#!/bin/bash

# Simple EC2 Deployment Script
set -e

# Configuration
INSTANCE_TYPE="t3.micro"
KEY_NAME="contact-us-admin-key"
SECURITY_GROUP="contact-us-admin-sg"
REGION="ap-south-1"
AMI_ID="ami-0f5ee92e2d63afc18"  # Amazon Linux 2023 AMI for ap-south-1

echo "🚀 Deploying to EC2..."

# Create key pair if it doesn't exist
echo "🔑 Creating key pair..."
aws ec2 create-key-pair \
    --key-name $KEY_NAME \
    --region $REGION \
    --query 'KeyMaterial' \
    --output text > ${KEY_NAME}.pem 2>/dev/null || echo "Key pair may already exist"

chmod 400 ${KEY_NAME}.pem 2>/dev/null || true

# Create security group
echo "🔒 Creating security group..."
SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --group-name $SECURITY_GROUP \
    --description "Security group for Contact Us Admin Panel" \
    --region $REGION \
    --query 'GroupId' \
    --output text 2>/dev/null || aws ec2 describe-security-groups \
    --group-names $SECURITY_GROUP \
    --region $REGION \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

echo "Security Group ID: $SECURITY_GROUP_ID"

# Add security group rules
echo "🌐 Adding security group rules..."
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null || echo "SSH rule may already exist"

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null || echo "HTTP rule may already exist"

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null || echo "App rule may already exist"

# Launch EC2 instance
echo "🖥️ Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --count 1 \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SECURITY_GROUP_ID \
    --region $REGION \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=contact-us-admin}]' \
    --user-data file://user-data.sh \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "Instance ID: $INSTANCE_ID"

# Wait for instance to be running
echo "⏳ Waiting for instance to be running..."
aws ec2 wait instance-running \
    --instance-ids $INSTANCE_ID \
    --region $REGION

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --region $REGION \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo ""
echo "✅ EC2 instance deployed successfully!"
echo ""
echo "📊 Instance Details:"
echo "  Instance ID: $INSTANCE_ID"
echo "  Public IP: $PUBLIC_IP"
echo "  Region: $REGION"
echo ""
echo "🌐 Application URLs (wait ~3-5 minutes for setup):"
echo "  Application: http://$PUBLIC_IP:8000"
echo "  Health Check: http://$PUBLIC_IP:8000/api/health"
echo ""
echo "🔧 SSH Access:"
echo "  ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP"
echo ""
echo "📝 Next Steps:"
echo "1. Wait 3-5 minutes for the application to start"
echo "2. Visit: http://$PUBLIC_IP:8000"
echo "3. Login with: master@vvworx.com / 123456"
echo ""
echo "🔍 Monitor logs:"
echo "  ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP"
echo "  sudo tail -f /var/log/user-data.log"