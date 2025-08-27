import { utilService } from './util.service.js'

export const toyService = {
    query,
    getById,
    // save,
    // remove,
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