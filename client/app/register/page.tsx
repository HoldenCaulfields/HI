"use client";

import { useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";

export default function RegisterPage() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const authContext = useContext(AuthContext);

    if (!authContext) return <div>Loading ...</div>;

    const {register} = authContext;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(username, email, password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold ">Register</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</button>
            </form>
        </div>
    );
}