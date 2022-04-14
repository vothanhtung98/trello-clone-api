import express from 'express'
import cors from 'cors'
// import { corsOptions } from './config/cors' // Comment this line when run on localhost
import { env } from './config/environment' // Comment this line when running on app or deploy to Heroku
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

    // app.use(cors(corsOptions)) // Comment this line when run on localhost.
    app.use(cors()) // Comment this line when run on app and deploy to Heroku.

    // Enable req.body data
    app.use(express.json())

    // Use APIs v1
    app.use('/v1', apiV1)

    // Support Heroku deploy
    // app.listen(process.env.PORT, () => {
    //     console.log(`Hello, i'm running at port: ${process.env.PORT}`)
    // })

    // Listen on localhost
    app.listen(env.APP_PORT, env.APP_HOST, () => {
        console.log(`Hello, i'm running at ${env.APP_HOST}:${env.APP_PORT}`)
    })
}