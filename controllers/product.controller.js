import ProductModel from "../model/product.model.js";

export const createProductController = async (req, res) => {
    try {
        const {name, image, price, description, stock, unit, branch, discount, more_details, category, subCategory, publish} = req.body
        
        if(!name ||!image[0] ||!price ||!description ||!stock ||!branch ||!more_details ||!category ||!subCategory[0]){
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
            branch,
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