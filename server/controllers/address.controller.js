import AddressModel from "../model/address.model.js";
import UserModel from "../model/user.model.js";

export const addAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const {name, province, district, ward, specific_address, mobile, is_default} = req.body
        const createAddress = new AddressModel({
            name, 
            province, 
            district, 
            ward, 
            specific_address, 
            mobile,
            userId: userId
        })

        const saveAddress = await createAddress.save()

        if (is_default) {
            await AddressModel.updateMany(
                { _id: { $in: (await UserModel.findById(userId)).address_details } },
                { $set: { status: false } }
            );
            
            await AddressModel.findByIdAndUpdate(saveAddress._id, { status: true });
        }

        await UserModel.findByIdAndUpdate(userId, {
            $push: {
                address_details: saveAddress._id
            }
        })

        return res.json({
            message: "Địa chỉ đã được thêm thành công!",
            error: false,
            success: true,
            data: saveAddress
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId

        const address = await AddressModel.find({userId: userId}).sort({createdAt: -1})

        return res.json({
            message:"Lấy địa chỉ thành công!",
            error: false,
            success: true,
            data: address
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const {_id, name, province, district, ward, specific_address, mobile, is_default} = req.body

        const updateAddress = await AddressModel.updateOne({_id: _id, userId: userId},{
            name, 
            province, 
            district, 
            ward, 
            specific_address, 
            mobile, 
            is_default
        })

        return res.json({
            message: "Địa chỉ đã được cập nhật thành công!",
            error: false,
            success: true,
            data: updateAddress
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const {_id } = req.body

        const deleteAddress = await AddressModel.deleteOne({_id: _id})
        
        return res.json({
            message:"Đã xoá địa chỉ",
            error: false,
            success: true,
            data: deleteAddress
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
    
}