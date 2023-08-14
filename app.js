import express, { json } from 'express' // require -> commonJS
import { corsMiddleware } from './middleware/cors.js'

import { moviesRouter } from './routes/movies'

const app = express()
app.use(json())
app.use(corsMiddleware())

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
