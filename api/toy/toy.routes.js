import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { addToy, addToyMsg, getToyById, getToys, removeToy, removeToyMsg, updateToy } from './toy.controller.js'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', requireAuth, requireAdmin, addToy)
toyRoutes.put('/:id', requireAuth, requireAdmin, updateToy)
toyRoutes.delete('/:id', requireAuth, requireAdmin, removeToy)

toyRoutes.post('/:toyId/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:toyId/msg/:msgId', requireAuth, removeToyMsg)