# Birthday Reminder App

Automated birthday email system that sends wishes to customers at 7 AM daily.

[![License: MIT](https://img.shields.io/github/license/Mikatech-Dev/guessing-game-js?style=for-the-badge&color=white)](https://opensource.org/licenses/MIT)
![Issues](https://img.shields.io/github/issues/Mikatech-Dev/guessing-game-js?style=for-the-badge&color=purple)
![Forks](https://img.shields.io/github/forks/MikaTech-dev/number-guessing-game-js?style=for-the-badge&color=purple)
![Stars](https://img.shields.io/github/stars/Mikatech-Dev/guessing-game-js?style=for-the-badge&color=white)

## Features
- Simple UI to add birthday reminders (name, email, date)
- Daily 7 AM cron job checks for birthdays
- Sends personalized birthday emails via Gmail (service is specifically set to gmail)
- Tracks who has been emailed with `isEmailed` flag
- Only sends to users who haven't received email yet
- TODO: Use mailtrap instead of gmail

## Setup
- First Fork or Clone the repo, then:

1. Create `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/birthday-reminder
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB server

4. Run app:
```bash
npm start
```

## Usage
1. Visit `http://localhost:3000`
2. Add birthday entries (name, email, date)
3. App automatically sends birthday emails at 7 AM daily
4. Only users with `isEmailed=false` receive emails

> Note: Requires Gmail App Password for email sending.  

> Birthday list shows only unemailed users by default.
