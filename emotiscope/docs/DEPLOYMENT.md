# 🚀 EmotiScope Deployment Guide

Complete guide for deploying EmotiScope to production.

---

## Quick Deploy Options

### 1. Netlify (Recommended) ⚡
**Time: 2 minutes | Cost: Free | Difficulty: Easy**

#### Method A: Drag & Drop
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `emotiscope` folder
3. Done! You get a URL like `random-name-123.netlify.app`
4. (Optional) Set custom domain in settings

#### Method B: Git Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd emotiscope
netlify init
netlify deploy --prod
```

#### Method C: One-Click
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jdlambert0/emo)

**Configuration**: Uses `deploy/netlify.toml` automatically

---

### 2. Vercel ⚡
**Time: 2 minutes | Cost: Free | Difficulty: Easy**

#### Method A: CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd emotiscope
vercel --prod
```

#### Method B: Git Integration
1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repository
4. Deploy!

#### Method C: One-Click
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jdlambert0/emo)

**Configuration**: Uses `deploy/vercel.json` automatically

---

### 3. GitHub Pages 📄
**Time: 3 minutes | Cost: Free | Difficulty: Easy**

```bash
# Push to GitHub
git add .
git commit -m "Add EmotiScope"
git push origin main

# Enable GitHub Pages
# 1. Go to repo Settings
# 2. Pages section
# 3. Source: main branch / root
# 4. Save

# Your site: https://USERNAME.github.io/REPO/emotiscope
```

**Note**: Update paths if not in root directory

---

### 4. Docker (Self-Host) 🐳
**Time: 5 minutes | Cost: Varies | Difficulty: Medium**

#### Quick Start
```bash
cd emotiscope/deploy
docker-compose up -d

# Visit: http://localhost
# or http://YOUR_SERVER_IP
```

#### Production Deploy
```bash
# Build image
docker build -t emotiscope:latest -f deploy/Dockerfile .

# Run container
docker run -d \
  --name emotiscope \
  -p 80:80 \
  --restart unless-stopped \
  emotiscope:latest

# Check status
docker ps
docker logs emotiscope
```

#### With HTTPS (Let's Encrypt)
```bash
# Use Nginx Proxy Manager or Traefik
docker-compose --profile https up -d

# Or use Certbot
certbot --nginx -d yourdomain.com
```

---

### 5. Cloudflare Pages 🌐
**Time: 3 minutes | Cost: Free | Difficulty: Easy**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Pages → Create project
3. Connect Git repository
4. Build settings:
   - Build command: (leave empty)
   - Build output: `emotiscope`
5. Deploy!

**Bonus**: Automatic HTTPS, CDN, DDoS protection

---

### 6. AWS S3 + CloudFront ☁️
**Time: 15 minutes | Cost: ~$1/month | Difficulty: Medium**

```bash
# Install AWS CLI
pip install awscli

# Configure
aws configure

# Create S3 bucket
aws s3 mb s3://emotiscope-yourname

# Enable static hosting
aws s3 website s3://emotiscope-yourname \
  --index-document index.html \
  --error-document index.html

# Upload files
cd emotiscope
aws s3 sync . s3://emotiscope-yourname \
  --acl public-read

# (Optional) Setup CloudFront CDN
# Follow: https://docs.aws.amazon.com/AmazonS3/latest/userguide/website-hosting-cloudfront-walkthrough.html
```

---

### 7. DigitalOcean App Platform 🌊
**Time: 5 minutes | Cost: $5/month | Difficulty: Easy**

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com/)
2. Create → Apps
3. Connect GitHub repo
4. Select `emotiscope` folder
5. Environment: Static Site
6. Deploy!

---

### 8. Traditional Web Hosting 🖥️
**Time: 10 minutes | Cost: Varies | Difficulty: Easy**

#### Via FTP
1. Connect to your hosting via FTP (FileZilla, etc.)
2. Upload entire `emotiscope` folder
3. Navigate to `yourdomain.com/emotiscope`

#### Via cPanel
1. Login to cPanel
2. File Manager → public_html
3. Upload ZIP of emotiscope folder
4. Extract
5. Done!

---

## Custom Domain Setup

### Netlify
```bash
# Via CLI
netlify domains:add yourdomain.com

# Or in dashboard:
# Site settings → Domain management → Add custom domain
```

### Vercel
```bash
# Via CLI
vercel domains add yourdomain.com

# Or in dashboard:
# Project → Settings → Domains
```

### Cloudflare
Automatic if domain is on Cloudflare!

### Generic
Update your DNS records:
```
Type: A
Name: @  (or subdomain)
Value: YOUR_SERVER_IP

Type: CNAME
Name: www
Value: yourdomain.com
```

---

## SSL/HTTPS Setup

### Automatic (Recommended)
Most platforms (Netlify, Vercel, Cloudflare, GitHub Pages) provide automatic HTTPS. No configuration needed!

### Manual (Self-Hosted)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Environment Variables

EmotiScope doesn't need environment variables (privacy-first!), but if you add features:

### Netlify/Vercel
```bash
# Dashboard → Settings → Environment Variables
```

### Docker
```bash
# docker-compose.yml
environment:
  - CUSTOM_VAR=value
```

---

## Performance Optimization

### 1. Enable Caching
Already configured in:
- `deploy/netlify.toml`
- `deploy/vercel.json`
- `deploy/nginx.conf`

### 2. Enable Compression
Gzip is enabled in all configs.

### 3. CDN
Netlify, Vercel, Cloudflare include CDN automatically.

For others, use Cloudflare as proxy:
1. Point domain to Cloudflare nameservers
2. Enable "Proxied" (orange cloud)
3. Done!

### 4. Image Optimization
```bash
# If you add images, optimize them:
npm install -g imagemin-cli

imagemin assets/*.png --out-dir=assets
```

---

## Security Checklist

✅ **Headers** (included in configs):
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

✅ **HTTPS**: Enforce HTTPS only

✅ **CSP** (optional, add if needed):
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.openai.com https://api.anthropic.com;";
```

✅ **Rate Limiting** (for self-hosted):
```nginx
limit_req_zone $binary_remote_addr zone=emotiscope:10m rate=10r/s;
limit_req zone=emotiscope burst=20 nodelay;
```

---

## Monitoring

### Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://www.pingdom.com/)
- Cloudflare Analytics (if using CF)

### Error Tracking
Since we don't use analytics, monitor via:
- Server logs
- User reports
- Browser console (during testing)

---

## Backup

### Automatic (Git-based deploys)
Your code is the backup! Every push to GitHub is a backup.

### Manual
```bash
# Backup code
git archive --format=zip --output=emotiscope-backup.zip HEAD

# Users should export their data via app
# (This is a feature we should add!)
```

---

## Troubleshooting Deployment

### "404 Not Found"
**Netlify/Vercel**: Check redirects/rewrites in config
**GitHub Pages**: Ensure correct branch and folder
**Self-hosted**: Check nginx root path

### "Mixed Content" (HTTP resources on HTTPS)
Ensure all resources use HTTPS or relative URLs. Already fixed in our code!

### "Service Worker Not Loading"
Ensure correct `Cache-Control` headers. Already configured!

### "PWA Not Installing"
- Serve over HTTPS (required)
- Check `manifest.json` is accessible
- Check console for errors

### "Slow Loading"
- Enable CDN (Cloudflare)
- Check server location vs user location
- Enable compression (already done)
- Optimize assets

---

## Scaling

### Traffic Handling

**0-10k users/month**: Free tier (Netlify/Vercel) is plenty

**10k-100k users/month**: Still free tier! Static sites scale infinitely.

**100k+ users/month**:
- Use CDN (Cloudflare)
- Enable caching aggressively
- Consider multi-region deploy

### Cost Estimates

| Platform | 10k users | 100k users | 1M users |
|----------|-----------|------------|----------|
| Netlify | Free | Free | $20/mo |
| Vercel | Free | Free | $20/mo |
| Cloudflare | Free | Free | Free! |
| AWS S3+CF | $1 | $5 | $50 |
| Self-host | $5 | $5 | $20 |

**Bandwidth**: Static files are tiny (<100KB). 1M users = ~100GB/month.

---

## CI/CD Pipeline

### GitHub Actions (Auto-deploy)
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

      # Netlify
      - uses: nwtgck/actions-netlify@v1
        with:
          publish-dir: './emotiscope'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

      # Or Vercel
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
```

---

## Multi-Region Deploy

For global users:

### Cloudflare
Automatic! Their CDN is worldwide.

### Netlify/Vercel
Already multi-region by default.

### AWS
Deploy to multiple regions:
```bash
# US East
aws s3 sync . s3://emotiscope-us-east --region us-east-1

# Europe
aws s3 sync . s3://emotiscope-eu --region eu-west-1

# Asia
aws s3 sync . s3://emotiscope-asia --region ap-southeast-1

# Use Route53 for geo-routing
```

---

## Production Checklist

Before launching:

✅ **Functionality**
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (iOS, Android)
- [ ] Test PWA install
- [ ] Test offline mode
- [ ] Test with real API keys
- [ ] Test all features

✅ **Performance**
- [ ] Load time < 2 seconds
- [ ] PWA Lighthouse score > 90
- [ ] Check bundle size
- [ ] Test on slow connection

✅ **Security**
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] No API keys in code
- [ ] Privacy policy added
- [ ] Terms of service (if needed)

✅ **SEO** (optional)
- [ ] Meta tags set
- [ ] Open Graph tags
- [ ] Twitter cards
- [ ] Sitemap
- [ ] robots.txt

✅ **Analytics** (remember: no tracking!)
- [ ] Server logs only
- [ ] No Google Analytics
- [ ] No tracking scripts

✅ **Legal**
- [ ] Privacy policy
- [ ] Disclaimer (not therapy)
- [ ] License file
- [ ] Attribution to MHH framework

---

## Post-Launch

### Monitor
- Uptime (UptimeRobot)
- Server logs
- User feedback

### Promote
- Reddit: r/emotionalintelligence, r/selfimprovement
- Hacker News: Show HN
- Product Hunt
- Twitter/X

### Iterate
- Gather feedback
- Fix bugs
- Add features
- Update documentation

---

## Need Help?

- **General questions**: [GitHub Discussions](https://github.com/jdlambert0/emo/discussions)
- **Bugs**: [GitHub Issues](https://github.com/jdlambert0/emo/issues)
- **Security**: Email security@yourdomain.com (setup after deploy)

---

**Congratulations on deploying EmotiScope!** 🎉

Your users now have access to privacy-first emotional intelligence education.

---

[← Back to README](../README.md) | [User Guide →](USER_GUIDE.md)
