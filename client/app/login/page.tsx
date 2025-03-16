"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const authContext = useContext(AuthContext);
    const router = useRouter();

    if (!authContext) return <div>Loading ...</div>;

    const {login} = authContext;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email,password);
        router.push("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold">Login</h2>
            <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    );
}