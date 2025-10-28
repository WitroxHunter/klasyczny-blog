"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { Search, Calendar, Plus } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const loadPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
    setLoadingPosts(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-1" />

            <input
              type="text"
              placeholder="Search posts, authors, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition shadow-xl"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {loadingPosts ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="w-14 h-14" />
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
              >
                {/* Header with Title and Date */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <Link href={`/post/${post.id}`} className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 shrink-0">
                    <Calendar className="w-4 h-4" />
                    <time className="hidden sm:inline">
                      {new Date(post.createdAt).toLocaleString("pl-PL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    <time className="sm:hidden">
                      {new Date(post.createdAt).toLocaleString("pl-PL", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>

                {/* Author */}
                <Link
                  href={`/profile/${post.author.name}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white transition-colors duration-300 flex items-center justify-center font-bold text-xs shadow-md">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 font-medium hover:text-white transition-colors">
                      {post.author.name}
                    </span>
                  </div>
                </Link>

                {/* Content Preview */}
                <Link href={`/post/${post.id}`} className="block">
                  <div className="text-gray-400 leading-relaxed prose prose-invert prose-sm max-w-none">
                    <MarkdownPostPreview content={post.content} />
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <span className="text-blue-400 hover:text-blue-300 font-medium text-sm inline-flex items-center gap-2 group/btn">
                      Read full post
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg mb-2">No posts found</div>
              <div className="text-gray-600 text-sm">
                Try adjusting your search query
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Button */}
      <Link
        href="/create-post"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-950 text-white rounded-2xl px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-300 flex items-center gap-3 font-semibold text-base sm:text-lg group z-50"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
        <span className="hidden sm:inline">Post</span>
      </Link>
    </div>
  );
}
