"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import PostList from "./Posts-list";

interface UserProfileProps {
  profileUser: {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    posts: { id: string; title: string; createdAt: Date }[];
  };
  isOwnProfile: boolean;
}

type ProfileFormData = {
  name: string;
  description: string;
};

export default function UserProfile({
  profileUser,
  isOwnProfile,
}: UserProfileProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [komunikat, setKomunikat] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: profileUser.name,
      description: profileUser.description || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setKomunikat("");

    const res = await fetch("/api/edit_profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: profileUser.id,
        name: data.name.trim(),
        description: data.description.trim(),
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      if (result.errorCode === "NAME_TAKEN") {
        setError("name", {
          type: "manual",
          message: "Ta nazwa jest już zajęta",
        });
      } else {
        setKomunikat(result.error || "Wystąpił błąd");
      }
      return;
    }

    // Po zapisie aktualizujemy wartości formularza na nowe
    reset(data);
    setEditingProfile(false);
  };

  const handleCancel = () => {
    reset({
      name: profileUser.name,
      description: profileUser.description || "",
    });
    setEditingProfile(false);
    setKomunikat("");
  };

  return (
    <div className="px-6 sm:px-20 py-20 max-w-4xl mx-auto space-y-8">
      {/* PROFIL */}
      <div className="bg-zinc-900 p-6 rounded-3xl flex items-center gap-6 shadow-md justify-between">
        <div className="flex items-center gap-6">
          <Image
            src="/profile_placeholder.webp"
            alt="Profilowe"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <div>
            {editingProfile ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div>
                  <input
                    {...register("name", {
                      required: "Imię jest wymagane",
                      minLength: { value: 3, message: "Minimum 3 znaki" },
                    })}
                    className="bg-zinc-800 text-white px-2 py-1 rounded-lg w-full"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    {...register("description", {
                      maxLength: {
                        value: 300,
                        message: "Maksymalnie 300 znaków",
                      },
                    })}
                    className="bg-zinc-800 text-white px-2 py-1 rounded-lg w-full"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {komunikat && <p className="text-red-400">{komunikat}</p>}
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white">
                  {profileUser.name}
                </h1>
                <p className="text-gray-400 text-sm">
                  Dołączył:{" "}
                  {new Date(profileUser.createdAt).toLocaleDateString("pl-PL")}
                </p>
                <p className="text-gray-300 mt-1">
                  {profileUser.description || "Brak opisu"}
                </p>
              </>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <div className="flex flex-col gap-3 w-40">
            {editingProfile ? (
              <>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full rounded-xl"
                >
                  {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  className="bg-red-600/50 hover:bg-red-700 text-white px-4 py-2 w-full rounded-xl"
                >
                  Anuluj
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditingProfile(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 w-full rounded-xl"
                >
                  Edytuj profil
                </button>
                <form method="POST" action="/api/auth/logout">
                  <button
                    type="submit"
                    className="bg-red-600/50 hover:bg-red-700 text-white px-4 py-2 w-full rounded-xl transition"
                  >
                    Log out
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>

      {/* POSTY */}
      <div className="space-y-4">
        <h2 className="text-xl text-white font-semibold">Posty użytkownika</h2>

        {profileUser.posts.length === 0 ? (
          <p className="text-gray-400">Brak postów.</p>
        ) : (
          // Tworzymy lokalny stan postów, żeby móc usuwać bez odświeżania
          <PostList posts={profileUser.posts} isOwnProfile={isOwnProfile} />
        )}
      </div>
    </div>
  );
}
