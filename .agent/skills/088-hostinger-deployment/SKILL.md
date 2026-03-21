---
name: hostinger-deployment
description: Static site and Node.js deployment on Hostinger via SFTP/Git, cPanel/hPanel config, and PM2 process management
version: 1.0.0
status: production
owner: Javier Montaño
tags: [devops, hostinger, deployment, sftp, vps, pm2, cpanel]
---

# 088 — Hostinger Deployment {DevOps}

## Purpose
Deploy static sites and Node.js applications to Hostinger infrastructure. Configure SFTP/Git-based deployment pipelines, VPS hosting with PM2, and hPanel/cPanel management.

## Physics — 3 Immutable Laws

1. **Law of Reproducible Deploy**: Every deployment is scripted — no manual file uploads. SFTP scripts or Git hooks handle file transfer.
2. **Law of Zero Downtime**: PM2 handles graceful restarts. Static sites use atomic directory swaps. Users never see a broken state.
3. **Law of Environment Isolation**: Production config never touches development data. Separate `.env` files, separate database connections.

## Protocol

### Phase 1 — Static Site Deployment
1. Build locally: `npm run build` → `dist/` directory.
2. Configure SFTP credentials in CI secrets (host, user, SSH key).
3. Deploy via `rsync` or `lftp`: sync `dist/` to `public_html/`.
4. Verify `.htaccess` for SPA routing: `RewriteRule ^(.*)$ /index.html [L]`.

### Phase 2 — Node.js VPS Deployment
1. SSH into VPS. Install Node.js via `nvm`. Install PM2 globally.
2. Clone repo or pull via Git. Run `npm ci --production`.
3. Configure PM2 ecosystem file: `ecosystem.config.js` with `name`, `script`, `env`.
4. Start: `pm2 start ecosystem.config.js --env production`. Save: `pm2 save`. Setup startup: `pm2 startup`.

### Phase 3 — CI/CD Integration
1. GitHub Actions workflow: build → test → deploy via SSH.
2. Use `appleboy/ssh-action` for remote commands.
3. PM2 pull and reload: `cd /app && git pull && npm ci && pm2 reload all`.
4. Verify deployment: HTTP health check on deployed URL.

## I/O

| Input | Output |
|-------|--------|
| Built static files (`dist/`) | Files deployed to `public_html/` |
| Node.js application source | PM2-managed process on VPS |
| SFTP/SSH credentials | Automated deployment pipeline |
| `ecosystem.config.js` | PM2 process configuration |

## Quality Gates — 5 Checks

1. **Build succeeds locally before deploy** — CI runs full build + test.
2. **SSH keys rotated quarterly** — no password-based SSH access.
3. **PM2 status shows online** — `pm2 status` verifies process running.
4. **Health check passes** — HTTP 200 on root URL after deploy.
5. **Rollback tested** — previous version deployable within 5 minutes.

## Edge Cases

- **PHP coexistence**: Hostinger shared hosting may run PHP. Ensure `.htaccess` doesn't conflict with Node.js reverse proxy.
- **SSL renewal**: Hostinger auto-renews Let's Encrypt. Verify cron job exists.
- **Memory limits**: Shared hosting has RAM limits. Monitor PM2 memory with `pm2 monit`.
- **File permissions**: Set `chmod 755` for directories, `644` for files in `public_html`.

## Self-Correction Triggers

- Deploy fails → check SSH connectivity, disk space, Node.js version.
- PM2 process crashes → check logs `pm2 logs`, increase memory limit or fix crash.
- SSL expired → re-run certbot or check Hostinger auto-renewal config.
- Site returns 500 → check `.htaccess` rules, Node.js process status, error logs.
