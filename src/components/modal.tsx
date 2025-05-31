"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

export default function Modal({ onClose }: { onClose: () => void }) {
  const [authorId, setAuthorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorId = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setAuthorId(data.user.id); // zakładam, że response to np. { user: { id, email, ... } }
        } else {
          console.error("Nie udało się pobrać danych użytkownika");
        }
      } catch (err) {
        console.error("Błąd pobierania danych użytkownika:", err);
      }
    };

    fetchAuthorId();
  }, []);

  type FormData = {
    title: string;
    content: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const modalRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (data: any) => {
    if (!authorId) {
      alert("Nie udało się pobrać ID użytkownika.");
      return;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, authorId }),
    });

    if (res.ok) {
      reset();
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-gray-900 border border-gray-700 rounded-3xl p-10 w-full max-w-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-white mb-6">Nowy post</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Tytuł</label>
            <input
              {...register("title", { required: "Tytuł jest wymagany" })}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:border-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Treść</label>
            <textarea
              {...register("content", {
                required: "Treść jest wymagana",
                minLength: { value: 6, message: "Minimum 6 znaków" },
              })}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              rows={4}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Dodaj post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
