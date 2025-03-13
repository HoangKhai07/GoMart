import ProductModel from "../model/product.model.js";

export const createProductController = async (req, res) => {
    try {
        const {name, image, price, description, stock, unit, brand, discount, more_details, category, subCategory, publish} = req.body
        
        if(!name ||!image[0] ||!price ||!description ||!stock ||!brand ||!more_details ||!category ||!subCategory[0]){
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin của sản phẩm!",
                error: true,
                success: false
         })
        }

        const createProduct = new ProductModel({
            name,
            image,
            price,
            description,
            stock,
            unit,
            brand,
            discount,
            more_details,
            category,
            subCategory,
            publish
        })

        const saveProduct = await createProduct.save()

        if(!saveProduct){
            return res.status(400).json({
                message: "Thêm sản phẩm thất bại!",
                error: true,
                success: false
            })
        }

        return res.json({
            message: "Thêm sản phẩm thành công!",
            data: saveProduct,
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
} 

export const getProductController = async (req, res)  => {
    try {
        let { page, limit, search} = req.body

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text: {
                $search: search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit),
            ProductModel.countDocuments(query)
        ])


        return res.json({
            message: "product data",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByCategoryController = async (req, res) => {
    try {
        const {id} = req.body

        if(!id){
            return res.status(400).json({
                message: "provde id category",
                error: true,
                success: false
            })
        }

        const product = await ProductModel.find({
            category: { $in: id }
        }).limit(15)

        return res.json({
            message: 'product list by category',
            error: false,
            success: true,
            data: product
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
       
    }
}

export const getProductByCategoryAndSubCategoryController = async (req, res) => {
    try {
        let { categoryId, subCategoryId, page, limit } = req.body
        
        if(!categoryId || !subCategoryId){
            return res.status(400).json({
                message: "provide id category and id subcategory",
                error: true,
                success: false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const skip = (page - 1) * limit

        const query = {
            category : { $in : categoryId },
            subCategory : { $in : subCategoryId }
        }

        const [ data, totalCount ] = await Promise.all([
            ProductModel.find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: "Product list by category and subcategory",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNuPage: Math.ceil( totalCount / limit ),
            data: data
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}