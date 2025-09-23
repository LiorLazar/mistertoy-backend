import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

const PAGE_SIZE = 5

export const toyService = {
    query,
    getById,
    remove,
    add,
    update,
    addMsg,
    removeMsg,
}

async function query(filterBy = {}) {
    try {
        const { filterCriteria, sortCriteria, skip } = _buildCriteria(filterBy)
        console.log(filterCriteria)
        console.log(sortCriteria)

        const collection = await dbService.getCollection('toy')
        const prmTotalCount = collection.countDocuments(filterCriteria)

        const prmFilteredToys = collection
            .find(filterCriteria, { sort: sortCriteria, skip, limit: PAGE_SIZE }).toArray()

        const [totalCount, filteredToys] = await Promise.all([prmTotalCount, prmFilteredToys])
        const maxPage = Math.ceil(totalCount / PAGE_SIZE)
        return { toys: filteredToys, maxPage }
    } catch (error) {
        loggerService.error('cannot find toys', error)
        throw error
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
        return toy
    } catch (error) {
        loggerService.error(`While finding toy ${toyId}`, error)
        throw error
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })
    } catch (error) {
        loggerService.error(`Cannot Remove toy ${toyId}`, error)
        throw error
    }
}

async function add(toy) {
    try {
        toy.createdAt = Date.now()
        toy.inStock = true
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (error) {
        loggerService.error('cannot insert toy', error)
        throw error
    }
}

async function update(toy) {
    try {
        const { name, price, labels } = toy
        const toyToUpdate = {
            name,
            price,
            labels,
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne(
            { _id: ObjectId.createFromHexString(toy._id) },
            { $set: toyToUpdate }
        )
        return toy
    } catch (error) {
        loggerService.error(`cannot update toy ${toy._id}`, error)
        throw error
    }
}

async function addMsg(toyId, msg) {
    msg.id = utilService.makeId()

    try {
        const collection = await dbService.getCollection('toy')

        await collection.updateOne(
            { _id: ObjectId.createFromHexString(toyId) },
            { $push: { msgs: msg } }
        )
        return msg
    } catch (error) {
        loggerService.error(`Cannot add message to toy ${toyId}`, error)
        throw error
    }
}

async function removeMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne(
            { _id: ObjectId.createFromHexString(toyId) },
            { $pull: { msgs: { id: msgId } } }
        )
        return msgId
    } catch (error) {
        loggerService.error(`Cannot remove message from toy ${toyId}`, error)
        throw error
    }
}

function _buildCriteria(filterBy) {
    const filterCriteria = {}

    if (filterBy.txt) {
        filterCriteria.name = { $regex: filterBy.txt, $options: 'i' }
    }
    if (filterBy.inStock) {
        filterCriteria.inStock = JSON.parse(filterBy.inStock)
    }
    if (filterBy.labels && filterBy.labels.length) {
        filterCriteria.labels = { $all: filterBy.labels }
    }

    const sortCriteria = {}

    const sortBy = filterBy.sortBy
    if (sortBy.type) {
        const sortDirection = +sortBy.sortDir
        sortCriteria[sortBy.type] = sortDirection
    } else sortCriteria.createdAt = -1

    const skip = filterBy.pageIdx !== undefined ? filterBy.pageIdx * PAGE_SIZE : 0
    return { filterCriteria, sortCriteria, skip }
}