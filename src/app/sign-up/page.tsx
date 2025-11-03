"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, UserPlus } from "lucide-react";

type SignupFormData = {
  name: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const [komunikat, setKomunikat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/\d/.test(value)) {
      return "Password must contain at least one number";
    }
    return true;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setKomunikat("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        setKomunikat(result.error);
        setIsLoading(false);
        throw new Error(
          result.error || "An error occurred during registration"
        );
      }

      const user = await res.json();
      console.log("User registered:", user);
      setSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("Error occurred:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 to-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Create Account
          </h1>
          <p className="text-gray-400">Join our blogging community</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl text-sm">
              Account created successfully! Redirecting to login...
            </div>
          )}

          {komunikat && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
              {komunikat}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                {...register("name", {
                  required: "Username is required",
                  maxLength: {
                    value: 20,
                    message: "Username must be max 20 characters",
                  },
                  pattern: {
                    value: /^[\w\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/,
                    message:
                      "Username cannot contain spaces or invalid characters",
                  },
                })}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Choose a username"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  validate: validatePassword,
                })}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Create a password"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Must contain 6+ characters, 1 uppercase letter, and 1 number
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-950 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Sign Up
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
