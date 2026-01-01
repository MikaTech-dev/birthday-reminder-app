const express = require ("express")
const { config } = require("dotenv")
const morgan = require("morgan")
const cron = require ("node-cron")
const moment = require ("moment")
const connect_DB = require("./src/configs/db")
const path = require('path')
const User = require('./src/models/User')
const emailService = require('./src/services/email.service')
const birthdayTracker = require("./src/services/birthday.tracker")

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

// Schedule to send birthday email
cron.schedule("0 7 * * *", birthdayTracker, {
    scheduled: true,
    timezone: "Africa/Lagos"
})

// Uncomment to send email immediately (Only used during testing)
// birthdayTracker()

// Connect db, log server startup
app.listen(PORT, ()=> {
    const logProgress = async () => {
        await connect_DB()  // connect db first before logging server running
        console.log(`Server running on http://localhost:${PORT}`)
        birthdayTracker(User)  //check on server startup
    }
    return logProgress()
})

// Export the function for quick testing (do not change server behavior)