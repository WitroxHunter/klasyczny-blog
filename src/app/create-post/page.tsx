"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import MarkdownComponent from "@/components/Markdown-component";

export default function CreatePost() {
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchAuthorId = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setAuthorId(data.user.id);
        }
      } catch (err) {
        console.error("Błąd pobierania danych użytkownika:", err);
      }
    };
    fetchAuthorId();
  }, []);

  type FormData = {
    title: string;
    tags: [];
    content: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>();

  const content = watch("content", "");

  const insertAtCursor = (before: string, after = "") => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const newText =
      text.substring(0, start) +
      before +
      text.substring(start, end) +
      after +
      text.substring(end);

    setValue("content", newText);
    setPreviewContent(newText);

    requestAnimationFrame(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
      textarea.focus();
    });
  };

  const onSubmit = async (data: FormData) => {
    if (!authorId) return alert("Nie udało się pobrać ID użytkownika.");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, authorId }),
    });

    if (res.ok) window.location.href = "/";
  };

  return (
    <div className="pt-[64px] h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full">
        {/* LEFT */}
        <div className="w-1/2 p-4 flex flex-col border-r border-gray-500">
          <input
            {...register("title", { required: "Tytuł jest wymagany" })}
            placeholder="Tytuł posta..."
            className="text-2xl font-bold text-white bg-transparent border-none outline-none placeholder-gray-500 mb-4"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          {/* TOOLBAR */}
          <div className="flex items-center gap-2 border-b border-gray-700 pb-2 mb-4">
            <button
              type="button"
              onClick={() => insertAtCursor("**", "**")}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <Bold size={18} className="text-gray-300" />
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("_", "_")}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <Italic size={18} className="text-gray-300" />
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("\n- ")}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <List size={18} className="text-gray-300" />
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("\n1. ")}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <ListOrdered size={18} className="text-gray-300" />
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor('<img src="" alt="">')}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <ImageIcon size={18} className="text-gray-300" />
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor('<a href="">', "</a>")}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <LinkIcon size={18} className="text-gray-300" />
            </button>
          </div>

          <textarea
            {...register("content", {
              required: "Treść jest wymagana",
              minLength: { value: 6, message: "Minimum 6 znaków" },
            })}
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setValue("content", e.target.value);
              setPreviewContent(e.target.value);
            }}
            placeholder="Napisz tutaj treść swojego posta..."
            className="flex-1 w-full text-lg bg-transparent text-white border-none outline-none placeholder-gray-500 resize-none"
          />

          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
          <button
            type="submit"
            className="mt-4 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Opublikuj post
          </button>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 p-4 overflow-y-auto">
          <MarkdownComponent content={previewContent} />
        </div>
      </form>
    </div>
  );
}
