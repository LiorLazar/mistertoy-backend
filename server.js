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
//* Get Toys
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

//* Get Toy By Id
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params

    toyService.getById(toyId)
        .then(toy => res.send(toy))
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

//* Update Toy
app.put('/api/toy/:toyId', (req, res) => {
    const toy = {
        _id: req.params.toyId,
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels,
        inStock: req.body.inStock
    }

    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy.')
        })
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)