import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiZalo } from "react-icons/si";
import { IoLogoYoutube } from "react-icons/io";

const Footer = () => {
    return (
        <footer className='border-t p-4 '>
            <div className='container mx-auto p-4 text-center flex flex-col gap-2 lg:flex-row lg:justify-between'>
                <p>© All Right Reserved 2025.</p>

                <div className='flex items-center gap-4 justify-center text-2xl'>
                    <a href='' className='hover:text-primary-light-fb '>
                        <FaFacebookF />
                    </a>

                    <a href="" className='hover:text-primary-light-ins'>
                        <FaInstagram />
                    </a>

                    <a href="" className='hover:text-primary-light-x'>
                        <FaXTwitter />
                    </a>

                    <a href="" className='hover:text-primary-light-in'>
                        <FaLinkedinIn />
                    </a>

                    <a href="" className='hover:text-primary-light-zl'>
                        <SiZalo />
                    </a>

                    <a href="" className='hover:text-primary-light-ytb'>
                        <IoLogoYoutube />
                    </a>

                </div>
            </div>
        </footer>
    )
}

export default Footer