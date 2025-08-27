// import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { loggerService } from './services/logger.service.js'
import { toyService } from './services/toy.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173'
    ],
    credentials: true
}

// Express Config
app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')

//* REST API for Toys
app.get('/api/toy', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        isStock: req.query.isStock || '',
        labels: req.query.labels || [],
    }

    const sortBy = {
        sortBy: req.query.sortBy || toyService.getDefaultSort()
    }

    toyService.query(filterBy, sortBy)
        .then(toys => res.send(toys))
        .catch(err => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)