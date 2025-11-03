"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Comment } from "@prisma/client";

type CommentWithAuthor = Comment & {
  author?: {
    name: string | null;
  };
};

export const Comments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorId, setAuthorId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then(setComments);
  }, [postId]);

  const fetchAuthorId = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setAuthorId(data.user.id);
        return data.user.id;
      }
      return null;
    } catch (err) {
      console.error("Błąd pobierania użytkownika:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    let id = authorId;
    if (!id) {
      id = await fetchAuthorId();
      if (!id) return;
    }

    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ postId, content, authorId: id }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setComments((prev) => [data, ...prev]);
    setContent("");
    setLoading(false);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-semibold">Komentarze</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium px-4 py-2 rounded-xl"
          >
            Dodaj komentarz
          </button>
        )}
      </div>

      {showForm && (
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Treść komentarza..."
            className="w-full h-24 p-3 rounded-xl bg-zinc-800 text-white mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl disabled:opacity-50"
            >
              {loading ? "Dodawanie..." : "Dodaj komentarz"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white transition"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-2 mt-4">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm">Brak komentarzy</p>
        )}

        {comments.map((comment) => {
          const date = new Date(comment.createdAt);
          const formattedDate = date.toLocaleString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <li
              key={comment.id}
              className="bg-gray-800/50  p-4 rounded-xl text-white"
            >
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <Link href={`/profile/${comment.author?.name}`}>
                  <span>{comment.author?.name || "Nieznany autor"}</span>
                </Link>
                <span>{formattedDate}</span>
              </div>
              <p className="text-white whitespace-pre-wrap">
                {comment.content}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
