"use client";
import { usePathname } from "next/navigation";
import Link from 'next/link';

export default function PageSwitchingArrows() {
    const pathname = usePathname(); 
    return (
        <div className="relative flex w-full">
            
            <Link href={ pathname === "/" ? "/DonatePage" : "/"} className="hover:text-[#8b4513]">
                {
                    <div
                        className={`absolute top-10 left-20 bg-[#8b4513] hover:bg-[#4f2609] hover:cursor-pointer text-white p-2 rounded-lg transform transition hover:scale-105 flex items-center justify-center transition-opacity duration-500 mx-auto`}
                        >
                        <i className="fa-solid fa-arrow-left text-2xl text-whitet"></i>
                    </div>
                }
            </Link>

            <Link href={ pathname === "/" ? "/DonatePage" : "/"} className="hover:text-[#8b4513]">
                {
                    <div
                        className={`absolute top-10 right-20 bg-[#8b4513] hover:bg-[#4f2609] hover:cursor-pointer text-white p-2 rounded-lg transform transition hover:scale-105 flex items-center justify-center transition-opacity duration-500 mx-auto`}
                    >
                        <i className="fa-solid fa-arrow-right text-2xl text-whitet"></i>
                    </div>
                }
            </Link>
        </div>
    )
}