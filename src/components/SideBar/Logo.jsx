import React from 'react'
import { Link } from 'react-router-dom';
import logo from "../../assets/logo/Instagram_logo.svg.png"
import logoWhite from "../../assets/logo/instgram_logo_white.png"
import useWidth from '../../Hooks/useWidth';
import { FaInstagram } from "react-icons/fa";
import useDarkmode from '../../Hooks/useDarkMode';


export const Logo = () => {
    const { width, breakpoints } = useWidth();
    const [isDark] = useDarkmode()

    return (
        <div className='w-[100%] h-14'>
            <Link>
                <div className='flex pl-5 py-3' >

                    {
                        width < breakpoints.lg ?
                            <FaInstagram className='md:h-10' />
                            :
                            <img className={`${isDark ? "md:w-34 md:h-14" : "md:w-35 md:h-10"}`} src={ isDark ? logoWhite : logo} alt="" />

                    }

                </div>
            </Link>
        </div>
    )
}
