"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function App() {
  const [komunikat, setKomunikat] = useState("");

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      return "Hasło musi mieć co najmniej 6 znaków";
    }
    if (!/[A-Z]/.test(value)) {
      return "Hasło musi zawierać przynajmniej jedną dużą literę";
    }
    if (!/\d/.test(value)) {
      return "Hasło musi zawierać przynajmniej jedną cyfrę";
    }
    return true;
  };

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
        const result = await res.json();
        setKomunikat(result.error);
        console.error("Błąd:", result);
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
        {komunikat}
        <div>
          <label className="block mb-1">Nick</label>
          <input
            type="text"
            {...register("name", {
              required: "Pole wymagane",
              maxLength: { value: 20, message: "Maksymalnie 20 znaków" },
              pattern: {
                value: /^[\w\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/,
                message:
                  "Nick nie może zawierać spacji ani niedozwolonych znaków",
              },
            })}
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
              validate: validatePassword,
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
