'use client';

import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "@/context/AuthContext";

export default function Home() {
  const [searchQuery, setSearchQurey] = useState("");
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);

  const {user} = authContext || {};
  const userid = user?.id;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/search", { userid, searchQuery });

      setSearchResult(response.data.users.map((user: any) => user.username));
    } catch (error) {
      console.error("Search failed: ", error);
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold">Fullstack app: ANORA</h1>
      <p className="mt-4 text-lg">Backend message: {userid}</p>
      
      <form onSubmit={handleSearch} className="flex space-x-2">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQurey(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus: ring-blue-500" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Search</button>
      </form>

      {loading && <p className="mt-4 text-gray-600">Searching...</p>}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {searchResult.length > 0 && (
        <div className="mt-4 p-4 bg-white border rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Matched User IDs:</h2>
          <ul className="text-gray-700">
            {searchResult.map((username, index) => (
              <li key={index} className="border-b py-2">{username}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}