import { MongoClient } from 'mongodb'

import { loggerService } from "./logger.service.js"
import { config } from '../config/index.js'

var dbConn = null

export const dbService = {
    getCollection,
}

async function getCollection(collectionName) {
    try {
        const db = await _connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        loggerService.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function _connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL)
        const db = client.db(config.dbName)
        dbConn = db
        return db
    } catch (err) {
        loggerService.error('Cannot Connenct to DB', err)
        throw err
    }
}