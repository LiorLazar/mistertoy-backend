import fs from 'fs'
import { utilService } from './util.service.js'

export const toyService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getDefaultSort
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = {}, sortBy = {}) {
    let toysToReturn = toys

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        toysToReturn = toys.filter(toy => regex.test(toy.name))
    }

    if (typeof filterBy.isStock === 'boolean') {
        toysToReturn = toys.filter(toy => toy.isStock === filterBy.isStock)
    }

    if (filterBy.labels?.length) {
        toysToReturn = toysToReturn.filter(toy =>
            filterBy.labels.every(label => toy.labels.includes(label))
        )
    }

    if (sortBy.type) {
        const dir = sortBy.desc
        toysToReturn.sort((a, b) => {
            if (sortBy.type === 'name') return a.name.localeCompare(b.name) * dir
            else if (sortBy.type === 'price' || sortBy.type === 'createdAt') return (a[sortBy.type] - b[sortBy.type]) * dir
        })
    }
    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)

        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.labels = toy.labels
        toyToUpdate.inStock = toy.inStock
        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        toys.push(toy)
    }
    return _saveToysToFile().then(() => toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')

    const toy = toys[idx]
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function getDefaultFilter() {
    return {
        txt: '',
        isStock: '',
        labels: [],
        pageIdx: 0
    }
}

function getDefaultSort() {
    return { type: '', desc: 1 }
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}