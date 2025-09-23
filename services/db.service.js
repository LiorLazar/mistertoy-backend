import { MongoClient } from 'mongodb'

import { config } from '../config.js'
import { loggerService } from "./logger.service"

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
        const client = await MongoClient.connect(config.dbUrl)
        const db = client.db(config.dbName)
        dbConn = db
        return db
    } catch (err) {
        loggerService.error('Cannot Connenct to DB', err)
        throw err
    }
}