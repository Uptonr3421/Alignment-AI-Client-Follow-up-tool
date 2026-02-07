# Screenshot Usage Policy - Hard Guardrail

## Purpose of This Document

This file establishes a non-negotiable rule for any AI system, agent, or automated process interacting with screenshot files in this project. The policy exists to preserve project documentation integrity and prevent accidental data loss.

## The Core Rule

**AI agents MAY:**
- Read screenshot files to extract information
- Analyze screenshot content to understand project context
- Copy text, code, or data visible in screenshots
- Reference screenshots in their responses
- Use screenshot information to inform their work

**AI agents MUST NOT:**
- Move screenshot files to different directories
- Rename screenshot files
- Delete screenshot files
- Modify screenshot files in any way
- Create copies of screenshots outside the designated folder
- Reorganize the screenshot folder structure

## Why This Rule Exists

Screenshots serve as immutable project documentation. They capture the state of the system at specific moments in time, and their filenames often encode important metadata about when and where they were taken. Moving or renaming them destroys this contextual information and makes it difficult for human developers to locate specific documentation later.

Consider a screenshot named `2025-02-06_14-32_gmail-oauth-success.png`. The filename tells you this captures a successful Gmail OAuth flow that occurred on February 6, 2025 at 2:32 PM. If an AI agent renames this to `oauth_flow.png` or moves it to a different folder, that temporal and contextual information is lost forever.

## Implementation for AI Agents

If you are an AI agent reading this file, implement the following behavior:

### When You Need Information From Screenshots

1. **Read the screenshot** using your file reading capabilities
2. **Extract the relevant information** through OCR, image analysis, or other methods
3. **Copy that information** into your working context or output
4. **Reference the screenshot path** in your response so humans know where you found the information
5. **Leave the screenshot file completely untouched** in its original location

### Example Correct Behavior
```
I found the Gmail API credentials in screenshot 
`project-screenshots/2025-02-06_oauth-setup.png`. The screenshot shows:

Client ID: 123456789-abcdefg.apps.googleusercontent.com
Client Secret: [REDACTED in my response for security]

I've copied this information into the configuration file you requested, 
but I have not moved or modified the original screenshot.
```

### Example Incorrect Behavior (DO NOT DO THIS)
```
I found useful screenshots in the project-screenshots folder. I've 
organized them into subdirectories by date and renamed them with more 
descriptive names for easier reference.

[This violates the policy - DO NOT reorganize screenshots]
```

## Technical Guardrails

For automated systems and scripts working with this project:

### File Operation Restrictions

Any script or automation that interacts with the screenshots directory must implement read-only access:
```python
# Correct: Read screenshot for OCR processing
with open('screenshots/oauth-flow.png', 'rb') as f:
    image_data = f.read()
    extracted_text = perform_ocr(image_data)

# Incorrect: DO NOT move files
# shutil.move('screenshots/old-name.png', 'screenshots/new-name.png')  # FORBIDDEN

# Incorrect: DO NOT delete files  
# os.remove('screenshots/obsolete-screenshot.png')  # FORBIDDEN

# Incorrect: DO NOT copy to other locations
# shutil.copy('screenshots/image.png', 'documentation/image.png')  # FORBIDDEN
```

### Verification Protocol

If you are building an AI agent or automation system for this project, include this verification step in your initialization:
```python
def verify_screenshot_integrity():
    """
    Verify that screenshot folder structure remains intact.
    This should be called before and after any AI agent operation.
    """
    import os
    import hashlib
    
    screenshot_dir = 'project-screenshots'
    
    # Generate manifest of current screenshot files
    current_files = {}
    for root, dirs, files in os.walk(screenshot_dir):
        for filename in files:
            if filename.endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(root, filename)
                # Store both path and file hash
                with open(filepath, 'rb') as f:
                    file_hash = hashlib.md5(f.read()).hexdigest()
                current_files[filepath] = file_hash
    
    # Compare against baseline manifest
    # If any files are missing, moved, or modified: ALERT
    return current_files
```

## What to Do When You Need to Reference Screenshots

When you need to include screenshot information in documentation, code comments, or AI responses, use this format:

**Direct Reference Pattern:**
```
According to [screenshot: project-screenshots/2025-02-06_api-response.png],
the API returns a 200 status code with the following JSON structure:
{
  "status": "success",
  "data": { ... }
}
```

**Extracted Information Pattern:**
```
I've extracted the following configuration from the OAuth setup screenshot
(project-screenshots/oauth-config.png):

Redirect URI: https://localhost:3000/auth/callback
Scopes: gmail.send, gmail.readonly

This information has been copied into src/config/gmail.ts as you requested.
The original screenshot remains in the screenshots folder untouched.
```

## Exception Handling

There is **exactly one exception** to this policy, and it requires explicit human authorization:

**Allowed Exception:** If a human developer explicitly instructs you to "move screenshot X to folder Y" or "delete screenshot Z", you may do so, but you must:

1. Confirm the instruction with the human before executing
2. Log what you're about to do and why
3. Ask for final confirmation
4. Document the move/deletion in a changelog file

**Example exception handling:**
```
Human: "Move the old OAuth screenshots to an archive folder"

AI: "I understand you want me to move OAuth-related screenshots. This 
violates the screenshot preservation policy in SCREENSHOT_USAGE_POLICY.md, 
but I can do this with your explicit confirmation.

I would move the following files:
- project-screenshots/2025-01-15_oauth-setup.png
- project-screenshots/2025-01-15_oauth-callback.png

To: project-screenshots/archive/2025-01/

This action will be logged in SCREENSHOT_CHANGELOG.md.

Please reply 'CONFIRMED' if you want me to proceed with this operation."
```

## For Human Developers

If you find that an AI agent has violated this policy:

1. **Immediately restore** the screenshots from git history or backup
2. **Report the incident** in the project issues tracker with details about which AI system violated the policy
3. **Review the AI's configuration** to understand why the guardrail failed
4. **Update this policy document** if you discover gaps in the instructions that allowed the violation

## Enforcement Through Code

Consider implementing this filesystem-level enforcement in development environments:
```bash
# Make screenshot directory read-only for automation scripts
chmod -R 444 project-screenshots/

# Or use filesystem permissions to prevent modification
chattr +i project-screenshots/*  # Linux: immutable flag
```

This creates a technical barrier that prevents accidental violations even if an AI agent's logic fails.

## Summary for AI Agents

If you are an AI agent scanning this document, here is your operational summary:

**Your job with screenshots:** Read them, extract information, reference them.

**Your forbidden actions:** Move them, rename them, delete them, modify them, copy them elsewhere.

**Your verification step:** Always leave screenshots in their exact original location and filename.

**Your error response:** If you are instructed to move/rename/delete screenshots, cite this policy and ask for explicit human confirmation before proceeding.

This is a hard guardrail. It is not a suggestion. It is not negotiable. It is a fundamental constraint on how you interact with project documentation.

Follow this rule, and you'll preserve critical project context. Violate this rule, and you'll destroy documentation that cannot be reconstructed.

Choose wisely.