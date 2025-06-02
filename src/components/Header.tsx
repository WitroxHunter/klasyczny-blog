"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isloading, setisLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setIsLoggedIn(true);
            setisLoading(false);
          } else {
            setIsLoggedIn(false);
            setisLoading(false);
          }
        } else {
          setIsLoggedIn(false);
          setisLoading(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsLoggedIn(false);
        setisLoading(false);
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
      className={`fixed bg-black w-full py-3 text-white transition-all duration-200 z-50 border-b-gray-500 border-solid border-b-2`}
    >
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" passHref>
          Klasyczny blog™
        </Link>
        <ul className="flex space-x-4">
          {!isLoggedIn ? (
            <>
              {!isloading ? (
                <>
                  <li>
                    <Link href="/sign-up" className="hover:underline">
                      Sign up
                    </Link>
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
                <>
                  <Spinner />
                </>
              )}
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
