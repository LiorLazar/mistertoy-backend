import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', requireAuth, addToy)
toyRoutes.put('/:id', requireAuth, updateToy)
toyRoutes.delete(':/id', requireAuth, removeToy)

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

//* Add Toy
app.post('/api/toy', (req, res) => {
    const toy = {
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels,
    }

    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy.')
        })
})

//* Update Toy
app.put('/api/toy/:toyId', (req, res) => {
    const toy = {
        _id: req.params.toyId,
        name: req.body.name,
        price: +req.body.price,
        labels: req.body.labels,
        inStock: req.body.inStock,
    }

    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
        .catch(err => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy.')
        })
})

//* Delete Toy
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId)
        .then(() => res.send('Removed'))
        .catch(err => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy.')
        })
})