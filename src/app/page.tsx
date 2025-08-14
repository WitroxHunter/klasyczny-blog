"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import MarkdownPostPreview from "@/components/Markdown-post-preview";

export default function Home() {
  type Post = {
    id: string;
    content: string;
    title: string;
    createdAt: string;
    author: {
      name: string;
    };
  };

  const [posts, setPosts] = useState<Post[]>([]);
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

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black text-white">
      <div className="px-8 sm:px-20 py-20 h-full">
        <div className="max-w-4xl mx-auto flex flex-col h-full">
          <h1 className="text-4xl mb-6">Posty:</h1>

          <div className="flex-1 overflow-auto flex flex-col gap-8 pt-4">
            {!loadingPosts ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="p-4 border border-gray-700 rounded-xl bg-zinc-900 w-full hover:bg-blue-900 transition relative overflow-x-clip"
                >
                  {/* Tytuł */}
                  <div className="text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis pr-24">
                    {post.title}
                  </div>

                  {/* Data w prawym górnym rogu */}
                  <div className="absolute top-4 right-4 text-gray-400 text-sm">
                    {new Date(post.createdAt).toLocaleString("pl-PL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {/* Autor pod tytułem */}
                  <div className="text-sm text-gray-400 mb-1">
                    {post.author.name}
                  </div>

                  {/* Treść posta */}
                  <MarkdownPostPreview content={post.content} />
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
      <Link
        href={"/create-post"}
        className="fixed bottom-6 right-8 border border-white rounded-xl py-4 px-10 text-3xl cursor-pointer hover:bg-gray-800 transition bg-black"
      >
        Postuj
      </Link>
    </div>
  );
}
