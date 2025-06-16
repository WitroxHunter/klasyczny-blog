"use client";

import { useState, useEffect } from "react";
import type { Comment } from "@prisma/client";

type CommentWithAuthor = Comment & {
  author?: {
    name: string | null;
  };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onCommentAdded: (comment: CommentWithAuthor) => void;
};

export default function ModalComment({
  isOpen,
  onClose,
  postId,
  onCommentAdded,
}: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorId, setAuthorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorId = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setAuthorId(data.user.id);
        } else {
          console.error("Nie udało się pobrać danych użytkownika");
        }
      } catch (err) {
        console.error("Błąd pobierania danych użytkownika:", err);
      }
    };

    fetchAuthorId();
  }, []);

  const handleSubmit = async () => {
    if (!authorId) return;

    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ postId, content, authorId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    onCommentAdded(data);
    setContent("");
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-white text-xl mb-4">Dodaj komentarz</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-24 p-3 rounded-xl bg-zinc-800 text-white"
          placeholder="Treść komentarza..."
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl"
        >
          {loading ? "Dodawanie..." : "Dodaj komentarz"}
        </button>
      </div>
    </div>
  );
}
