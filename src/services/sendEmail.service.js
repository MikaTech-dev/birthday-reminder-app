const emailService = require('./email.service');
const User = require('../models/User');

module.exports = async function sendEmail(birthdayUsers) {
  if (!Array.isArray(birthdayUsers) || birthdayUsers.length === 0) {
    return [];
  }

  const results = await Promise.all(
    birthdayUsers.map(async (user) => {
      const sent = await emailService.sendBirthdayEmail(user);
      if (sent) {
        try {
          await User.updateOne({ _id: user._id }, { $set: { isEmailed: true } }); // mark user as emailed
        } catch (err) {
          console.error(`Failed to update isEmailed for ${user.email}:`, err);
        }
      }
      return sent;
    })
  );

  return results;
}