#!/bin/bash

# Simple EC2 Setup for Node.js Backend
set -e

echo "🚀 Setting up EC2 for Node.js backend..."

# Update system
echo "📦 Updating system..."
sudo apt update -y

# Install essential packages
echo "📦 Installing essential packages..."
sudo apt install -y curl wget git unzip build-essential

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Setup firewall
echo "🔥 Setting up firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 8000
sudo ufw --force enable

# Start services
echo "🔄 Starting services..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Create app directory
echo "📁 Creating app directory..."
mkdir -p ~/app

echo ""
echo "✅ Setup completed!"
echo ""
echo "Installed:"
echo "  Node.js: $(node --version)"
echo "  NPM: $(npm --version)"
echo "  PM2: $(pm2 --version)"
echo "  Git: $(git --version)"
echo ""
echo "Next steps:"
echo "1. Clone your repo: git clone <your-repo> ~/app"
echo "2. Install deps: cd ~/app && npm install"
echo "3. Start app: pm2 start server.js --name myapp"

#   sudo nginx -t
#   sudo systemctl reload nginx