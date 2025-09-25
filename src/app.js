const express = require ("express")
const { config } = require("dotenv")
const morgan = require("morgan")
config()
const app = express()

PORT = process.env.PORT || 3000

app.use (morgan("tiny"))

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})

