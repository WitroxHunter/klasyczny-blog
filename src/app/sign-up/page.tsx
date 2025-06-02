"use client";

import React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  type SignupFormData = {
    name: string;
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    console.log(data);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Błąd:", text);
        return;
      }

      const user = await res.json();
      console.log("Użytkownik zapisany:", user);
    } catch (err) {
      console.error("Wystąpił błąd:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white flex-col gap-4">
      <h1 className="text-4xl">Sign up</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg"
      >
        <div>
          <label className="block mb-1">Nick</label>
          <input
            type="text"
            {...register("name", { required: true, maxLength: 80 })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="text"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Hasło</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <input
          type="submit"
          value="Submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer"
        />
      </form>
    </div>
  );
}
