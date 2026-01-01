const User = require("../models/User");
const sendEmail = require("./sendEmail.service");
const trackBirthdays = async () => {
  try {
    const now = new Date()
     
    const month = now.getMonth() + 1 //  getMonth is indexed from 0, this updates it to the typical "1 = january" 
    const day = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const currentTime = `${hours}:${formattedMinutes}`;
    console.log(`${currentTime} Birthday job running for month= ${month}, day= ${day}`);

    // Find users whose birthday is today (compare month and day)
    const birthdayUsers = await User.find({
      isEmailed: false,
      $expr: {
        $and: [
          { $eq: [{ $month: '$dateOfBirth' }, month] },
          { $eq: [{ $dayOfMonth: '$dateOfBirth' }, day] }
        ]
      }
    });
    
    if (birthdayUsers.length === 0) {
      console.log(`${currentTime} No birthdays today`);
      return;
    }
    else if (birthdayUsers.length >= 1 && currentTime !== "7:00") { // if it's not 7 AM or PM, don't send an email.
      console.log(`${currentTime} Found 1 birthday today`);
      return
    }
    else if (birthdayUsers.length === 1) {
      console.log(`${currentTime} Found 1 birthday today`);
    } else {
      console.log(`${currentTime} Found ${birthdayUsers.length} birthday(s) today`);
    }
    
    // Send email to each birthday user using the email service
    const results = await sendEmail(birthdayUsers);

    const successfulSends = Array.isArray(results) ? results.filter(result => result).length : 0;
    console.log(`${currentTime} Successfully sent ${successfulSends} out of ${birthdayUsers.length} birthday email(s)`);
    
  } catch (error) {
    console.error('Error in birthday email job:', error);
  }
};

module.exports = trackBirthdays