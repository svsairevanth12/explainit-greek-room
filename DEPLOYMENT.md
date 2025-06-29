# Deployment Guide - Explain It Platform

This guide covers deploying the Explain It platform to various hosting providers and production environments.

## 🚀 **Quick Deployment Options**

### **Option 1: Vercel (Recommended)**

Vercel is the easiest way to deploy Next.js applications with zero configuration.

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables**
   Add these in Vercel dashboard:
   ```env
   DATABASE_URL=your-production-database-url
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   OPENAI_API_KEY=your-openai-key
   OMNIDIM_API_KEY=your-omnidim-key
   ```

3. **Database Setup**
   - Use Vercel Postgres or external database
   - Run migrations: `npx prisma db push`

### **Option 2: Netlify**

1. **Build Settings**
   ```bash
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   Set in Netlify dashboard under Site settings > Environment variables

### **Option 3: Railway**

1. **Connect Repository**
   - Link your GitHub repository
   - Railway auto-detects Next.js

2. **Database**
   - Add PostgreSQL service
   - Update DATABASE_URL

### **Option 4: Docker Deployment**

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t explain-it .
   docker run -p 3000:3000 explain-it
   ```

## 🗄️ **Database Deployment**

### **Production Database Options**

1. **Vercel Postgres** (Recommended for Vercel)
2. **PlanetScale** (MySQL-compatible)
3. **Supabase** (PostgreSQL with additional features)
4. **Railway PostgreSQL**
5. **AWS RDS**

### **Database Migration**

1. **Update DATABASE_URL**
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

2. **Run Migrations**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. **Generate Client**
   ```bash
   npx prisma generate
   ```

## 🔐 **Environment Configuration**

### **Production Environment Variables**

```env
# Database
DATABASE_URL="your-production-database-url"

# Authentication
NEXTAUTH_SECRET="your-super-secure-secret-key"
NEXTAUTH_URL="https://your-production-domain.com"

# App Configuration
APP_NAME="Explain It"
APP_URL="https://your-production-domain.com"

# API Keys
OPENAI_API_KEY="your-openai-production-key"
OMNIDIM_API_KEY="your-omnidim-production-key"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

### **Security Considerations**

1. **API Keys**
   - Use separate production API keys
   - Set up rate limiting
   - Monitor usage and costs

2. **Authentication**
   - Use strong NEXTAUTH_SECRET (32+ characters)
   - Enable HTTPS in production
   - Set secure cookie settings

3. **Database**
   - Use connection pooling
   - Enable SSL connections
   - Regular backups

## 📊 **Performance Optimization**

### **Build Optimization**

1. **Next.js Configuration**
   ```javascript
   // next.config.js
   module.exports = {
     experimental: {
       optimizeCss: true,
     },
     images: {
       domains: ['your-image-domains.com'],
     },
     compress: true,
   }
   ```

2. **Bundle Analysis**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   npm run build
   npm run analyze
   ```

### **Caching Strategy**

1. **API Routes**
   - Implement Redis caching for expensive operations
   - Cache OpenAI responses for common questions

2. **Static Assets**
   - Use CDN for images and static files
   - Enable browser caching headers

### **Database Optimization**

1. **Indexing**
   ```sql
   CREATE INDEX idx_user_email ON User(email);
   CREATE INDEX idx_exam_session_user ON ExamSession(userId);
   ```

2. **Connection Pooling**
   ```env
   DATABASE_URL="postgresql://user:pass@host/db?connection_limit=10"
   ```

## 🔍 **Monitoring & Analytics**

### **Application Monitoring**

1. **Vercel Analytics** (if using Vercel)
   ```bash
   npm install @vercel/analytics
   ```

2. **Google Analytics**
   ```javascript
   // Add to _app.tsx
   import { Analytics } from '@vercel/analytics/react';
   ```

### **Error Tracking**

1. **Sentry Integration**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Custom Error Boundary**
   ```javascript
   // components/ErrorBoundary.tsx
   export class ErrorBoundary extends Component {
     // Error handling logic
   }
   ```

### **Performance Monitoring**

1. **Core Web Vitals**
   - Monitor LCP, FID, CLS
   - Use Lighthouse CI

2. **API Performance**
   - Track response times
   - Monitor OpenAI API usage

## 🧪 **Testing in Production**

### **Health Checks**

1. **API Health Endpoint**
   ```javascript
   // pages/api/health.js
   export default function handler(req, res) {
     res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
   }
   ```

2. **Database Connectivity**
   ```javascript
   // Test database connection
   await prisma.$queryRaw`SELECT 1`;
   ```

### **Smoke Tests**

Run the integration tests against production:
```bash
BASE_URL=https://your-domain.com node tests/integration.test.js
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Example**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

2. **Database Connection**
   ```bash
   # Test connection
   npx prisma db pull
   ```

3. **API Rate Limits**
   - Implement exponential backoff
   - Add request queuing

### **Rollback Strategy**

1. **Vercel Rollback**
   ```bash
   vercel --prod --rollback
   ```

2. **Database Rollback**
   - Keep database migrations reversible
   - Maintain backup before deployments

## 📋 **Post-Deployment Checklist**

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] SSL certificate active
- [ ] Domain configured correctly
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] OpenAI integration functional
- [ ] Omnidim integration functional
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Performance monitoring active
- [ ] Backup strategy in place

## 🆘 **Support & Maintenance**

### **Regular Maintenance**

1. **Weekly**
   - Check error logs
   - Monitor API usage
   - Review performance metrics

2. **Monthly**
   - Update dependencies
   - Review security alerts
   - Backup verification

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Feature usage analysis

### **Emergency Procedures**

1. **Service Down**
   - Check hosting provider status
   - Verify DNS settings
   - Review recent deployments

2. **Database Issues**
   - Check connection limits
   - Verify credentials
   - Restore from backup if needed

---

**For additional support, contact the development team or create an issue in the repository.**
