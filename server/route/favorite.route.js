import { Router } from 'express'
import auth from '../middleware/auth.js'
import { addToFavorite, getFavorite, removeFavorite } from '../controllers/favorite.controller.js'

const favoriteRouter = Router()

favoriteRouter.post('/add', auth, addToFavorite)
favoriteRouter.get('/get', auth, getFavorite)
favoriteRouter.delete('/remove', auth, removeFavorite)

export default favoriteRouter