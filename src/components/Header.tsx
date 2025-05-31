"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <header
      className={`fixed w-full py-3 text-white transition-all duration-200 z-50 border-b-gray-500 border-solid border-b-2`}
    >
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" passHref>
          Klasyczny blog.
        </Link>
        <ul className="flex space-x-4">
          {!isLoggedIn ? (
            <>
              <li>
                <a href="/sign-up" className="hover:underline">
                  Sign up
                </a>
              </li>
              <li>
                <Link
                  className="w-auto relative bg-gradient-to-r from-[#D466FF] to-[#9905FC] hover:bg-[#a94acf] text-white rounded-lg transition-colors flex items-center justify-center text-base px-3 py-1 -top-1"
                  href="/login"
                  passHref
                >
                  Login
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600/50 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition"
              >
                Log out
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
