"use client";

import Link from "next/link";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export default function Navbar() {
    const authContext = useContext(AuthContext);

    return (
        <nav className="bg-gray-900 text-white py-4">
            <div className="container mx-auto flex justify-between items-center px-6">
                <Link href="/" className="text-2xl font-bold">HI</Link> {/*logo*/}

                <ul className="flex space-x-6">
                    <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                    <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
                    {!authContext?.user ? (
                        <>
                            <li><Link href='/login' className="hover:text-gray-300">Login</Link></li>
                            <li><Link href='/register' className="hover:text-gray-300">Register</Link></li>
                        </>
                    ) : (
                        <li><button onClick={authContext.logout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">Logout</button></li>
                    )}

                </ul>
            </div>
        </nav>
    );
}