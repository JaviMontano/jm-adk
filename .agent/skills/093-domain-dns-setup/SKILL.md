---
name: domain-dns-setup
description: DNS configuration for Firebase Hosting (A/CNAME), email (MX), verification (TXT), and SSL certificate management
version: 1.0.0
status: production
owner: Javier Montaño
tags: [devops, dns, domain, ssl, firebase-hosting, mx-records, cname]
---

# 093 — Domain & DNS Setup {DevOps}

## Purpose
Configure DNS records for Firebase Hosting, email delivery, domain verification, and SSL certificates. Ensure all domains resolve correctly with proper security and email functionality.

## Physics — 3 Immutable Laws

1. **Law of DNS Propagation**: DNS changes take 1-48 hours to propagate globally. Plan changes in advance. Never change DNS during high-traffic periods.
2. **Law of Record Specificity**: Each record type serves one purpose. A records for hosting, MX for email, TXT for verification, CNAME for aliases. Never mix purposes.
3. **Law of SSL Enforcement**: All domains serve HTTPS only. HTTP redirects to HTTPS. HSTS headers enabled with 1-year max-age.

## Protocol

### Phase 1 — Firebase Hosting Domain
1. In Firebase Console → Hosting → Add Custom Domain.
2. Add A records in DNS provider pointing to Firebase IPs (provided in console).
3. Add TXT record for domain ownership verification.
4. Wait for SSL provisioning (Firebase uses Let's Encrypt, auto-renews).
5. Verify: `curl -I https://yourdomain.com` returns Firebase hosting headers.

### Phase 2 — Email Configuration
1. Add MX records for email provider (Google Workspace, Zoho, etc.).
2. Add SPF TXT record: `v=spf1 include:_spf.google.com ~all`.
3. Add DKIM TXT record from email provider.
4. Add DMARC TXT record: `v=DMARC1; p=quarantine; rua=mailto:admin@domain.com`.

### Phase 3 — Subdomain & Alias Setup
1. `www` CNAME → root domain (or Firebase Hosting).
2. `api.domain.com` CNAME → Cloud Functions URL or Cloud Run service.
3. `staging.domain.com` A records → staging Firebase project.
4. Wildcard `*.domain.com` only if needed — prefer explicit subdomains.

## I/O

| Input | Output |
|-------|--------|
| Domain name + Firebase project | A/TXT records for hosting |
| Email provider config | MX/SPF/DKIM/DMARC records |
| Subdomain requirements | CNAME records for each subdomain |
| DNS provider access | Configured zone file |

## Quality Gates — 5 Checks

1. **A records resolve to Firebase IPs** — `dig A yourdomain.com` returns expected IPs.
2. **SSL certificate active** — no mixed content warnings, HSTS header present.
3. **MX records valid** — `dig MX yourdomain.com` returns email provider.
4. **SPF + DKIM + DMARC configured** — email passes authentication checks.
5. **No dangling CNAMEs** — all CNAME targets are active services.

## Edge Cases

- **Cloudflare proxy**: Disable orange cloud (proxy) for Firebase Hosting A records — Firebase needs direct connection for SSL.
- **Subdomain delegation**: If subdomain managed separately, add NS records for delegation.
- **CAA records**: Add CAA record allowing Let's Encrypt: `0 issue "letsencrypt.org"`.
- **TTL strategy**: Set low TTL (300s) before migration, increase to 3600s after verification.

## Self-Correction Triggers

- SSL not provisioning → check A records, remove Cloudflare proxy, verify TXT record.
- Email going to spam → verify SPF, DKIM, DMARC records. Test with mail-tester.com.
- Domain not resolving → check nameserver configuration, verify zone file syntax.
- Mixed content warnings → audit all asset URLs, ensure HTTPS everywhere.
