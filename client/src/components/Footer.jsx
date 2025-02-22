import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiZalo } from "react-icons/si";
import { IoLogoYoutube } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-primary-light-3 text-white">
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* Thông tin công ty */}
                <div className="space-y-4 ml-5      ">
                    <h3 className="text-xl font-bold mb-4">Gomart</h3>
                    <p className="text-white">
                        Chúng tôi cam kết mang đến những sản phẩm tốt nhất cho khách hàng.
                    </p>
                    <div className="space-y-2 text-white">
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt />
                            <span>Trường Đại học Công nghệ Thông tin, Quận Thủ Đức, TP.HCM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaPhoneAlt />
                            <span>(+84) 123 456 789</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaEnvelope /> 
                            <span>Gomart@gmail.com</span>
                        </div>
                    </div>
                </div>

                {/* Liên kết nhanh */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Liên Kết Nhanh</h3>
                    <ul className="space-y-2 text-white">
                        <li><a href="/about" className="hover:text-white transition-colors">Về Chúng Tôi</a></li>
                        <li><a href="/services" className="hover:text-white transition-colors">Dịch Vụ</a></li>
                        <li><a href="/portfolio" className="hover:text-white transition-colors">Sản phẩm</a></li>
                        <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                        <li><a href="/contact" className="hover:text-white transition-colors">Liên Hệ</a></li>
                    </ul>
                </div>

                {/* Đăng ký nhận tin */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Nhận Thông Báo</h3>
                    <p className="text-white mb-4">
                        Đăng ký để nhận thông tin mới nhất từ chúng tôi.
                    </p>
                    <form className="flex">
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            className="p-2 rounded-l-md text-gray-900 flex-grow"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md transition-colors"
                        >
                            Đăng Ký
                        </button>
                    </form>
                </div>

                {/* Mạng xã hội */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Kết Nối Với Chúng Tôi</h3>
                    <div className="flex gap-4 text-2xl text-white">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                            <FaFacebookF />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                            <FaInstagram />
                        </a>
                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                            <FaXTwitter />
                        </a>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                            <FaLinkedinIn />
                        </a>
                        <a href="https://zalo.me/pc" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                            <SiZalo />
                        </a>
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                            <IoLogoYoutube />
                        </a>
                    </div>
                </div>
            </div>

            {/* Phần bản quyền */}
            <div className="border-t border-gray-800 py-6">
                <div className="container mx-auto px-4 text-center text-white">
                    <p>
                        © {new Date().getFullYear()} Gomart Copyright | 
                        <a href="/privacy-policy" className="hover:text-white ml-2">Chính Sách Bảo Mật</a> | 
                        <a href="/terms-of-service" className="hover:text-white ml-2">Điều Khoản Dịch Vụ</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;