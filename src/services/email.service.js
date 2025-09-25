const nodemailer = require('nodemailer');
const emailConfig = require('../configs/email.config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig);
    this.verifyTransporter();
  }
  // Verify the smtp config works
  verifyTransporter() {
    this.transporter.verify((error, success) => {
      if (error) {
        console.log('Email verification error:', error);
      } else {
        console.log('Email server is ready to send messages');
      }
    });
  }

  async sendBirthdayEmail(user) {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: user.email,
      subject: `SMTP 🎉 Happy Birthday, ${user.username}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; background: linear-gradient(135deg, #ff6b6b 0%, #ffa502 100%); padding: 30px; border-radius: 10px; color: white;">
            <h1 style="font-size: 2.5em; margin-bottom: 10px;">🎉 Happy Birthday!</h1>
            <h2 style="font-size: 1.8em; margin-bottom: 20px;">Dear ${user.username},</h2>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <p style="font-size: 1.2em; line-height: 1.6; color: #333;">
              Wishing you a day filled with happiness and a year filled with joy! 
              May all your dreams and wishes come true on this special day and onwards.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 4em; margin: 20px 0;">🎂🎁🎈</div>
            </div>
            
            <p style="font-size: 1.1em; line-height: 1.6; color: #555;">
              From Mikatech~ I hope you have a fantastic day!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.9em;">
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Birthday email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error(`Failed to send email to ${user.email}:`, error);
      return false;
    }
  }
}

module.exports = new EmailService();