import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"

export const uploadImageController = async (request, response)  => {
    try {
        const file = request.file

        const uploadImage = await uploadImageCloudinary(file)

        return response.json({
            message: "Tải ảnh lên thành công",
            data: uploadImage,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export default uploadImageController