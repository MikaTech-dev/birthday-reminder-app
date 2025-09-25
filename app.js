const express = require ("express")
const { config } = require("dotenv")
const morgan = require("morgan")
const cron = require ("node-cron")
const moment = require ("moment")
const connect_DB = require("./src/configs/db")
const path = require('path')
const User = require('./src/models/User')
const emailService = require('./src/services/email.service')

config()
const app = express()


PORT = process.env.PORT || 3000
// Get user ip
morgan.token('remote-addr', function (req, res) {
  return req.ip;
});

app.use (morgan(":remote-addr - :method :url :response-time ms"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")
app.set('views', 'views')


// Routes
app.use('/', require('./src/routes/users'));

// Function to send birthday emails
const sendBirthdayEmails = async () => {
  try {
    // Get today's date (month and day only)
    const today = moment().format('MM-DD');
    const [monthStr, dayStr] = today.split('-');
    const month = parseInt(monthStr, 10); // moment gives 01-12 (no +1 needed)
    const day = parseInt(dayStr, 10);

    // Debug log to help troubleshooting with troubleshooting
    // Create and log new date to help with debugging/troubleshooting
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const currentTime = `${hours}:${formattedMinutes}`;
    console.log(`${currentTime} Birthday job running for month=${month}, day=${day}`);

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
    if (birthdayUsers.length === 1) {
        console.log (`${currentTime} Found ${birthdayUsers.length} birthday today`)
    } else if (birthdayUsers.length > 1){
        console.log(`${currentTime} Found ${birthdayUsers.length} birthday(s) today`);
    }
    
    // Send email to each birthday user using the email service
    const results = await Promise.all(
      birthdayUsers.map(async (user) => {
        const sent = await emailService.sendBirthdayEmail(user);
        if (sent) {
          // mark user as emailed
          try {
            await User.updateOne({ _id: user._id }, { $set: { isEmailed: true } });
          } catch (e) {
            console.error(`Failed to update isEmailed for ${user.email}:`, e);
          }
        }
        return sent;
      })
    );

    const successfulSends = results.filter(result => result).length;
    console.log(`Successfully sent ${successfulSends} out of ${birthdayUsers.length} birthday emails`);
    
  } catch (error) {
    console.error('Error in birthday email job:', error);
  }
};

// Schedule to send birthday email
cron.schedule("0 7 * * *", sendBirthdayEmails, {
    scheduled: true,
    timezone: "Africa/Lagos"
})

// Uncomment to send email immediately (Only used during testing)
// sendBirthdayEmails()

// Connect db, log server startup
app.listen(PORT, ()=> {
    const logProgress = async () => {
        await connect_DB()  // connect db first before logging server running
        console.log(`Server running on http://localhost:${PORT}`)
        sendBirthdayEmails()  //check on server startup
    }
    return logProgress()
})

// Export the function for quick testing (do not change server behavior)
module.exports = { sendBirthdayEmails };