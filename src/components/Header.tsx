"use client";
import Link from "next/link";
import Image from "next/image";
import Spinner from "./Spinner";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { isLoggedIn, userData } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50 shadow-2xl">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#ececec]">
              Klasyczny blog™
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/sign-up"
                  className="hidden sm:inline text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-700 text-white rounded-lg transition-colors duration-300 px-4 py-1 text-sm font-medium shadow-lg"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <span className="hidden sm:inline text-sm text-gray-400">
                  Logged in as:{" "}
                  <span className="text-white font-medium">
                    {userData?.name}
                  </span>
                </span>
                <Link
                  href={`/profile/${userData?.name}`}
                  className="group relative"
                >
                  {userData?.name ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all shadow-lg">
                      <Image
                        src="/profile_placeholder.webp"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                      {userData?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
