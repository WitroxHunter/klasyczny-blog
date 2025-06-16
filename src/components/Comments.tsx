// components/Comments.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ModalComment from "./Modal-comment"; // też clientowy
import { Comment } from "@prisma/client"; // jeśli masz typy

type CommentWithAuthor = Comment & {
  author?: {
    name: string | null;
  };
};

export const Comments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then(setComments);
  }, [postId]);

  const handleNewComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-semibold">Komentarze</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium px-4 py-2 rounded-xl"
        >
          Dodaj komentarz
        </button>
      </div>

      <ModalComment
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postId={postId}
        onCommentAdded={handleNewComment}
      />

      <ul className="space-y-2 mt-4">
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
              className="bg-zinc-800 p-4 rounded-xl text-white"
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
