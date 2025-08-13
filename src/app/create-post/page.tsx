"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Demo from "@/components/Color-picker";
import {
  Bold,
  Italic,
  List,
  Palette,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Strikethrough,
  Underline,
  Minus,
  Table,
  CheckSquare,
  Undo,
  Redo,
} from "lucide-react";
import MarkdownComponent from "@/components/Markdown-component";

export default function CreatePost() {
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  type FormData = { title: string; tags: []; content: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const [authorId, setAuthorId] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // ...

  const content = watch("content", "");

  const pushHistory = (newValue: string) => {
    setUndoStack((prev) => [...prev, content]); // zapisujemy poprzedni stan
    setRedoStack([]); // czyscimy redo
    setValue("content", newValue);
    setPreviewContent(newValue);
  };

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

    pushHistory(newText);

    requestAnimationFrame(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
      textarea.focus();
    });
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((stack) => stack.slice(0, -1));
    setRedoStack((stack) => [...stack, content]);
    setValue("content", prev);
    setPreviewContent(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((stack) => stack.slice(0, -1));
    setUndoStack((stack) => [...stack, content]);
    setValue("content", next);
    setPreviewContent(next);
  };

  const handleColorSelect = (color: string) => {
    insertAtCursor(`<span style="color:${color}">`, "</span>");
    setShowColorPicker(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!authorId) return alert("Nie udało się pobrać ID użytkownika.");

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, authorId }),
      });

      if (res.ok) window.location.href = "/";
      else {
        alert("Nie udało się opublikować posta.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd.");
      setIsSubmitting(false);
    }
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
          <div className="flex items-center gap-2 border-b border-gray-700 pb-2 mb-4 overflow-x-scroll">
            {/* Formatowanie */}
            {/* Cofnij */}
            <button
              onClick={handleUndo}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Cofnij (Undo)"
            >
              <Undo size={18} className="text-gray-300" />
            </button>

            {/* Ponów */}
            <button
              onClick={handleRedo}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Ponów (Redo)"
            >
              <Redo size={18} className="text-gray-300" />
            </button>

            {/* LINIA */}
            <div className="w-px h-6 bg-gray-700 mx-1 flex-shrink-0" />

            <button
              onClick={() => insertAtCursor("**", "**")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Pogrubienie: **tekst**"
            >
              <Bold size={18} className="text-gray-300" />
            </button>

            <button
              onClick={() => insertAtCursor("_", "_")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Kursywa: _tekst_"
            >
              <Italic size={18} className="text-gray-300" />
            </button>

            <button
              onClick={() => insertAtCursor("~~", "~~")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Przekreślenie: ~~tekst~~"
            >
              <Strikethrough size={18} className="text-gray-300" />
            </button>
            <button
              onClick={() => insertAtCursor("<u>", "</u>")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Underline: <u>tekst</u>"
            >
              <Underline size={18} className="text-gray-300" />
            </button>
            {/* Kolor */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              type="button"
              title="Wybierz kolor tekstu"
              className="p-2 hover:bg-gray-800 rounded"
            >
              <Palette size={18} className="text-gray-300" />
            </button>

            {/* LINIA */}
            <div className="w-px h-6 bg-gray-700 mx-1 flex-shrink-0" />

            {/* Nagłówki */}
            <button
              onClick={() => insertAtCursor("# ", "")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Nagłówek 1: # Tytuł"
            >
              <Heading1 size={18} className="text-gray-300" />
            </button>
            <button
              onClick={() => insertAtCursor("## ", "")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Nagłówek 2: ## Tytuł"
            >
              <Heading2 size={18} className="text-gray-300" />
            </button>
            <button
              onClick={() => insertAtCursor("### ", "")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Nagłówek 3: ### Tytuł"
            >
              <Heading3 size={18} className="text-gray-300" />
            </button>

            {/* LINIA */}
            <div className="w-px h-6 bg-gray-700 mx-1 flex-shrink-0" />

            {/* Listy */}
            <button
              onClick={() => insertAtCursor("\n- ")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Lista punktowana"
            >
              <List size={18} className="text-gray-300" />
            </button>
            <button
              onClick={() => insertAtCursor("\n1. ")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Lista numerowana"
            >
              <ListOrdered size={18} className="text-gray-300" />
            </button>
            <button
              onClick={() => insertAtCursor("\n- [ ] ")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title={`Lista z checkboxami:\n- [ ] pusty checkbox\n- [x] zaznaczony`}
            >
              <CheckSquare size={18} className="text-gray-300" />
            </button>

            {/* LINIA */}
            <div className="w-px h-6 bg-gray-700 mx-1 flex-shrink-0" />

            {/* Cytat */}
            <button
              onClick={() => insertAtCursor("\n> ", "")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
            >
              <Quote size={18} className="text-gray-300" />
            </button>

            {/* Kod */}
            <button
              onClick={() => insertAtCursor("`", "`")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Kod inline: \kod`"
            >
              <Code size={18} className="text-gray-300" />
            </button>
            <button
              onClick={() => insertAtCursor("\n```js\n", "\n```")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Blok kodu: język"
            >
              <Code size={18} className="text-blue-300" />
            </button>

            {/* LINIA */}
            <div className="w-px h-6 bg-gray-700 mx-1 flex-shrink-0" />
            {/* Linie */}
            <button
              onClick={() => insertAtCursor("\n---\n")}
              type="button"
              className="p-2 hover:bg-gray-800 rounded"
              title="Linia pozioma: ---"
            >
              <Minus size={18} className="text-gray-300" />
            </button>

            {/* Tabela */}
            <button
              onClick={() =>
                insertAtCursor(
                  `\n| Kolumna 1 | Kolumna 2 |\n|-----------|-----------|\n| Wartość 1 | Wartość 2 |\n`
                )
              }
              type="button"
              title="Tabela - dodaj kolumny i wiersze kopiując schemat"
              className="p-2 hover:bg-gray-800 rounded"
            >
              <Table size={18} className="text-gray-300" />
            </button>

            {/* Media */}
            <button
              onClick={() => insertAtCursor('<img src="" alt="">')}
              type="button"
              title="Obrazek: <img src=...>"
              className="p-2 hover:bg-gray-800 rounded"
            >
              <ImageIcon size={18} className="text-gray-300" />
            </button>
            <button
              onClick={() => insertAtCursor('<a href="">', "</a>")}
              type="button"
              title="Link: <a href=...>tekst</a>"
              className="p-2 hover:bg-gray-800 rounded"
            >
              <LinkIcon size={18} className="text-gray-300" />
            </button>
          </div>

          {showColorPicker && (
            <div
              ref={colorPickerRef}
              className="ml-80 absolute z-50 bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <Demo onColorSelect={handleColorSelect} />
            </div>
          )}

          {/* TEXTAREA */}
          <textarea
            {...register("content", {
              required: "Treść jest wymagana",
              minLength: { value: 6, message: "Minimum 6 znaków" },
            })}
            ref={textareaRef}
            value={content}
            onChange={(e) => pushHistory(e.target.value)}
            placeholder="Napisz tutaj treść swojego posta..."
            className="flex-1 w-full text-lg bg-transparent text-white border-none outline-none placeholder-gray-500 resize-none"
          />

          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 px-5 py-2 rounded-lg text-white font-medium ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Publikowanie..." : "Opublikuj post"}
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
