import React, { useState, useEffect } from 'react'
import { IoClose } from "react-icons/io5"
import AxiosToastError from '../../utils/AxiosToastError.js'
import Axios from '../../utils/Axios.js'
import SummaryApi from '../../common/SummaryApi.js';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useGlobalContext } from '../../provider/GlobalProvider.jsx';

const EditAddressDetails = ({ close, data }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            _id: data._id,
            userId: data.userId,
            name: data.name,
            mobile: data.mobile,
            province: data.province,
            district: data.district,
            ward: data.ward,
            specific_address: data.specific_address,
            is_default: data.isDefault
        }
    })  
    
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [isDefault, setIsDefault] = useState(data.status || false);
    const [loading, setLoading] = useState(false);
    const { fetchAddress } = useGlobalContext()

    const fetchProvinces = async () => {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/p/');
            const data = await response.json();
            setProvinces(data);
            return data;
        } catch (error) {
            console.error('Error fetching provinces:', error);
            toast.error('Không thể tải danh sách tỉnh/thành phố');
            return [];
        }
    }

    const fetchDistricts = async (provinceCode) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts || []);
            return data.districts || [];
        } catch (error) {
            toast.error('Không thể tải danh sách quận/huyện');
            return [];
        }
    }

    const fetchWards = async (districtCode) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const data = await response.json();
            setWards(data.wards || []);
            return data.wards || [];
        } catch (error) {
            toast.error('Không thể tải danh sách phường/xã');
            return [];
        }
    }

    // Hàm tìm mã code của tỉnh/thành phố dựa trên tên
    const findProvinceCode = (provinceName, provincesList) => {
        const province = provincesList.find(p => p.name === provinceName);
        return province ? province.code : null;
    }

    // Hàm tìm mã code của quận/huyện dựa trên tên
    const findDistrictCode = (districtName, districtsList) => {
        const district = districtsList.find(d => d.name === districtName);
        return district ? district.code : null;
    }

    // Hàm tìm mã code của phường/xã dựa trên tên
    const findWardCode = (wardName, wardsList) => {
        const ward = wardsList.find(w => w.name === wardName);
        return ward ? ward.code : null;
    }

    // Thiết lập giá trị ban đầu cho các dropdown
    const initializeLocationData = async () => {
        try {
            // Fetch danh sách tỉnh/thành phố
            const provincesList = await fetchProvinces();
            
            // Tìm mã code của tỉnh/thành phố
            const provinceCode = findProvinceCode(data.province, provincesList);
            if (provinceCode) {
                setSelectedProvince(provinceCode.toString());
                
                // Fetch danh sách quận/huyện
                const districtsList = await fetchDistricts(provinceCode);
                
                // Tìm mã code của quận/huyện
                const districtCode = findDistrictCode(data.district, districtsList);
                if (districtCode) {
                    setSelectedDistrict(districtCode.toString());
                    
                    // Fetch danh sách phường/xã
                    const wardsList = await fetchWards(districtCode);
                    
                    // Tìm mã code của phường/xã
                    const wardCode = findWardCode(data.ward, wardsList);
                    if (wardCode) {
                        setSelectedWard(wardCode.toString());
                        setValue('ward', wardCode.toString());
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing location data:', error);
        }
    }

    const onSubmit = async (formData) => {
        if (!selectedProvince || !selectedDistrict || !formData.ward) {
            toast.error("Vui lòng chọn tỉnh, huyện và xã")
            return
        }

        try {
            setLoading(true)

            const provinceName = provinces.find(p => p.code === parseInt(selectedProvince))?.name || '';
            const districtName = districts.find(d => d.code === parseInt(selectedDistrict))?.name || '';
            const wardName = wards.find(w => w.code === parseInt(formData.ward))?.name || '';

            const response = await Axios({
                ...SummaryApi.update_address,
                data: {
                    ...data,
                    addressId: data._id, 
                    name: formData.name,
                    mobile: formData.mobile,
                    province: provinceName,
                    district: districtName,
                    ward: wardName,
                    specific_address: formData.specific_address,
                    is_default: isDefault
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                    reset()
                    fetchAddress()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        initializeLocationData();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetchDistricts(selectedProvince);
            if (selectedProvince !== data.provinceCode) {
                setSelectedDistrict('');
                setSelectedWard('');
                setWards([]);
                setValue('ward', '');
            }
        }
    }, [selectedProvince])

    useEffect(() => {
        if (selectedDistrict) {
            fetchWards(selectedDistrict);
            if (selectedDistrict !== data.districtCode) {
                setSelectedWard('');
                setValue('ward', '');
            }
        }
    }, [selectedDistrict])

    return (
        <section className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl'>
                <div className='sticky top-0 bg-white p-6 border-b z-10'>
                    <div className='flex items-center'>
                        <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa địa chỉ</h2>
                        <button onClick={close} className='w-10 h-10 flex items-center justify-center ml-auto rounded-full hover:bg-gray-100 transition-colors'>
                            <IoClose size={24} />
                        </button>
                    </div>
                </div>

                <div className='p-6'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                            <div>
                                <label className='block text-gray-700 mb-2'>Họ tên</label>
                                <input
                                    type="text"
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập họ tên người nhận'
                                    {...register("name", { required: "Vui lòng nhập họ tên" })}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className='block text-gray-700 mb-2'>Số điện thoại</label>
                                <input
                                    type="tel"
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập số điện thoại'
                                    {...register("mobile", {
                                        required: "Vui lòng nhập số điện thoại",
                                    })}
                                />
                                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                            <div>
                                <label className='block text-gray-700 mb-2'>Tỉnh/Thành phố</label>
                                <select
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    value={selectedProvince}
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                >
                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                    {provinces.map((province) => (
                                        <option key={province.code} value={province.code}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                                {!selectedProvince && <p className="text-red-500 text-sm mt-1">Vui lòng chọn tỉnh/thành phố</p>}
                            </div>

                            <div>
                                <label className='block text-gray-700 mb-2'>Quận/Huyện</label>
                                <select
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    disabled={!selectedProvince}
                                >
                                    <option value="">Chọn Quận/Huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                                {!selectedDistrict && <p className="text-red-500 text-sm mt-1">Vui lòng chọn quận/huyện</p>}
                            </div>

                            <div>
                                <label className='block text-gray-700 mb-2'>Phường/Xã</label>
                                <select
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    disabled={!selectedDistrict}
                                    value={selectedWard}
                                    onChange={(e) => {
                                        setSelectedWard(e.target.value);
                                        setValue('ward', e.target.value);
                                    }}
                                >
                                    <option value="">Chọn Phường/Xã</option>
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward.message}</p>}
                            </div>
                        </div>

                        <div className='mb-6'>
                            <label className='block text-gray-700 mb-2'>Địa chỉ cụ thể</label>
                            <input
                                type="text"
                                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Số nhà, tên đường, khu vực'
                                {...register("specific_address", { required: "Vui lòng nhập địa chỉ cụ thể" })}
                            />
                            {errors.specific_address && <p className="text-red-500 text-sm mt-1">{errors.specific_address.message}</p>}
                        </div>

                        <div className='mb-6'>
                            <label className='flex items-center'>
                                <input
                                    type="checkbox"
                                    className="mr-2 h-4 w-4"
                                    checked={isDefault}
                                    onChange={(e) => setIsDefault(e.target.checked)}
                                />
                                <span className="text-gray-700">Đặt làm địa chỉ mặc định</span>
                            </label>
                        </div>

                        <div className='flex justify-end space-x-4'>
                            <button
                                type="button"
                                onClick={close}
                                className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300'
                            >
                                {loading ? 'Đang xử lý...' : 'Lưu địa chỉ'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default EditAddressDetails



