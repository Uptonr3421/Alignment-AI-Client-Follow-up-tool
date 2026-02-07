# Security Policy

## Our Commitment

The security of the Cleveland LGBTQ Center's data is paramount. We take all security vulnerabilities seriously and appreciate the security research community's efforts to responsibly disclose issues.

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

📧 **[security@alignment-ai.io](mailto:security@alignment-ai.io)**

### What to Include

Please include the following information:

1. **Description** — Brief overview of the vulnerability
2. **Impact** — What an attacker could achieve
3. **Steps to Reproduce** — Detailed steps to trigger the vulnerability
4. **Affected Components** — Which parts of the system are affected
5. **Suggested Fix** — If you have ideas (optional)
6. **Your Contact Info** — So we can follow up

### What to Expect

- **Acknowledgment**: We'll respond within 48 hours
- **Updates**: We'll keep you informed as we investigate
- **Timeline**: We aim to patch critical vulnerabilities within 7 days
- **Credit**: With your permission, we'll credit you in the security advisory

## Security Measures in Place

This system implements several security best practices:

### Data Protection
- ✅ Encrypted credential storage
- ✅ No plaintext passwords in database
- ✅ Local-only data storage (no cloud sync)
- ✅ Secure environment variable handling

### Input Validation
- ✅ All user inputs validated
- ✅ Email address format checking
- ✅ File upload restrictions
- ✅ API parameter sanitization

### SQL Injection Prevention
- ✅ Parameterized queries exclusively
- ✅ ORM usage for database access
- ✅ No dynamic SQL construction
- ✅ Input escaping where needed

### XSS Protection
- ✅ HTML sanitization on output
- ✅ Content Security Policy headers
- ✅ React's built-in XSS protection
- ✅ No `dangerouslySetInnerHTML` without sanitization

### Authentication & Authorization
- ✅ Session-based authentication
- ✅ CSRF token protection
- ✅ Secure session cookies (httpOnly, secure, sameSite)
- ✅ Role-based access control

### Dependencies
- ✅ Regular dependency updates
- ✅ Automated vulnerability scanning in CI
- ✅ No dependencies with known critical vulnerabilities
- ✅ Minimal dependency footprint

## Known Limitations

### Desktop App
- Credentials stored locally using OS keychain
- No multi-user support (single-user device assumed)
- File system access required for database

### Web App
- Requires HTTPS in production
- Session tokens stored in secure cookies
- Database connection must be secured

## Security Best Practices for Users

### Desktop App Users
1. Keep Windows up to date
2. Use Windows Defender or equivalent antivirus
3. Don't share your device with untrusted users
4. Back up your data regularly

### Web App Administrators
1. **Use HTTPS** — Never run in production without TLS
2. **Secure Database** — Use strong credentials, restrict network access
3. **Keep Updated** — Install security patches promptly
4. **Monitor Logs** — Check for suspicious activity
5. **Backup Regularly** — Maintain encrypted backups
6. **Firewall Rules** — Restrict access to necessary ports only

### Email Configuration
1. Use **app-specific passwords**, not account passwords
2. Enable **2FA** on email accounts
3. Use **TLS/SSL** for SMTP connections
4. **Rotate credentials** periodically

## Disclosure Policy

When we receive a security vulnerability report:

1. We'll confirm receipt within 48 hours
2. We'll investigate and develop a fix
3. We'll notify the reporter when the fix is ready
4. We'll release a patch and security advisory
5. We'll credit the reporter (unless they prefer anonymity)

We believe in responsible disclosure:
- We request 90 days before public disclosure
- We'll work with you to coordinate disclosure timing
- We'll credit security researchers appropriately

## Hall of Fame

We maintain a list of security researchers who have helped protect this project:

<!-- List will be populated as researchers contribute -->

*No security issues reported yet. Be the first!*

## Contact

For security issues: **[security@alignment-ai.io](mailto:security@alignment-ai.io)**  
For general questions: **[contact@alignment-ai.io](mailto:contact@alignment-ai.io)**

## PGP Key

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
(PGP key will be provided upon request)
-----END PGP PUBLIC KEY BLOCK-----
```

---

**Thank you for helping keep the Cleveland LGBTQ Center's data secure! 🔒**
