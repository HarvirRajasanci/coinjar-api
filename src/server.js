import express from 'express'
import dotenv from 'dotenv'
import rateLimiter from './middleware/rateLimiter.js';
import { initDB } from './config/db.js';

import transactionsRoute from './routes/transactionsRoutes.js'
import job from './config/cron.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001;

if(process.env.NODE_ENV === "production") job.start();

// middleware
app.use(rateLimiter);
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok"});
})

app.use("/api/transactions", transactionsRoute)

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is up and running on PORT:${PORT}`)
    })
})