import { Router } from 'express'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { getStatisticsController } from '../controllers/statistic.controller.js'

const statisticRouter = Router()

statisticRouter.get('/admin/statistics', auth, admin, getStatisticsController)

export default statisticRouter