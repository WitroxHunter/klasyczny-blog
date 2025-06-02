"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
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
    <div>
      {isModalOpen && <Modal onClose={closeModal} />}

      <div className="px-8 sm:px-20 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl mb-8">Posty:</h1>

          {!loadingPosts ? (
            <>
              <div className="overflow-auto flex flex-col gap-8 max-h-[75vh]">
                {posts.map((post) => (
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
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center ">
                <Spinner size="w-14 h-14" />
              </div>
            </>
          )}

          <button
            className="mt-8 border border-white rounded-xl py-2 px-4 cursor-pointer hover:bg-gray-800 transition"
            onClick={openModal}
          >
            Postuj
          </button>
        </div>
      </div>
    </div>
  );
}
