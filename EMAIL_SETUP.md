# Email Notification Setup Guide

This guide explains how to set up email notifications for the notes feature.

## Current Status

The notes feature is **fully functional** for saving notes to the database. Email notifications are currently **simulated** (logged to console) and ready for backend integration.

## Option 1: Using Resend (Recommended - Easiest)

### 1. Sign up for Resend
- Visit https://resend.com
- Sign up for a free account (100 emails/day free tier)
- Get your API key

### 2. Create a Serverless Function

Create `/api/send-note-email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, monthName, userName, content, timestamp } = req.body;

  try {
    await resend.emails.send({
      from: 'Sales Plan <noreply@yourdomain.com>',
      to: [to],
      subject: `New Note Added: ${monthName}`,
      html: `
        <h2>New Note Added to ${monthName}</h2>
        <p><strong>From:</strong> ${userName}</p>
        <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <p><strong>Note:</strong></p>
        <blockquote style="border-left: 3px solid #3b82f6; padding-left: 15px; margin: 10px 0;">
          ${content.replace(/\n/g, '<br>')}
        </blockquote>
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from Physique 57 India Sales Plan.
        </p>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
```

### 3. Install Resend Package

```bash
npm install resend
```

### 4. Add Environment Variable

Create `.env.local`:
```
RESEND_API_KEY=re_your_api_key_here
```

## Option 2: Using SendGrid

### 1. Sign up for SendGrid
- Visit https://sendgrid.com
- Sign up for a free account (100 emails/day)
- Get your API key

### 2. Create API Endpoint

Create `/api/send-note-email.ts`:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, monthName, userName, content, timestamp } = req.body;

  const msg = {
    to,
    from: 'noreply@yourdomain.com', // Must be verified in SendGrid
    subject: `New Note Added: ${monthName}`,
    html: `
      <h2>New Note Added to ${monthName}</h2>
      <p><strong>From:</strong> ${userName}</p>
      <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <p><strong>Note:</strong></p>
      <blockquote style="border-left: 3px solid #3b82f6; padding-left: 15px; margin: 10px 0;">
        ${content.replace(/\n/g, '<br>')}
      </blockquote>
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
```

### 3. Install SendGrid Package

```bash
npm install @sendgrid/mail
```

### 4. Add Environment Variable

Create `.env.local`:
```
SENDGRID_API_KEY=SG.your_api_key_here
```

## Option 3: Using AWS SES

### 1. Set up AWS SES
- Go to AWS Console → SES
- Verify your domain or email address
- Get your AWS credentials

### 2. Create API Endpoint

```typescript
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, monthName, userName, content, timestamp } = req.body;

  const params = {
    Source: 'noreply@yourdomain.com',
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Subject: {
        Data: `New Note Added: ${monthName}`
      },
      Body: {
        Html: {
          Data: `
            <h2>New Note Added to ${monthName}</h2>
            <p><strong>From:</strong> ${userName}</p>
            <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
            <p><strong>Note:</strong></p>
            <blockquote style="border-left: 3px solid #3b82f6; padding-left: 15px; margin: 10px 0;">
              ${content.replace(/\n/g, '<br>')}
            </blockquote>
          `
        }
      }
    }
  };

  try {
    await ses.sendEmail(params).promise();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
```

### 3. Install AWS SDK

```bash
npm install aws-sdk
```

### 4. Add Environment Variables

Create `.env.local`:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

## Testing Email in Development

### Using a Test Email Service (Recommended)

Use [Mailtrap](https://mailtrap.io) for testing:

1. Sign up for free at https://mailtrap.io
2. Get your test inbox SMTP credentials
3. Use them in development to see emails without sending real ones

### Using Console Logging (Current Method)

The app currently logs email details to the console:
```javascript
console.log('📧 Email notification would be sent:', params);
```

This allows you to verify the email content without actually sending emails.

## Deployment Considerations

### Environment Variables
Always use environment variables for API keys. Never commit them to git.

Add to `.gitignore`:
```
.env.local
.env
```

### Vercel Deployment
If deploying to Vercel:
1. Go to Project Settings → Environment Variables
2. Add your email service API key
3. Redeploy

### Other Platforms
- **Netlify**: Add environment variables in Site Settings → Build & Deploy
- **Railway**: Add in Variables tab
- **Render**: Add in Environment section

## Email Template Customization

You can customize the email HTML in the API endpoint. Consider:
- Adding your logo
- Matching brand colors
- Including a link back to the app
- Adding a footer with company info

Example enhanced template:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; }
    .content { background: white; padding: 30px; }
    .note { background: #f3f4f6; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📝 New Note Added</h1>
    </div>
    <div class="content">
      <h2>${monthName}</h2>
      <p><strong>From:</strong> ${userName}</p>
      <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
      <div class="note">
        ${content.replace(/\n/g, '<br>')}
      </div>
      <p><a href="https://yourdomain.com" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View in App</a></p>
    </div>
    <div class="footer">
      <p>Physique 57 India • 2026 Sales Plan</p>
      <p>This is an automated notification</p>
    </div>
  </div>
</body>
</html>
```

## Troubleshooting

### Emails not sending
1. Check API key is correct
2. Verify environment variables are set
3. Check sender email is verified (SendGrid, SES)
4. Look at server logs for errors

### Emails going to spam
1. Set up SPF, DKIM, DMARC records
2. Use a verified domain
3. Avoid spam trigger words
4. Include unsubscribe link if needed

### Rate limiting
Most free tiers have limits:
- Resend: 100/day
- SendGrid: 100/day
- Consider upgrading if needed

## Security Best Practices

1. **Validate Input**: Always validate email addresses and content
2. **Rate Limiting**: Prevent spam by limiting notes per user/hour
3. **Authentication**: Ensure only authenticated users can add notes
4. **Sanitize HTML**: Prevent XSS by escaping user content
5. **HTTPS Only**: Always use HTTPS in production

## Cost Estimates

### Free Tiers
- **Resend**: 3,000 emails/month free, then $0.001/email
- **SendGrid**: 100 emails/day free, then from $19.95/month
- **AWS SES**: $0.10 per 1,000 emails (no free tier after 12 months)

### Expected Usage
If 10 users add 5 notes/day = 50 emails/day = 1,500/month
All within free tiers ✅

## Support

For questions or issues:
1. Check service documentation
2. Review error logs
3. Test with a simple email first
4. Contact service support if needed

## Quick Start (Resend - Recommended)

```bash
# 1. Install package
npm install resend

# 2. Create API file at /api/send-note-email.ts
# (Copy code from Option 1 above)

# 3. Add to .env.local
RESEND_API_KEY=your_key_here

# 4. Update lib/email.ts to use the real API:
export async function sendNoteEmail(params) {
  const response = await fetch('/api/send-note-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
}

# 5. Test!
```

Done! 🎉
