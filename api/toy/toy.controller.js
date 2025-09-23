import { loggerService } from "../../services/logger.service.js"
import { toyService } from "./toy.service.js"


export async function getToys(req, res) {
    try {
        const { txt, inStock, labels, pageIdx, sortBy } = req.query
        const filterBy = {
            txt: txt || '',
            isStock: inStock || null,
            labels: labels || [],
            pageIdx: +pageIdx || 0,
            sortBy: sortBy || { type: '', sortDir: 1 }
        }
        const toys = await toyService.query(filterBy)
        res.send(toys)
    } catch (error) {
        loggerService.error('Cannot load toys', error)
        res.status(500).send('Cannot load toys')
    }
}

export async function getToyById(req, res) {
    try {
        const { toyId } = req.params
        const toy = await toyService.getById(toyId)
        res.send(toy)
    } catch (error) {
        loggerService.error('Cannot get toy', error)
        res.status(500).send('cannot get toy')
    }
}

export async function addToy(req, res) {
    const { name, price, labels = [], inStock = true, msgs = [] } = req.body
    if (!name || !price) res.status(400).send('Missing data')

    const toy = { name, price, labels, inStock, msgs }

    try {
        const addedToy = await toyService.add(toy)
        res.send(addedToy)
    } catch (error) {
        loggerService.error('Cannot save toy', error)
        res.status(500).send('Cannot save toy.')
    }
}

export async function updateToy(req, res) {
    const { _id, name, price, labels = [], inStock = true, msgs = [] } = req.body
    if (!name || !price || !_id) res.status(400).send('Missing Data')

    const toy = { _id, name, price, labels, inStock, msgs }

    try {
        const updatedToy = await toyService.update(toy)
        res.send(toy)
    } catch (error) {
        loggerService.error('Cannot save toy', error)
        res.status(500).send('Cannot save toy.')
    }
}

export async function removeToy(req, res) {
    try {
        const { toyId } = req.params
        await toyService.remove(toyId)
        res.send()
    } catch (error) {
        loggerService.error('Cannot delete toy', error)
        res.status(500).send('Cannot delete toy, ' + error)
    }
}
export async function addToyMsg(req, res) {
    const { loggedInUser } = req

    try {
        const { toyId } = req.params
        const { txt } = req.body
        const { _id, fullName } = loggedInUser
        const msg = {
            txt,
            by: { _id, fullName },
        }
        const addedMsg = await toyService.addMsg(toyId, msg)
        res.send(addedMsg)
    } catch (error) {
        loggerService.error('cannot add message to toy', error)
        res.status(500).send('Cannot add message to toy')
    }
}

export async function removeToyMsg(req, res) {
    try {
        const { toyId, msgId } = req.params
        await toyService.removeMsg(toyId, msgId)
        res.send(msgId)
    } catch (error) {
        loggerService.error('Cannot delete message from toy', err)
        res.status(500).send('Cannot delete message from toy')
    }
}