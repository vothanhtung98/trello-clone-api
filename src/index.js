import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { env } from './config/environment'
import { connectDB } from '*/config/mongodb'
import { apiV1 } from '*/routes/v1'

connectDB()
    .then(() => { console.log('Connected successfully to database server!') })
    .then(() => bootServer())
    .catch(err => {
        console.log(err)
        process.exit(1)
    })

const bootServer = () => {
    const app = express()

    app.use(cors(corsOptions))

    // Enable req.body data
    app.use(express.json())

    // Use APIs v1
    app.use('/v1', apiV1)

    app.listen(process.env.PORT || env.APP_PORT, () => {
        const port = process.env.PORT || env.APP_PORT
        console.log(`Hello, i'm running at port: ${port}`)
    })
}