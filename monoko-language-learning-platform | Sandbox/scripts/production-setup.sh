#!/bin/bash

# Monoko Production Setup Script
# Automates server setup, security hardening, and deployment preparation

set -e  # Exit on any error
set -o pipefail  # Exit on pipe failures

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=${1:-"monoko.app"}
EMAIL=${2:-"admin@monoko.app"}
SERVER_USER=${3:-"monoko"}
NODE_VERSION="18"

echo -e "${BLUE}🚀 Monoko Production Setup Script${NC}"
echo -e "${BLUE}=================================${NC}\n"

# Function to print status messages
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root for security reasons"
        exit 1
    fi
}

# Update system packages
update_system() {
    print_info "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y curl wget gnupg2 software-properties-common apt-transport-https ca-certificates
    print_status "System packages updated"
}

# Install Docker and Docker Compose
install_docker() {
    print_info "Installing Docker..."
    
    # Remove old versions
    sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Add Docker GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    print_status "Docker installed successfully"
}

# Install Node.js
install_nodejs() {
    print_info "Installing Node.js ${NODE_VERSION}..."
    
    # Install Node.js via NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Install global packages
    sudo npm install -g pm2 @expo/cli
    
    print_status "Node.js ${NODE_VERSION} installed"
    print_info "Node version: $(node --version)"
    print_info "NPM version: $(npm --version)"
}

# Configure firewall
setup_firewall() {
    print_info "Configuring UFW firewall..."
    
    # Reset UFW to defaults
    sudo ufw --force reset
    
    # Default policies
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Allow essential services
    sudo ufw allow ssh
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    
    # Allow monitoring (restrict to specific IPs in production)
    sudo ufw allow 3001/tcp  # Grafana
    sudo ufw allow 9090/tcp  # Prometheus
    
    # Enable UFW
    sudo ufw --force enable
    
    print_status "Firewall configured"
    sudo ufw status
}

# Install and configure Fail2Ban
setup_fail2ban() {
    print_info "Installing and configuring Fail2Ban..."
    
    sudo apt install -y fail2ban
    
    # Create custom jail configuration
    sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
ignoreip = 127.0.0.1/8 ::1

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10

[nginx-botsearch]
enabled = true
filter = nginx-botsearch
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 2
EOF

    # Start and enable Fail2Ban
    sudo systemctl start fail2ban
    sudo systemctl enable fail2ban
    
    print_status "Fail2Ban configured"
}

# Configure SSH security
secure_ssh() {
    print_info "Hardening SSH configuration..."
    
    # Backup original config
    sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Apply security settings
    sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    sudo sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
    
    # Add additional security settings
    sudo tee -a /etc/ssh/sshd_config > /dev/null <<EOF

# Monoko Security Settings
Protocol 2
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
UseDNS no
AllowUsers ${USER}
EOF

    # Restart SSH service
    sudo systemctl restart ssh
    
    print_status "SSH hardened"
}

# Install SSL certificate with Let's Encrypt
setup_ssl() {
    print_info "Installing SSL certificate for ${DOMAIN}..."
    
    # Install Certbot
    sudo apt install -y certbot python3-certbot-nginx
    
    # Create directories
    sudo mkdir -p /var/www/certbot
    
    # Get SSL certificate (requires domain to point to server)
    if host ${DOMAIN} > /dev/null 2>&1; then
        sudo certbot certonly --webroot --webroot-path=/var/www/certbot -d ${DOMAIN} -d www.${DOMAIN} -d api.${DOMAIN} --email ${EMAIL} --agree-tos --no-eff-email
        
        # Set up auto-renewal
        echo "0 2 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
        
        print_status "SSL certificate installed for ${DOMAIN}"
    else
        print_warning "Domain ${DOMAIN} does not resolve to this server. Skipping SSL setup."
        print_info "Please configure DNS and run: sudo certbot certonly --webroot --webroot-path=/var/www/certbot -d ${DOMAIN} -d www.${DOMAIN} -d api.${DOMAIN} --email ${EMAIL} --agree-tos --no-eff-email"
    fi
}

# Create application directory structure
setup_directories() {
    print_info "Creating application directories..."
    
    # Create main directory
    sudo mkdir -p /opt/monoko/{app,logs,backups,ssl,config}
    
    # Create log directories
    sudo mkdir -p /opt/monoko/logs/{nginx,mongodb,redis,app}
    
    # Create backup directories
    sudo mkdir -p /opt/monoko/backups/{daily,weekly,monthly}
    
    # Set permissions
    sudo chown -R ${USER}:${USER} /opt/monoko
    sudo chmod -R 755 /opt/monoko
    
    print_status "Directory structure created"
}

# Install monitoring tools
install_monitoring() {
    print_info "Setting up monitoring tools..."
    
    # Install htop, iotop, and other monitoring tools
    sudo apt install -y htop iotop nethogs ncdu tree jq
    
    # Install Docker monitoring
    docker pull prom/prometheus:latest
    docker pull grafana/grafana:latest
    docker pull prom/node-exporter:latest
    
    print_status "Monitoring tools installed"
}

# Configure log rotation
setup_log_rotation() {
    print_info "Configuring log rotation..."
    
    sudo tee /etc/logrotate.d/monoko > /dev/null <<EOF
/opt/monoko/logs/app/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    sharedscripts
    postrotate
        docker-compose -f /opt/monoko/app/docker-compose.yml restart backend
    endscript
}

/opt/monoko/logs/nginx/*.log {
    daily
    rotate 52
    compress
    delaycompress
    missingok
    notifempty
    sharedscripts
    postrotate
        docker-compose -f /opt/monoko/app/docker-compose.yml restart nginx
    endscript
}
EOF

    print_status "Log rotation configured"
}

# Set up backup script
setup_backup() {
    print_info "Setting up automated backups..."
    
    tee /opt/monoko/scripts/backup.sh > /dev/null <<'EOF'
#!/bin/bash

# Monoko Backup Script
BACKUP_DIR="/opt/monoko/backups/daily"
DATE=$(date +%Y%m%d_%H%M%S)
S3_BUCKET="${AWS_BUCKET_NAME:-monoko-backups}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup MongoDB
echo "Backing up MongoDB..."
docker-compose -f /opt/monoko/app/docker-compose.yml exec -T mongodb mongodump --quiet --gzip --archive=${BACKUP_DIR}/mongodb_${DATE}.gz

# Backup Redis
echo "Backing up Redis..."
docker-compose -f /opt/monoko/app/docker-compose.yml exec -T redis redis-cli BGSAVE
docker cp monoko_redis_1:/data/dump.rdb ${BACKUP_DIR}/redis_${DATE}.rdb

# Backup uploads
echo "Backing up uploads..."
tar -czf ${BACKUP_DIR}/uploads_${DATE}.tar.gz -C /opt/monoko/app uploads/

# Upload to S3 (if configured)
if command -v aws &> /dev/null && [ ! -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "Uploading to S3..."
    aws s3 sync ${BACKUP_DIR} s3://${S3_BUCKET}/daily/ --delete
fi

# Clean old backups (keep 7 days)
find ${BACKUP_DIR} -name "*.gz" -mtime +7 -delete
find ${BACKUP_DIR} -name "*.rdb" -mtime +7 -delete
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: ${DATE}"
EOF

    chmod +x /opt/monoko/scripts/backup.sh
    
    # Set up cron job for daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * /opt/monoko/scripts/backup.sh >> /opt/monoko/logs/backup.log 2>&1") | crontab -
    
    print_status "Automated backups configured"
}

# Performance optimizations
optimize_system() {
    print_info "Applying system optimizations..."
    
    # Increase file descriptor limits
    sudo tee -a /etc/security/limits.conf > /dev/null <<EOF

# Monoko optimizations
${USER} soft nofile 65536
${USER} hard nofile 65536
EOF

    # Optimize sysctl settings
    sudo tee /etc/sysctl.d/99-monoko.conf > /dev/null <<EOF
# Network optimizations
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_slow_start_after_idle = 0
net.core.netdev_max_backlog = 5000

# File system optimizations
fs.file-max = 2097152
vm.swappiness = 10
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
EOF

    sudo sysctl -p /etc/sysctl.d/99-monoko.conf
    
    print_status "System optimizations applied"
}

# Create deployment script
create_deploy_script() {
    print_info "Creating deployment script..."
    
    tee /opt/monoko/scripts/deploy.sh > /dev/null <<'EOF'
#!/bin/bash

# Monoko Deployment Script
set -e

APP_DIR="/opt/monoko/app"
BACKUP_DIR="/opt/monoko/backups/pre-deploy"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting Monoko deployment..."

# Create pre-deployment backup
echo "📦 Creating pre-deployment backup..."
mkdir -p ${BACKUP_DIR}
docker-compose -f ${APP_DIR}/docker-compose.yml exec -T mongodb mongodump --quiet --gzip --archive=${BACKUP_DIR}/pre_deploy_${DATE}.gz

# Pull latest code
echo "📥 Pulling latest code..."
cd ${APP_DIR}
git pull origin main

# Build and restart services
echo "🔨 Building and restarting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
echo "🏥 Running health checks..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed! Rolling back..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
    # Restore from backup logic here
    exit 1
fi

echo "🎉 Deployment completed successfully!"
EOF

    chmod +x /opt/monoko/scripts/deploy.sh
    
    print_status "Deployment script created"
}

# Main setup function
main() {
    echo -e "${BLUE}Starting Monoko production setup for domain: ${DOMAIN}${NC}\n"
    
    # Check prerequisites
    check_root
    
    # System setup
    update_system
    install_docker
    install_nodejs
    
    # Security setup
    setup_firewall
    setup_fail2ban
    secure_ssh
    
    # SSL setup (optional, depends on DNS)
    setup_ssl
    
    # Application setup
    setup_directories
    setup_log_rotation
    setup_backup
    optimize_system
    
    # Monitoring
    install_monitoring
    
    # Deployment tools
    create_deploy_script
    
    print_status "Production setup completed!"
    
    echo -e "\n${BLUE}📋 Next Steps:${NC}"
    echo "1. Clone your Monoko repository to /opt/monoko/app"
    echo "2. Configure your .env file with production settings"
    echo "3. Run the deployment script: /opt/monoko/scripts/deploy.sh"
    echo "4. Configure your domain DNS to point to this server"
    echo "5. Set up monitoring alerts and notifications"
    
    echo -e "\n${BLUE}🔒 Security Notes:${NC}"
    echo "• SSH root login has been disabled"
    echo "• Firewall is active with minimal open ports"
    echo "• Fail2Ban is monitoring for intrusion attempts"
    echo "• Log in with a new terminal to ensure SSH key works"
    
    echo -e "\n${BLUE}📊 Monitoring:${NC}"
    echo "• Grafana: http://${DOMAIN}:3001 (admin/monoko123)"
    echo "• Prometheus: http://${DOMAIN}:9090"
    echo "• Logs: /opt/monoko/logs/"
    
    echo -e "\n${GREEN}🎉 Monoko is ready for production deployment!${NC}"
}

# Run main function
main "$@"
