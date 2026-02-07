# Troubleshooting Guide

Common issues and their solutions for the Cleveland LGBTQ Center Client Follow-Up Automation System.

## Quick Links

- [Installation Issues](#installation-issues)
- [Email Problems](#email-problems)
- [Performance Issues](#performance-issues)
- [Database Errors](#database-errors)
- [Desktop App Issues](#desktop-app-issues)
- [Web App Issues](#web-app-issues)

---

## Installation Issues

### Windows: "Windows protected your PC" Message

**Problem**: Windows SmartScreen blocks the installer.

**Solution**:
1. Click "**More info**"
2. Click "**Run anyway**"
3. This is normal for new software without widespread distribution

**Why**: The installer isn't digitally signed yet (we're a small nonprofit project).

### Mac: "Cannot open because it is from an unidentified developer"

**Problem**: macOS Gatekeeper blocks the app.

**Solution**:
1. Right-click the app
2. Select "**Open**"
3. Click "**Open**" in the dialog
4. Enter your password if prompted

**Alternative**:
```bash
xattr -cr /Applications/LGBTQ-Center-Automation.app
```

### Node.js Installation Fails

**Problem**: Web app won't install Node.js dependencies.

**Solution**:
1. Verify Node.js version: `node --version` (should be 20+)
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` folder
4. Run `npm install` again
5. If still failing, try with administrator privileges

---

## Email Problems

### "Authentication Failed" Error

**Problem**: System can't connect to your email server.

**Common Causes & Solutions**:

#### 1. Not Using App-Specific Password
- **Gmail**: Must use an app password, not your regular password
- **Generate**: Go to Google Account → Security → App Passwords
- **Use**: The 16-character password Google provides

#### 2. Wrong SMTP Settings

**Gmail**:
```
Host: smtp.gmail.com
Port: 587
Security: TLS
```

**Outlook/Microsoft 365**:
```
Host: smtp.office365.com
Port: 587
Security: TLS
```

**Yahoo**:
```
Host: smtp.mail.yahoo.com
Port: 587
Security: TLS
```

#### 3. Two-Factor Authentication Not Enabled
- Many providers require 2FA before generating app passwords
- Enable 2FA first, then create app password

### Emails Not Sending

**Problem**: No error message, but emails aren't being sent.

**Checklist**:
1. ✅ Check "**Email Queue**" — Are they queued?
2. ✅ Check automation isn't paused: Settings → Automation
3. ✅ Verify client has valid email address
4. ✅ Check spam/junk folder (first test)
5. ✅ Verify SMTP connection: Settings → Test Connection

### Emails Going to Spam

**Problem**: Your emails land in recipients' spam folders.

**Solutions**:
1. **Use proper from address**: Use your organization's domain
2. **Add SPF record**: Contact your IT or domain provider
3. **Keep content clean**: Avoid spam trigger words
4. **Warm up slowly**: Start with small batches
5. **Monitor bounces**: Remove bad addresses promptly

**Ask recipients to**:
- Add your email to their contacts
- Mark your email as "Not Spam"

### "Connection Timeout" Error

**Problem**: SMTP connection times out.

**Checklist**:
1. ✅ Check internet connection
2. ✅ Verify firewall isn't blocking ports 587 or 465
3. ✅ Try different port (587 vs 465)
4. ✅ Check if antivirus is blocking connection
5. ✅ Verify SMTP server address is correct

**Test manually**:
```bash
# Test if port 587 is reachable
telnet smtp.gmail.com 587
```

If telnet fails, it's a network/firewall issue.

---

## Performance Issues

### Desktop App Slow to Start

**Problem**: App takes 30+ seconds to launch.

**Solutions**:
1. **Too many clients**: Archive old clients (Settings → Archive)
2. **Large database**: Compact database (Settings → Maintenance)
3. **Antivirus scanning**: Add app to exclusions
4. **Low RAM**: Close other applications

### Web App Loads Slowly

**Problem**: Web pages take a long time to load.

**Solutions**:
1. **Check server resources**: CPU and RAM usage
2. **Restart the backend**: `npm run restart:backend`
3. **Clear browser cache**: Ctrl+Shift+Delete
4. **Check database size**: May need optimization
5. **Reduce concurrent users**: Upgrade server if needed

### Search Is Slow

**Problem**: Client search takes several seconds.

**Solution**:
1. Go to Settings → Maintenance
2. Click "**Rebuild Search Index**"
3. Wait for completion (may take 5-10 minutes)
4. Search should be much faster

---

## Database Errors

### "Database Locked" Error

**Problem**: SQLite database is locked.

**Causes**:
- Another instance of the app is running
- Previous crash left connection open
- Backup is running

**Solution**:
1. Close all instances of the app
2. Check Task Manager for background processes
3. Restart computer if needed
4. If persists, restore from backup

### "Database Corrupted" Error

**Problem**: Database file is damaged.

**Solution**:
1. **Don't panic** — Your data is likely recoverable
2. Close the application
3. Go to Settings → Backup
4. Restore from your most recent backup
5. If no backup exists, contact support immediately

**Prevention**:
- Enable automatic daily backups
- Don't force-quit the application
- Use "Safely Remove Hardware" for USB drives

### "Out of Disk Space" Error

**Problem**: No space left for database operations.

**Solution**:
1. Check available disk space
2. Delete unnecessary files
3. Move database to drive with more space:
   - Settings → Database → Change Location
   - Choose new folder
   - System will move database automatically

---

## Desktop App Issues

### App Won't Open (Windows)

**Problem**: Double-clicking does nothing.

**Solutions**:

1. **Check if already running**:
   - Look for icon in system tray (bottom right)
   - Check Task Manager

2. **Run as Administrator**:
   - Right-click app icon
   - Select "Run as administrator"

3. **Check Windows Event Log**:
   - Windows Key + X → Event Viewer
   - Windows Logs → Application
   - Look for errors from the app

4. **Reinstall**:
   - Uninstall via Control Panel
   - Delete `C:\Program Files\LGBTQ Center Automation`
   - Reinstall from fresh download

### Updates Won't Install

**Problem**: "Update failed" message.

**Solution**:
1. Close the application completely
2. Download latest installer manually
3. Run installer (it will update in place)
4. No need to uninstall first

### Settings Won't Save

**Problem**: Changes to settings don't persist.

**Solution**:
1. **Permission issue**: Run as administrator once
2. **Disk full**: Free up space
3. **Antivirus interference**: Add app to exclusions
4. **Config file corrupted**: Delete `config.json` (settings will reset)

---

## Web App Issues

### "Cannot Connect to Server" Error

**Problem**: Frontend can't reach backend API.

**Solutions**:

1. **Check backend is running**:
   ```bash
   # Look for "Server running on port 3000"
   ```

2. **Check firewall**:
   - Allow port 3000 (or your custom port)
   - Windows: Windows Defender Firewall
   - Mac: System Preferences → Security

3. **Check URL**:
   - Should be `http://localhost:3000` (on same machine)
   - Or `http://[server-ip]:3000` (from different machine)

4. **Restart backend**:
   ```bash
   # Stop the backend (Ctrl+C)
   npm run dev:backend
   ```

### Login Loop (Keep Getting Logged Out)

**Problem**: Can't stay logged in for more than a minute.

**Causes & Solutions**:

1. **Cookies disabled**:
   - Enable cookies in browser settings
   - Allow cookies for localhost

2. **Time synchronization**:
   - Check computer's date/time is correct
   - Sync with internet time

3. **Session storage issue**:
   - Clear browser data
   - Try incognito/private mode
   - Try different browser

### Port 3000 Already in Use

**Problem**: Error says port 3000 is already in use.

**Solution**:

**Windows**:
```cmd
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (use PID from above)
taskkill /PID [number] /F
```

**Mac/Linux**:
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill [PID]
```

**Or use a different port**:
```bash
# Edit .env file
PORT=3001
```

---

## Data Import Issues

### CSV Import Fails

**Problem**: "Import failed" or some rows skipped.

**Common Issues**:

1. **Wrong format**: Use provided template exactly
2. **Date format**: Use `YYYY-MM-DD HH:MM` (e.g., `2024-01-15 10:00`)
3. **Email validation**: Check for typos in email addresses
4. **Special characters**: Remove commas from names
5. **Encoding**: Save CSV as UTF-8

**Example of correct CSV**:
```csv
first_name,last_name,email,phone,appointment_date,service_type
John,Doe,john@example.com,216-555-0123,2024-01-15 10:00,Counseling
```

### Duplicate Client Warning

**Problem**: System says client already exists.

**Solution**:
- System matches on email address
- If importing same person again, you'll see a warning
- Choose: "Update existing" or "Skip"

---

## Still Having Issues?

### Before Contacting Support

1. ✅ Check this troubleshooting guide
2. ✅ Try restarting the application
3. ✅ Check for updates
4. ✅ Review error messages carefully
5. ✅ Try on a different computer (if possible)

### Contact Support

📧 **Email**: [contact@alignment-ai.io](mailto:contact@alignment-ai.io)

**Include in your email**:
- What you were trying to do
- What happened (exact error message if any)
- Your operating system and version
- App version (Help → About)
- Screenshots (if applicable)
- Steps to reproduce the issue

**Response time**: Usually within 24-48 hours

### Emergency Support

For critical issues affecting client service:
- Email subject line: "**URGENT: [brief description]**"
- Include phone number for callback
- Describe impact on clients

---

## Preventive Maintenance

To avoid issues:

✅ **Daily**:
- Check email queue is processing

✅ **Weekly**:
- Review sent emails for bounces
- Check disk space

✅ **Monthly**:
- Update to latest version
- Test database backup/restore
- Review and archive old clients

✅ **Quarterly**:
- Rotate email passwords
- Review user access (web app)
- Check server security updates

---

**Most issues can be resolved quickly. Don't hesitate to reach out if you're stuck!**
