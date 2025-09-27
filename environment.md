# AI Cover Letter Generator - Environment Configuration

## Environment Overview

This document outlines the environment setup, configuration requirements, and deployment information for the AI Cover Letter Generator project.

## Development Environment

### Prerequisites

#### System Requirements
- **Operating System**: macOS 10.15+, Windows 10+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 14.0.0 or higher
- **Python**: Version 3.7+ (for local server)
- **Modern Web Browser**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

#### Development Tools
- **Code Editor**: VS Code, Cursor, or any modern IDE
- **Git**: Version control system
- **Local Web Server**: Python http.server, Node.js serve, or any static file server

### Local Development Setup

#### 1. Project Initialization
```bash
# Clone the repository
git clone <repository-url>
cd ai-cover-letter-generator

# Install dependencies (if using Node.js server)
npm install
```

#### 2. Local Server Options

**Option A: Python HTTP Server (Recommended)**
```bash
# Start Python server on port 8000
python -m http.server 8000

# Access application at http://localhost:8000
```

**Option B: Node.js Serve**
```bash
# Install serve globally
npm install -g serve

# Start server on port 8000
npx serve . -p 8000

# Access application at http://localhost:8000
```

**Option C: VS Code Live Server**
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

#### 3. Environment Variables

Create a `.env` file for local development:
```env
# N8N Backend Configuration
N8N_ENDPOINT=https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a

# Development Settings
DEBUG_MODE=true
LOG_LEVEL=debug

# API Configuration
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=2048
```

## Production Environment

### N8N Backend Configuration

#### Endpoint Configuration
- **Production URL**: `https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a`
- **Method**: POST
- **Content-Type**: application/json
- **Authentication**: API key managed by N8N workflow
- **Webhook ID**: `d6f37ea7-92a9-462e-845c-0c0455a18e0a`

#### N8N Workflow Requirements
```json
{
  "workflow": {
    "name": "Cover Letter Generator",
    "nodes": [
      {
        "type": "webhook",
        "name": "Cover Letter Webhook",
        "parameters": {
          "path": "d6f37ea7-92a9-462e-845c-0c0455a18e0a",
          "httpMethod": "POST"
        }
      },
      {
        "type": "googleGemini",
        "name": "Gemini AI",
        "parameters": {
          "model": "gemini-2.0-flash-exp",
          "temperature": 0.7,
          "maxTokens": 2048
        }
      }
    ]
  }
}
```

### Hosting Requirements

#### Static File Hosting
- **CDN**: Cloudflare, AWS CloudFront, or similar
- **Storage**: AWS S3, Netlify, Vercel, or GitHub Pages
- **SSL**: Required for HTTPS (Let's Encrypt or commercial certificate)

#### Server Configuration
```nginx
# Nginx configuration example
server {
    listen 80;
    listen 443 ssl;
    server_name your-domain.com;
    
    root /var/www/ai-cover-letter-generator;
    index index.html;
    
    # CORS headers for API calls
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## API Integration Environment

### Google Gemini API Configuration

#### API Key Management
- **Storage**: Secure environment variables in N8N
- **Access**: Restricted to specific IP addresses
- **Rotation**: Regular key rotation for security

#### Rate Limiting
- **Requests per minute**: 60 (Gemini 2.0 Flash)
- **Daily quota**: 1,500 requests
- **Implementation**: Request queuing and retry logic

#### Model Configuration
```javascript
const geminiConfig = {
  model: "gemini-2.0-flash-exp",
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.8,
  topK: 40
};
```

### CORS Configuration

#### Frontend CORS Settings
```javascript
// CORS configuration for API calls
const corsConfig = {
  origin: ['https://your-domain.com', 'http://localhost:8000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization'],
  credentials: false
};
```

#### N8N CORS Headers
```javascript
// N8N workflow CORS response
response.setHeader('Access-Control-Allow-Origin', '*');
response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

## Security Environment

### Data Protection
- **No Data Storage**: User data is not stored on servers
- **Temporary Processing**: Data exists only during request processing
- **API Key Security**: Keys stored securely in N8N environment
- **HTTPS Only**: All communications encrypted in transit

### File Upload Security
```javascript
// File validation configuration
const fileValidation = {
  allowedTypes: ['application/pdf'],
  maxSize: 10 * 1024 * 1024, // 10MB
  scanForMalware: true,
  quarantineSuspicious: true
};
```

### Network Security
- **Firewall**: Restrict access to necessary ports only
- **DDoS Protection**: Cloudflare or similar service
- **Rate Limiting**: Implement per-IP rate limits
- **Monitoring**: Real-time security monitoring

## Monitoring and Logging

### Application Monitoring
```javascript
// Monitoring configuration
const monitoring = {
  uptime: '99.9%',
  responseTime: '< 3 seconds',
  errorRate: '< 1%',
  availability: '24/7'
};
```

### Logging Configuration
```javascript
// Logging levels and destinations
const logging = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  destinations: ['console', 'file', 'remote'],
  format: 'json',
  retention: '30 days'
};
```

### Performance Metrics
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **API Response Time**: < 3 seconds for cover letter generation
- **Error Rate**: < 1% for all user interactions
- **Uptime**: 99.9% availability target

## Deployment Environments

### Development Environment
- **URL**: `http://localhost:8000`
- **Features**: Debug mode, verbose logging, hot reload
- **Data**: Mock data and simulated responses
- **Security**: Relaxed for development ease

### Staging Environment
- **URL**: `https://staging.your-domain.com`
- **Features**: Production-like configuration, limited users
- **Data**: Test data and real API integration
- **Security**: Production-level security

### Production Environment
- **URL**: `https://your-domain.com`
- **Features**: Full functionality, optimized performance
- **Data**: Real user data and API integration
- **Security**: Maximum security and monitoring

## Environment Variables Reference

### Frontend Environment Variables
```env
# API Configuration
VITE_N8N_ENDPOINT=https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_DEBUG_MODE=false
VITE_ANALYTICS_ENABLED=true
VITE_ERROR_REPORTING=true

# Performance
VITE_CACHE_TTL=3600
VITE_RETRY_ATTEMPTS=3
```

### Backend Environment Variables (N8N)
```env
# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=2048

# N8N Configuration
N8N_WEBHOOK_URL=https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a
N8N_RATE_LIMIT=60
N8N_TIMEOUT=30000

# Security
CORS_ORIGIN=https://your-domain.com
API_KEY_ROTATION_DAYS=90
```

## Troubleshooting Environment Issues

### Common Development Issues

#### CORS Errors
```bash
# Solution: Use local server instead of file:// protocol
python -m http.server 8000
# Access via http://localhost:8000
```

#### API Connection Issues
```bash
# Check N8N endpoint accessibility
curl -X POST https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'
```

#### File Upload Issues
```bash
# Check file permissions and size limits
ls -la uploaded-files/
du -sh uploaded-files/*
```

### Production Issues

#### Performance Monitoring
```bash
# Check server response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com

# Monitor API endpoint
curl -w "@curl-format.txt" -o /dev/null -s \
  -X POST https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a
```

#### Error Logging
```bash
# Check application logs
tail -f /var/log/nginx/error.log
tail -f /var/log/application.log

# Monitor N8N workflow logs
# Access N8N dashboard for workflow execution logs
```

## Environment Maintenance

### Regular Updates
- **Dependencies**: Monthly security updates
- **API Keys**: Quarterly rotation
- **SSL Certificates**: Annual renewal
- **Monitoring**: Continuous monitoring and alerting

### Backup and Recovery
- **Code**: Git repository with regular backups
- **Configuration**: Environment variables backup
- **Monitoring**: Log retention and analysis
- **Disaster Recovery**: Multi-region deployment plan

## Conclusion

This environment configuration ensures the AI Cover Letter Generator operates reliably across all deployment stages. The configuration supports development, testing, and production environments while maintaining security, performance, and scalability requirements.

Regular monitoring and maintenance of these environments will ensure optimal performance and user experience.
