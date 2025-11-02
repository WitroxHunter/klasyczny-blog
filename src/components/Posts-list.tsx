import { useState } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  createdAt: Date;
}

interface PostListProps {
  posts: Post[];
  isOwnProfile: boolean;
}

function PostList({ posts: initialPosts, isOwnProfile }: PostListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const deletePost = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten post?")) return;

    try {
      setLoadingIds((prev) => [...prev, id]);
      const res = await fetch(`/api/posts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Nie udało się usunąć posta.");
        setLoadingIds((prev) => prev.filter((x) => x !== id));
        return;
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));
      setLoadingIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd podczas usuwania.");
      setLoadingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  return (
    <>
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex justify-between items-center bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:bg-gray-800 transition"
        >
          <Link href={`/post/${post.id}`} className="flex-1">
            <h3 className="text-white text-lg font-medium">{post.title}</h3>
            <p className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleString("pl-PL")}
            </p>
          </Link>

          {isOwnProfile && (
            <button
              onClick={() => deletePost(post.id)}
              disabled={loadingIds.includes(post.id)}
              className="text-red-500 hover:text-red-700 ml-4 transition cursor-pointer"
              title="Usuń post"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      ))}
    </>
  );
}

export default PostList;
