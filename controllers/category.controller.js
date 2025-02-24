import CategoryModel from "../model/category.model.js";
import SubCategoryModel from "../model/subCategory.model.js";
import ProductModel from "../model/product.model.js";

export const AddCategoryController = async(request, response) => {
    try {
        const {name, image} = request.body

        if(!name || !image){
            return response.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin của danh mục sản phẩm",
                error: true,
                sucess: false
            })
        }

        const existingCategory = await CategoryModel.findOne({name: name})
        if(existingCategory){
            return res.status(400).json({
                message: "Tên danh mục đã tồn tại, vui lòng chọn tên khác!",
                error: true,
                success: false
            })
        }
        
        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await addCategory.save()

        if(!saveCategory){
            return response.status(500).json({
                message: "Tạo danh mục sản phẩm mới thất bại, vui lòng thử lại!",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "Thêm danh mục sản phẩm mới thành công!",
            error: false,
            success: true,
            data: saveCategory
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false

        })
    }
}

export const getCategoryController = async (req, res) => {
    try {
        const data = await CategoryModel.find()

        return res.json({
            data: data,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const {_id, name, image} = req.body

        if(!name || !image){
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin của danh mục!",
                error: true,
                success: false
            })
        }

       
       

        const update = await CategoryModel.findOneAndUpdate(
            { _id: _id },
            {
                name,
                image
            },
            { new: true }
        )

        return res.json({
            message: "Cập nhật danh mục sản phẩm thành công!",
            error: false,
            success: true,
            data: update
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {

        const {_id} = req.body

        const checkSubCategory = await SubCategoryModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        const checkProduct = await ProductModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        if(checkSubCategory > 0 || checkProduct > 0){
            return res.status(400).json({
                message: "Danh mục này đang có danh mục con hoặc sản phẩm, vui lòng xóa danh mục con trước!",
                error: true,
                success: false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({_id: _id})
        return res.json({
            message: "Xóa danh mục sản phẩm thành công!",
            error: false,
            success: true,
            data: deleteCategory
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true

        })
        
    }
}


