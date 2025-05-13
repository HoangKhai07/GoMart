import VoucherModel from "../model/voucher.model.js"


export const createVoucherController = async (req, res) => {
    try {
        const voucherData = req.body

        const newVoucher = new VoucherModel(voucherData)
        const savedVoucher = await newVoucher.save()

        return res.json({
            message: "Tạo Voucher mới thành công",
            error: false,
            success: true,
            data: savedVoucher
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getVouchersController = async (req, res) => {
    try {
        const vouchers = await VoucherModel.find().sort({created: -1})
        
        return res.json({
            message: "Get vouchers successfully",
            error: false,
            success: true,
            data: vouchers
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
    
}

export const deleteVoucherController = async (req, res) => {
    try {
        const {_id} = req.body

        if(!_id){
            return res.status(400).json({
                message: "Provide voucher _id!",
                error: true,
                success: false
            })
        }

        const deletedVoucher = await VoucherModel.deleteOne({_id: _id})

        return res.json({
            message: "Xoá voucher thành công!",
            error: false,
            success: true,
            data: deletedVoucher
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
        
    }
}

export const applyVoucherController = async (req, res) => {
    try {
        const { code, orderAmount }= req.body

        const voucher = await VoucherModel.findOne({
            code,
            is_active: true,
            start_date: { $lte: new Date()},
            end_date: { $gte: new Date()}
        })

        if(!voucher || voucher.used >= voucher.quantity){
            return res.status(400).json({
                message: "Voucher không hợp lệ hoặc đã hết hạn!",
                error: true,
                success: false
            })
        }

        if(orderAmount < voucher.min_order_value){
            return res.status(400).json({
                message: `Đơn hàng cần đạt tối thiểu ${voucher.min_order_value} để sử dụng voucher này`,
                error: true,
                success: false
               })
        }

        let discountAmount
        if(voucher.discount_type === "percent"){
            discountAmount = (orderAmount * voucher.discount_value) / 100
            if(voucher.max_discount){
                discountAmount = Math.min(discountAmount, voucher.max_discount)
            }
        } else {
            discountAmount = voucher.discount_value
        }
         return res.json({
            message: "Áp dụng voucher thành công!",
            error: false,
            success: true,
            data: {
                discountAmount,
                voucher
            }
         })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateVoucherController = async (req, res) => {
    try {
        const {_id, code, discount_type, discount_value, max_discount, min_order_value, quantity,
            used, start_date, end_date, is_active, description} = req.body

        if (!_id) {
            return res.status(400).json({
                message: "Vui lòng cung cấp ID voucher!",
                error: true,
                success: false
            });
        }

        const updateVoucher = await VoucherModel.findByIdAndUpdate(_id, {
            code,  
            discount_type,  
            discount_value,  
            max_discount,  
            min_order_value, 
            quantity,
            used, 
            start_date,  
            end_date, 
            is_active, 
            description
        }, { new: true });

        if (!updateVoucher) {
            return res.status(404).json({
                message: "Không tìm thấy voucher!",
                error: true,
                success: false
            });
        }

        return res.json({
            message: "Cập nhật voucher thành công",
            error: false,
            success: true,
            data: updateVoucher
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}