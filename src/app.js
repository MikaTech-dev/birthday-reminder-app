const express = require ("express")
const { config } = require("dotenv")
const morgan = require("morgan")
const nodemailer = require ("nodemailer")
const cron = require ("node-cron")
const moment = require ("moment")
const connect_DB = require("./configs/db")
const path = require('path')                      // { changed code }
const User = require('./models/User')             // { changed code }
const emailService = require('./services/email.service') // { changed code }

config()
const app = express()


PORT = process.env.PORT || 3000

app.use (morgan("tiny"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'))   // { changed code }


// Routes
app.use('/', require('./routes/users'));

// Function to send birthday emails
const sendBirthdayEmails = async () => {
  try {
    // Get today's date (month and day only)
    const today = moment().format('MM-DD');
    
    // Find users whose birthday is today
    const birthdayUsers = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $month: '$dateOfBirth' }, parseInt(today.split('-')[0]) + 1] },
          { $eq: [{ $dayOfMonth: '$dateOfBirth' }, parseInt(today.split('-')[1])] }
        ]
      }
    });
    
    if (birthdayUsers.length === 0) {
      console.log('No birthdays today');
      return;
    }
    if (birthdayUsers.length === 1) {
        console.log (`Found ${birthdayUsers.length} birthday today`)
    }
    console.log(`Found ${birthdayUsers.length} birthday(s) today`);
    
    // Send email to each birthday user using the email service
    const results = await Promise.all(
      birthdayUsers.map(user => emailService.sendBirthdayEmail(user))
    );
    
    const successfulSends = results.filter(result => result).length;
    console.log(`Successfully sent ${successfulSends} out of ${birthdayUsers.length} birthday emails`);
    
  } catch (error) {
    console.error('Error in birthday email job:', error);
  }
};

// Schedule to send birthday email
cron.schedule("* * * * *", sendBirthdayEmails, {
    scheduled: true,
    timezone: "Africa/Lagos"
})

// Uncomment to send email immediately (Only used during testing)
// sendBirthdayEmails()

// Start server and connect db
app.listen(PORT, ()=> {
    const logProgress = async () => {
        await connect_DB()  // connect db first before logging server running
        console.log(`Server running on http://localhost:${PORT}`)
    }
    return logProgress()
})