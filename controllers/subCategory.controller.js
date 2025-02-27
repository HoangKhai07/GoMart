import ProductModel from "../model/product.model.js";
import SubCategoryModel from "../model/subCategory.model.js";

export const AddSubCategoryController = async (req, res) => {
    try {
        const {name, image, category} = req.body

        if(!name || !image || !category[0]){
            return res.status(400).json({
                message: "Vui lòng điền đầy đủ thông tin cho danh mục con!",
                error: true,
                success: false,
            })
        }
        const payload = {  
            name,
            image,
            category
        }

        const createSubCategory = new SubCategoryModel(payload)
        const save = await createSubCategory.save()

        return res.json({
            message: "Thêm danh mục con thành công!",
            error: false,
            success: true,
            data: save
        })

        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
         
    }
} 

export const getSubCategoryController = async (req, res) => {
    try {
        const data = await SubCategoryModel.find()
            .populate('category')
            .sort({createdAt: -1});

        return res.json({
            message: "sub catgory data",
            data: data,
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

export const updateSubCategoryController = async (req, res) => {

    try {
        const {_id, name, image, category} = req.body

    const update = await SubCategoryModel.findOneAndUpdate(
        {_id: _id},
        {
            name,
            image,
            category
        },
        {new: true}
    )

    return res.json({
        message: "Cập nhật danh mục thành công!",
        data: update,
        error: false,
        success: true
    })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false
        })
    }
}

export const deleteSubCategoryController = async (req, res) => {
    try {
        const {_id} = req.body

        const checkProduct = await ProductModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        if(checkProduct > 0){
            return res.status(400).json({
                message: "Danh mục này đang có sản phẩm. Vui lòng xóa sản phẩm trước!",
                success: false,
                error: true
            })
        }

        const deleteSubCategory = await SubCategoryModel.deleteOne({_id: _id})

        return res.json({
            message: "Xóa danh mục con thành công!",
            success: true,
            error: false,
            data: deleteSubCategory
        })

    } catch (error) {
        return res.status(500).json({
            message: message || error,
            error: true, 
            success: false
        })
    }
}