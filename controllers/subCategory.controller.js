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