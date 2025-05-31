"use client";

import React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    console.log(data);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await res.json();
    console.log(result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white flex-col gap-4">
      <h1 className="text-4xl">Zaloguj sie</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg"
      >
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="text"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block mb-1">Hasło</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />
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
