// src/app/components/Login.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("isAuthenticated", "true");
      router.push('/dashboard');
    } else {
      alert(data.message);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-1xl font-bold text-gray-800 mb-6 text-center">
          Guidance for Inheritance and Assets
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-green-500 bg-white border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              /> */}
              {/* Uncomment if needed */}
              {/* <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </label> */}
            </div>
            {/* Uncomment if needed */}
            {/* <Link href="#" className="text-sm text-green-600 hover:underline">
              Forgot password?
            </Link> */}
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Log In
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
