"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormData = {
  email: string;
  password: string;
};

export default function App() {
  const [komunikat, setKomunikat] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
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
    if (!res.ok) {
      setKomunikat(result.error);
      return;
    } else {
      window.location.href = "/";
    }
    console.log("Logowanie");
  };
  return (
    <div className="min-h-screen flex items-center justify-center text-white flex-col gap-4">
      <h1 className="text-4xl">Zaloguj sie</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg"
      >
        <div>
          {komunikat}
          <label className="block mb-1">Email</label>
          <input
            type="text"
            {...register("email", {
              required: "Pole wymagane",
              pattern: /^\S+@\S+$/i,
            })}
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
            {...register("password", {
              required: "Pole wymagane",
              minLength: 6,
            })}
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
