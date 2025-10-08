import express from 'express'
import {
  requireAdmin,
  requireAuth,
  
} from '../../middlewares/requireAuth.middleware.js'
import {
  addToy,
  addToyMsg,
  getToyById,
  getToys,
  removeToy,
  removeToyMsg,
  updateToy,
} from './toy.controller.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', getToys)
toyRoutes.get('/:toyId', getToyById)
toyRoutes.post('/', requireAdmin, addToy)
toyRoutes.put('/:toyId', requireAdmin, updateToy)
toyRoutes.delete('/:toyId', requireAdmin, removeToy)

toyRoutes.post('/:toyId/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:toyId/msg/:msgId', requireAuth, removeToyMsg)
