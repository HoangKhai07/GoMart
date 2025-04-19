import React from 'react'
import { FaBox, FaTruck, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

const Timeline = ({ currentStatus }) => {
    const steps = [
        { status: 'Preparing order', icon: FaBox, label: 'Đang chuẩn bị hàng' },
        { status: 'Shipping', icon: FaTruck, label: 'Đang vận chuyển' },
        { status: 'Out for delivery', icon: FaShippingFast, label: 'Đang giao hàng' },
        { status: 'Delivered', icon: FaCheckCircle, label: 'Đã giao hàng' },
    ]

    const getCurrentStepIndex = () => {
        return steps.findIndex(step => step.status === currentStatus)
    }

    return (
        <div className='w-full py-6'>
            <div className='flex justify-between items-center'>
                {steps.map((step, index) => (
                    <React.Fragment key={step.status}>

                        {/* icon */}
                        <div className='flex flex-col items-center relative'>
                            <div
                                className={`lg:w-16 lg:h-16 w-12 h-12 rounded-full flex items-center justify-center ${index <= getCurrentStepIndex()
                                    ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            >
                                <step.icon className='text-white w-5 h-5 lg:w-6 lg:h-6' />
                            </div>
                            <span className='text-sm mt-2 text-center'>{step.label}</span>
                        </div>

                        {/* line */}
                        {index < steps.length - 1 && (
                            <div className='flex-1 mb-6 justify-center items-center'>
                                <div
                                    className={`h-1 ${index < getCurrentStepIndex() ? 'bg-green-500' : 'bg-gray-300'

                                        }`}
                                >

                                </div>

                            </div>
                        )}

                    </React.Fragment>
                ))}
            </div>

        </div>
    )
}

export default Timeline
