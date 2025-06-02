"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Modal from "@/components/modal";
import Spinner from "@/components/Spinner";

export default function Home() {
  type Post = {
    id: string;
    title: string;
    createdAt: string;
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const loadPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
    setLoadingPosts(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    loadPosts();
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black text-white">
      {isModalOpen && <Modal onClose={closeModal} />}

      <div className="px-8 sm:px-20 py-20 h-full">
        <div className="max-w-4xl mx-auto flex flex-col h-full">
          <h1 className="text-4xl mb-6">Posty:</h1>

          <div className="flex-1 overflow-auto flex flex-col gap-8 border-t border-gray-700 pt-4">
            {!loadingPosts ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="p-4 border-b border-gray-500 bg-black w-full hover:bg-blue-900 transition"
                >
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString("pl-PL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Link>
              ))
            ) : (
              <div className="flex justify-center mt-8">
                <Spinner size="w-14 h-14" />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-6 sm:right-20 lg:right-8 border border-white rounded-xl py-4 px-10 text-3xl cursor-pointer hover:bg-gray-800 transition bg-black"
        onClick={openModal}
      >
        Postuj
      </button>
    </div>
  );
}
