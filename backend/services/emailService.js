import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

const brevo = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization
const apiKey = brevo.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // put your Brevo API key in .env

const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// =========================
// Send Verification Code
// =========================
export const sendVerificationCode = async (email) => {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'Ballin', email: process.env.EMAIL_USER }; 
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = 'Ballin Verification Code';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 6px;">
        <h2 style="color: #222;">Ballin Verification Code</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 3px; color: #2563eb;">${verificationCode}</h1>
        <p>This code will expire shortly. Please do not share it with anyone.</p>
      </div>
    `;

    await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Verification email sent successfully to', email);
    return verificationCode;
  } catch (err) {
    console.error('❌ Error sending verification email:', err.message);
    return null;
  }
};

// =========================
// Send Order Update
// =========================
export const sendOrderUpdate = async (email, order_id, firstname, status) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Update - Ballin</title>
      </head>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
        <div style="max-width:500px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          <div style="padding:32px 24px;">
            <h2 style="color:#111827;margin:0 0 24px;">Hi ${firstname || 'Customer'},</h2>
            <p style="color:#374151;">Your order has been updated with the following status:</p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:20px;margin:24px 0;">
              <p><strong>Order ID:</strong> ${order_id}</p>
              <p><strong>Status:</strong> <span style="color:#2563eb;text-transform:capitalize;">${status}</span></p>
            </div>
            <p style="color:#374151;">If you have any questions, feel free to contact our support team.</p>
            <p style="color:#374151;">Thank you for choosing Ballin!</p>
          </div>
          <div style="background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#6b7280;font-size:12px;margin:0;">© ${new Date().getFullYear()} Ballin life-n-style. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'Ballin', email: process.env.EMAIL_USER };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = 'Order Update - Ballin life-n-style';
    sendSmtpEmail.htmlContent = htmlContent;

    await transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Order update email sent to', email);
    return true;
  } catch (err) {
    console.error('❌ Error sending order update email:', err.message);
    throw new Error('Failed to send order update email.');
  }
};
