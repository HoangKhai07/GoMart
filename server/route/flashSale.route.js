import { Router } from 'express';
import {
    addProductToFlashSaleController,
    createFlashSaleController,
    deleteFlashSaleController,
    getActiveFlashSalesController,
    getFlashSaleDetailsController,
    getFlashSalesForAdminController,
    removeProductFromFlashSaleController,
    updateFlashSaleController
} from '../controllers/flashSale.controller.js';
import admin from '../middleware/admin.js';
import auth from '../middleware/auth.js';

const flashSaleRouter = Router();

// Admin routes
flashSaleRouter.post('/create', auth, admin, createFlashSaleController);
flashSaleRouter.get('/admin', auth, admin, getFlashSalesForAdminController);
flashSaleRouter.get('/details/:id', getFlashSaleDetailsController);
flashSaleRouter.put('/update/:id', auth, admin, updateFlashSaleController);
flashSaleRouter.delete('/delete/:id', auth, admin, deleteFlashSaleController);
flashSaleRouter.post('/add-product/:id', auth, admin, addProductToFlashSaleController);
flashSaleRouter.delete('/remove-product/:id/:productId', auth, admin, removeProductFromFlashSaleController);

// Public routes
flashSaleRouter.get('/active', getActiveFlashSalesController);

export default flashSaleRouter;


