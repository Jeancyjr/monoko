# Monoko Deployment Guide

Complete guide for deploying the Monoko African language learning platform to production.

## 🏗️ Architecture Overview

```
Internet → Load Balancer → Nginx → Node.js API → MongoDB
                                ↓
                           Redis Cache
                                ↓
                         AI Services (OpenAI, Azure)
```

## 📋 Prerequisites

### System Requirements
- **Server**: Ubuntu 20.04+ or Amazon Linux 2
- **RAM**: Minimum 4GB, Recommended 8GB+
- **CPU**: 2+ cores, Recommended 4+ cores
- **Storage**: 50GB+ SSD
- **Network**: High bandwidth for AI image processing

### Software Requirements
- Docker Engine 24.0+
- Docker Compose 2.20+
- SSL Certificate (Let's Encrypt recommended)
- Domain name pointing to your server

### External Services
- MongoDB Atlas (or self-hosted MongoDB cluster)
- Redis Cloud (or self-hosted Redis)
- OpenAI API key (for Snap & Learn)
- Azure Speech Services (for pronunciation)
- AWS S3 (for file storage)
- SendGrid (for emails)

## 🚀 Quick Deployment

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/monoko.git
cd monoko
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your production values
nano .env
```

### 3. SSL Setup (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.monoko.app -d monoko.app

# Test auto-renewal
sudo certbot renew --dry-run
```

### 4. Deploy with Docker Compose
```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

## 🔧 Production Configuration

### Environment Variables
```bash
# .env file for production
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/monoko
REDIS_URL=redis://username:password@redis-host:6379

# Security
JWT_SECRET=your-256-bit-secret-key-use-openssl-rand-hex-32
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

# AI Services
OPENAI_API_KEY=your-openai-api-key
AZURE_SPEECH_KEY=your-azure-speech-key
AZURE_SPEECH_REGION=eastus

# Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=monoko-prod-content
AWS_REGION=us-east-1

# Email
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@monoko.app

# Monitoring
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-key
```

### Nginx Configuration
Located in `nginx/conf.d/monoko.conf`:
- SSL termination
- Rate limiting (10 req/sec general, 1 req/sec AI endpoints)
- Gzip compression
- Static file serving
- Health check endpoints
- Security headers

### MongoDB Configuration
```javascript
// Recommended MongoDB settings
{
  "replication": {
    "replSetName": "monoko-rs"
  },
  "security": {
    "authorization": "enabled",
    "keyFile": "/etc/mongodb-keyfile"
  },
  "storage": {
    "wiredTiger": {
      "engineConfig": {
        "cacheSizeGB": 2
      }
    }
  }
}
```

## 🔒 Security Hardening

### 1. Server Security
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 2. Application Security
- JWT tokens with secure random secrets
- Password hashing with bcrypt (12 rounds)
- Rate limiting on all endpoints
- Input validation with Joi schemas
- CORS configuration for production domains
- Security headers (HSTS, CSP, X-Frame-Options)

### 3. Database Security
```bash
# MongoDB security
- Enable authentication
- Use TLS/SSL for connections
- Regular security updates
- Network restrictions (VPC/firewall)
- Regular backups with encryption
```

## 📊 Monitoring & Observability

### Application Monitoring
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=secure-password
    volumes:
      - grafana-storage:/var/lib/grafana
```

### Health Checks
- **API Health**: `GET /health`
- **Database Health**: Connection status
- **Redis Health**: Cache connectivity
- **AI Services Health**: API response times

### Log Management
```bash
# Configure log rotation
sudo tee /etc/logrotate.d/monoko << EOF
/var/log/monoko/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    sharedscripts
    postrotate
        docker-compose restart backend
    endscript
}
EOF
```

### Performance Monitoring
- Response time tracking
- Database query performance
- AI API latency monitoring
- Memory and CPU usage
- User session analytics

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
Located in `.github/workflows/ci-cd.yml`:

1. **Code Quality**: ESLint, Prettier, Security audit
2. **Testing**: Unit tests, Integration tests, Coverage
3. **Security**: Vulnerability scanning with Trivy
4. **Build**: Docker image creation and registry push
5. **Deploy**: Automated deployment to staging/production
6. **Monitoring**: Health checks and smoke tests

### Deployment Environments

#### Staging
- **URL**: https://staging-api.monoko.app
- **Purpose**: Integration testing, QA validation
- **Auto-deploy**: On push to `develop` branch
- **Data**: Sanitized production copy

#### Production
- **URL**: https://api.monoko.app
- **Purpose**: Live user traffic
- **Deploy**: Manual trigger on release
- **Data**: Live user data with backups

## 🗄️ Database Management

### Backup Strategy
```bash
# Daily automated backups
0 2 * * * mongodump --uri="$MONGODB_URI" --gzip --archive=/backups/monoko-$(date +%Y%m%d).gz

# Weekly backup to S3
0 3 * * 0 aws s3 cp /backups/ s3://monoko-backups/ --recursive
```

### Migration Scripts
```bash
# Run database migrations
npm run migrate

# Seed initial data
npm run seed

# Create indexes
node scripts/create-indexes.js
```

### Data Retention
- User data: Retained per GDPR requirements
- Logs: 90 days
- Backups: 1 year
- Analytics: 2 years (anonymized)

## 🚦 Load Balancing & Scaling

### Horizontal Scaling
```yaml
# Scale backend service
docker-compose up --scale backend=3

# Load balancer configuration
upstream backend_api {
    least_conn;
    server backend_1:3000;
    server backend_2:3000;
    server backend_3:3000;
}
```

### Auto-scaling (AWS/GCP)
```yaml
# Auto Scaling Group configuration
MinSize: 2
MaxSize: 10
DesiredCapacity: 3
TargetCPUUtilization: 70%
```

### CDN Configuration
```bash
# CloudFront distribution
- Origin: api.monoko.app
- Cache: Static content (audio, images)
- TTL: 1 day for content, 1 hour for API
```

## 🔧 Maintenance

### Regular Tasks
```bash
# Weekly maintenance script
#!/bin/bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean Docker resources
docker system prune -f

# Restart services if needed
docker-compose restart

# Run health checks
curl -f https://api.monoko.app/health
```

### Performance Optimization
- Database index optimization
- Redis cache tuning
- CDN cache configuration
- Image optimization
- API response compression

### Updates & Patches
- Security patches: Immediate (within 24h)
- Feature updates: Weekly releases
- Dependencies: Monthly updates
- OS patches: Monthly scheduled maintenance

## 🚨 Incident Response

### Monitoring Alerts
- API response time > 2 seconds
- Error rate > 5%
- Database connection failures
- High memory/CPU usage (>85%)
- SSL certificate expiration (30 days)

### Recovery Procedures
1. **Database Failure**: Automatic failover to replica
2. **API Downtime**: Scale up instances, check dependencies
3. **AI Service Outage**: Graceful degradation, queue requests
4. **DDoS Attack**: Rate limiting, CDN protection

### Contact Information
- **On-call Engineer**: +1-xxx-xxx-xxxx
- **Slack Channel**: #monoko-alerts
- **Email**: ops@monoko.app

## 📈 Performance Benchmarks

### Target Metrics
- **API Response Time**: <500ms (95th percentile)
- **Uptime**: 99.9% SLA
- **Throughput**: 1000 req/sec
- **Database Queries**: <100ms average
- **AI Processing**: <5s per image

### Load Testing
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run load-test.yml

# Results analysis
artillery report test-results.json
```

## 🏆 Best Practices

### Development
- Use feature branches and pull requests
- Comprehensive testing (unit, integration, e2e)
- Code reviews for all changes
- Security scanning in CI/CD
- Documentation updates with code changes

### Operations
- Infrastructure as Code (Terraform/CloudFormation)
- Immutable deployments
- Blue-green deployment strategy
- Automated rollback procedures
- Regular disaster recovery drills

### Security
- Regular security audits
- Dependency vulnerability scanning
- Access control and authentication
- Data encryption at rest and in transit
- GDPR compliance procedures

---

## 🆘 Troubleshooting

### Common Issues

#### High Memory Usage
```bash
# Check memory usage
docker stats

# Analyze Node.js memory
node --inspect server.js
```

#### Slow Database Queries
```javascript
// Enable MongoDB profiler
db.setProfilingLevel(2, { slowms: 100 })

// Analyze slow queries
db.system.profile.find().sort({ts: -1}).limit(5)
```

#### AI API Timeouts
- Check API rate limits
- Implement request queuing
- Add retry logic with exponential backoff
- Monitor external service status

### Support Contacts
- **Technical Issues**: tech-support@monoko.app
- **Security Issues**: security@monoko.app  
- **Business Issues**: business@monoko.app

---

**🌍 Happy Deploying! Monoko is ready to teach African languages to the world!**
