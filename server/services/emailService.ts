// Lightweight email "service" stub.
// No SMTP/email provider is configured in this project yet, so instead of
// silently failing or pretending to send real email, we log the intended
// email content to the server console. Wire up a real provider (e.g. Resend,
// SendGrid, or SMTP credentials via environment-secrets) and replace the
// implementation below when ready to send real emails.

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailPayload): Promise<void> {
  console.log(`[email-service] (stub) Would send email to ${to}`);
  console.log(`[email-service] Subject: ${subject}`);
  console.log(`[email-service] Body: ${body}`);
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Verify your JustCarSale account",
    body: `Your email verification token is: ${token}\n\nUse POST /api/auth/verify-email with this token to verify your account.`,
  });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Reset your JustCarSale password",
    body: `Your password reset token is: ${token}\n\nUse POST /api/auth/reset-password with this token and a new password.`,
  });
}
