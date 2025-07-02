import FlashSaleModel from "../model/flashSale.model.js";
import ProductModel from "../model/product.model.js";

// Tạo flash sale mới
export const createFlashSaleController = async (req, res) => {
    try {
        const { name, description, startDate, endDate, products, showOnHomepage, displayOrder } = req.body;
        
        if(!name || !startDate || !endDate || !products || products.length === 0) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin của Flash Sale!",
                error: true,
                success: false
            });
        }
        
        if(new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                message: "Thời gian bắt đầu phải trước thời gian kết thúc!",
                error: true,
                success: false
            });
        }
        
        for(const item of products) {
            const product = await ProductModel.findById(item.product);
            if(!product) {
                return res.status(400).json({
                    message: `Sản phẩm với ID ${item.product} không tồn tại!`,
                    error: true,
                    success: false
                });
            }
            

            if(item.flashSalePrice >= product.price) {
                return res.status(400).json({
                    message: `Giá flash sale của sản phẩm ${product.name} phải nhỏ hơn giá gốc!`,
                    error: true,
                    success: false
                });
            }
            
     
            if(item.flashSaleStock > product.stock) {
                return res.status(400).json({
                    message: `Số lượng flash sale của sản phẩm ${product.name} không thể lớn hơn tồn kho!`,
                    error: true,
                    success: false
                });
            }
        }
        
        const flashSale = new FlashSaleModel({
            name,
            description,
            startDate,
            endDate,
            products,
            showOnHomepage: showOnHomepage || true,
            displayOrder: displayOrder || 0,
            isActive: true
        });
        
        const savedFlashSale = await flashSale.save();
        
        return res.json({
            message: "Tạo Flash Sale thành công!",
            data: savedFlashSale,
            success: true,
            error: false
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getFlashSalesForAdminController = async (req, res) => {
    try {
        let { page, limit } = req.query;
        
        if(!page) {
            page = 1;
        }
        
        if(!limit) {
            limit = 10;
        }
        
        const skip = (page - 1) * limit;
        
        const [flashSales, totalCount] = await Promise.all([
            FlashSaleModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('products.product'),
            FlashSaleModel.countDocuments()
        ]);
        
        return res.json({
            message: "Danh sách Flash Sale",
            error: false,
            success: true,
            totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: flashSales
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getActiveFlashSalesController = async (req, res) => {
    try {
        const currentTime = new Date();
        
        const flashSales = await FlashSaleModel.find({
            isActive: true,
            startDate: { $lte: currentTime },
            endDate: { $gte: currentTime }
        })
        .populate('products.product')
        .sort({ displayOrder: 1 });
        
        return res.json({
            message: "Danh sách Flash Sale đang diễn ra",
            error: false,
            success: true,
            data: flashSales
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


export const getFlashSaleDetailsController = async (req, res) => {
    try {
        const { id } = req.params;
        
        if(!id) {
            return res.status(400).json({
                message: "Vui lòng cung cấp ID của Flash Sale!",
                error: true,
                success: false
            });
        }
        
        const flashSale = await FlashSaleModel.findById(id).populate('products.product');
        
        if(!flashSale) {
            return res.status(404).json({
                message: "Không tìm thấy Flash Sale!",
                error: true,
                success: false
            });
        }
        
        return res.json({
            message: "Chi tiết Flash Sale",
            error: false,
            success: true,
            data: flashSale
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


export const updateFlashSaleController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, startDate, endDate, products, isActive, showOnHomepage, displayOrder } = req.body;
        
        if(!id) {
            return res.status(400).json({
                message: "Vui lòng cung cấp ID của Flash Sale!",
                error: true,
                success: false
            });
        }
        
        const flashSale = await FlashSaleModel.findById(id);
        
        if(!flashSale) {
            return res.status(404).json({
                message: "Không tìm thấy Flash Sale!",
                error: true,
                success: false
            });
        }
        
        if(name) flashSale.name = name;
        if(description !== undefined) flashSale.description = description;
        if(startDate) flashSale.startDate = startDate;
        if(endDate) flashSale.endDate = endDate;
        if(products) flashSale.products = products;
        if(isActive !== undefined) flashSale.isActive = isActive;
        if(showOnHomepage !== undefined) flashSale.showOnHomepage = showOnHomepage;
        if(displayOrder !== undefined) flashSale.displayOrder = displayOrder;
        
        if(new Date(flashSale.startDate) >= new Date(flashSale.endDate)) {
            return res.status(400).json({
                message: "Thời gian bắt đầu phải trước thời gian kết thúc!",
                error: true,
                success: false
            });
        }
        
        if(products) {
            for(const item of products) {
                const product = await ProductModel.findById(item.product);
                if(!product) {
                    return res.status(400).json({
                        message: `Sản phẩm với ID ${item.product} không tồn tại!`,
                        error: true,
                        success: false
                    });
                }
                
                if(item.flashSalePrice >= product.price) {
                    return res.status(400).json({
                        message: `Giá flash sale của sản phẩm ${product.name} phải nhỏ hơn giá gốc!`,
                        error: true,
                        success: false
                    });
                }
                
                if(item.flashSaleStock > product.stock) {
                    return res.status(400).json({
                        message: `Số lượng flash sale của sản phẩm ${product.name} không thể lớn hơn tồn kho!`,
                        error: true,
                        success: false
                    });
                }
            }
        }
        
        const updatedFlashSale = await flashSale.save();
        
        return res.json({
            message: "Cập nhật Flash Sale thành công!",
            data: updatedFlashSale,
            success: true,
            error: false
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


export const deleteFlashSaleController = async (req, res) => {
    try {
        const { id } = req.params;
        
        if(!id) {
            return res.status(400).json({
                message: "Vui lòng cung cấp ID của Flash Sale!",
                error: true,
                success: false
            });
        }
        
        const flashSale = await FlashSaleModel.findByIdAndDelete(id);
        
        if(!flashSale) {
            return res.status(404).json({
                message: "Không tìm thấy Flash Sale!",
                error: true,
                success: false
            });
        }
        
        return res.json({
            message: "Xóa Flash Sale thành công!",
            success: true,
            error: false
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


export const addProductToFlashSaleController = async (req, res) => {
    try {
        const { id } = req.params;
        const { product, flashSalePrice, flashSaleStock, flashSaleLimit } = req.body;
        
        if(!id || !product || !flashSalePrice || !flashSaleStock) {
            return res.status(400).json({
                message: "Vui lòng cung cấp đầy đủ thông tin!",
                error: true,
                success: false
            });
        }
        
        const flashSale = await FlashSaleModel.findById(id);
        
        if(!flashSale) {
            return res.status(404).json({
                message: "Không tìm thấy Flash Sale!",
                error: true,
                success: false
            });
        }
        
        const existingProduct = flashSale.products.find(p => p.product.toString() === product);
        if(existingProduct) {
            return res.status(400).json({
                message: "Sản phẩm đã tồn tại trong Flash Sale!",
                error: true,
                success: false
            });
        }
        
        const productInfo = await ProductModel.findById(product);
        if(!productInfo) {
            return res.status(400).json({
                message: "Sản phẩm không tồn tại!",
                error: true,
                success: false
            });
        }
        
        if(flashSalePrice >= productInfo.price) {
            return res.status(400).json({
                message: `Giá flash sale của sản phẩm ${productInfo.name} phải nhỏ hơn giá gốc!`,
                error: true,
                success: false
            });
        }
        
        if(flashSaleStock > productInfo.stock) {
            return res.status(400).json({
                message: `Số lượng flash sale của sản phẩm ${productInfo.name} không thể lớn hơn tồn kho!`,
                error: true,
                success: false
            });
        }
        
        flashSale.products.push({
            product,
            flashSalePrice,
            flashSaleStock,
            flashSaleLimit: flashSaleLimit || 0,
            soldCount: 0
        });
        
        const updatedFlashSale = await flashSale.save();
        
        return res.json({
            message: "Thêm sản phẩm vào Flash Sale thành công!",
            data: updatedFlashSale,
            success: true,
            error: false
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


export const removeProductFromFlashSaleController = async (req, res) => {
    try {
        const { id, productId } = req.params;
        
        if(!id || !productId) {
            return res.status(400).json({
                message: "Vui lòng cung cấp đầy đủ thông tin!",
                error: true,
                success: false
            });
        }
        
        const flashSale = await FlashSaleModel.findById(id);
        
        if(!flashSale) {
            return res.status(404).json({
                message: "Không tìm thấy Flash Sale!",
                error: true,
                success: false
            });
        }
        
        const productIndex = flashSale.products.findIndex(p => p.product.toString() === productId);
        if(productIndex === -1) {
            return res.status(404).json({
                message: "Sản phẩm không có trong Flash Sale!",
                error: true,
                success: false
            });
        }
        
        flashSale.products.splice(productIndex, 1);
        
        const updatedFlashSale = await flashSale.save();
        
        return res.json({
            message: "Xóa sản phẩm khỏi Flash Sale thành công!",
            data: updatedFlashSale,
            success: true,
            error: false
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}; 