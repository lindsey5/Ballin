import nodemailer from 'nodemailer'

export const sendVerificationCode = async (email) => {
    try{
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      await transporter.sendMail({
          from: "ballin",
          to: `${email}`,
          subject: "Ballin Verification Code",
          text: `Your Verification Code is ${verificationCode}`,
      });

      return verificationCode;
    }catch(err){
      console.log(err)
      return null
    }
}

export const sendOrderUpdate = async (email, order_id, firstname, status) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update - KD Motoshop</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
        <div style="max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Content -->
          <div style="padding: 32px 24px;">
            <h2 style="color: #111827; margin: 0 0 24px 0; font-size: 20px; font-weight: 500;">Hi ${firstname || 'Customer'},</h2>
            
            <p style="color: #374151; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5;">
              Your order has been updated with the following status:
            </p>

            <!-- Order Info -->
            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 24px 0;">
              <div style="margin-bottom: 12px;">
                <span style="color: #6b7280; font-size: 14px; font-weight: 500;">Order ID:</span>
                <span style="color: #111827; font-size: 16px; font-weight: 600; margin-left: 8px;">${order_id}</span>
              </div>
              <div>
                <span style="color: #6b7280; font-size: 14px; font-weight: 500;">Status:</span>
                <span style="color: #2563eb; font-size: 16px; font-weight: 600; margin-left: 8px; text-transform: capitalize;">${status}</span>
              </div>
            </div>

            <p style="color: #374151; margin: 24px 0; font-size: 16px; line-height: 1.5;">
              If you have any questions, feel free to contact our support team.
            </p>

            <p style="color: #374151; margin: 0; font-size: 16px;">
              Thank you for choosing Ballin!
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Ballin life-n-style. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `Ballin <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Order Update - Ballin life-n-style',
      html: htmlContent,
    });
    return true;
  } catch (err) {
    console.error('Error sending email:', err.message);
    throw new Error('Failed to send order update email.');
  }
};