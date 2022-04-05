import express from 'express'
import { connectDB } from '*/config/mongodb'
import { env } from '*/config/environment'

const app = express()

connectDB().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.end('<h1>Hello</h1><hr/>')
})

app.listen(env.PORT, env.HOST, () => {
    console.log(`Hello, i'm running at ${env.HOST}:${env.PORT}`)
})