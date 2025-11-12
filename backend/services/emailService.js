import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

const brevo = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization
const apiKey = brevo.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; 

const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

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


export const sendResetEmail = async (email, resetToken) => {
  try {
    const url =
      process.env.NODE_ENV === "production"
        ? "https://ballin-wear.onrender.com"
        : "http://localhost:5173";
    const resetLink = `${url}/reset-password/${resetToken}`;

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 550px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; text-transform: uppercase;">
            Ballin Wear
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="text-align: center; color: #111; font-size: 20px; margin-bottom: 15px;">
            Password Reset Request
          </h2>

          <p style="font-size: 15px; color: #333; line-height: 1.7; text-align: left;">
            Hello,<br><br>
            You requested to reset your Ballin Wear account password.  
            Please click the button below to reset your password.
          </p>

          <!-- Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a 
              href="${resetLink}"
              target="_blank"
              style="background-color: #000; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; letter-spacing: 0.5px; display: inline-block;">
              Reset My Password
            </a>
          </div>

          <!-- Alternative link -->
          <p style="font-size: 14px; color: #555; text-align: center; margin-bottom: 8px;">
            Or copy and paste this link into your browser:
          </p>
          <a href=${resetLink} style="word-break: break-all; font-size: 13px; color: #000; text-align: center; margin: 0 0 20px;">
            ${resetLink}
          </a>

          <!-- Expiry message -->
          <div style="text-align: center; font-size: 13px; color: #777;">
            This link will expire in <strong>10 minutes</strong>.<br>
            If you didn’t request this, please ignore this email.
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f8f8; border-top: 1px solid #e5e5e5; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Ballin Wear — All rights reserved.
          </p>
        </div>
      </div>
    `;

    await transactionalEmailApi.sendTransacEmail({
      sender: { name: 'Ballin', email: process.env.EMAIL_USER },
      to: [{ email }],
      subject: "Ballin Wear Password Reset",
      htmlContent,
    });

    return true;
  } catch (err) {
    console.error("Error sending reset email:", err.message);
    throw new Error("Failed to send password reset email.");
  }
};

