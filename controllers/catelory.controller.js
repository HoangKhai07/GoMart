import CategoryModel from "../model/category.model.js";

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
