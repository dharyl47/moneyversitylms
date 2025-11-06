// src/app/components/Login.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load saved email from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);

    try {
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
        
        // Store user data if available
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        
        // Save or remove email based on rememberMe checkbox
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid username or password');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Loading Spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        strokeOpacity="0.25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // SVG Icons
  const EmailIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '22px', height: '22px' }}>
      <rect x="1" y="4" width="20" height="14" rx="1" fill="none" stroke="#808285" strokeWidth="2"/>
      <path d="M1 5L11 12L21 5" stroke="#808285" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const EyeIcon = () => (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0ZM11 12.5C8.24 12.5 6 10.26 6 7.5C6 4.74 8.24 2.5 11 2.5C13.76 2.5 16 4.74 16 7.5C16 10.26 13.76 12.5 11 12.5ZM11 4.5C9.34 4.5 8 5.84 8 7.5C8 9.16 9.34 10.5 11 10.5C12.66 10.5 14 9.16 14 7.5C14 5.84 12.66 4.5 11 4.5Z" fill="#808285"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0ZM11 12.5C8.24 12.5 6 10.26 6 7.5C6 4.74 8.24 2.5 11 2.5C13.76 2.5 16 4.74 16 7.5C16 10.26 13.76 12.5 11 12.5ZM11 4.5C9.34 4.5 8 5.84 8 7.5C8 9.16 9.34 10.5 11 10.5C12.66 10.5 14 9.16 14 7.5C14 5.84 12.66 4.5 11 4.5Z" fill="#808285" opacity="0.4"/>
      <line x1="1" y1="1" x2="21" y2="17" stroke="#808285" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-md p-8 border border-gray-200 relative overflow-hidden">
        {/* Decorative green bar at the top */}
        <div 
          className="absolute top-0 left-0 w-full"
          style={{
            height: '4px',
            backgroundColor: '#4FB848',
          }}
        />
        
        {/* Header with hat icon and title */}
        <div className="flex items-center justify-center mb-4 mt-2">
          <h1 
            className="text-center"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: '32px',
              fontWeight: 700,
              lineHeight: '39px',
              color: '#4FB848'
            }}
          >
            <span className="relative inline-block">
              Gu
              <span className="relative inline-block">
                i
                <Image
                  src="/images/mvhat.png"
                  alt="Graduation cap"
                  width={36.6}
                  height={29.4}
                  className="absolute left-1/2"
                  style={{ 
                    transform: 'translateX(-50%)',
                    top: '-18px',
                    width: '36.6px',
                    height: '29.4px',
                    maxWidth: '100px'
                  }}
                  unoptimized
                />
              </span>dance
            </span> for Inheritance and assets (GIA)
          </h1>
        </div>

        {/* Horizontal separator line */}
        <div 
          className="mb-8 mt-8"
          style={{
            height: '1px',
            backgroundColor: '#E5E5E5',
            marginLeft: '-32px',
            marginRight: '-32px',
            width: 'calc(100% + 64px)'
          }}
        />

        {/* Subtitle */}
        <p 
          className="text-center mb-6"
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: '22px',
            color: '#282828'
          }}
        >
          Sign in to start your session
        </p>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-4 p-3 rounded-lg flex items-center justify-between"
            style={{
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#DC2626',
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: '14px',
            }}
          >
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 12C7.45 12 7 11.55 7 11C7 10.45 7.45 10 8 10C8.55 10 9 10.45 9 11C9 11.55 8.55 12 8 12ZM9 9H7V5H9V9Z" fill="currentColor"/>
              </svg>
              {error}
            </span>
            <button
              onClick={() => setError('')}
              className="ml-4 text-red-600 hover:text-red-800"
              style={{ cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 flex flex-col items-center">
          {/* Email Input */}
          <div className="relative">
            <div className="relative flex items-center">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="h-[52px] pl-4 pr-[52px] bg-white border-2 border-gray-300 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                style={{
                  width: '417px',
                  maxWidth: '100%',
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                }}
                required
              />
              <div className="absolute right-0 h-[52px] w-[52px] bg-[#D1D2D3] flex items-center justify-center border-l-2 border-gray-300 rounded-r">
                <EmailIcon />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-[52px] pl-4 pr-[52px] bg-white border-2 border-gray-300 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                style={{
                  width: '417px',
                  maxWidth: '100%',
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 h-[52px] w-[52px] bg-[#D1D2D3] flex items-center justify-center border-l-2 border-gray-300 rounded-r cursor-pointer hover:bg-gray-200 transition-colors"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Remember Me and Sign In Button */}
          <div className="flex items-center justify-between w-full" style={{ width: '417px', maxWidth: '100%' }}>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-green-500 bg-white border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
              <label 
                htmlFor="remember" 
                className="ml-2"
                style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#282828'
                }}
              >
                Remember Me
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="text-white transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                width: '127px',
                height: '50px',
                backgroundColor: '#4FB848',
                borderRadius: '5px',
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
