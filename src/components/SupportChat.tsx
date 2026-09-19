"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Bot, UserRound } from "lucide-react";
import { HorseshoeIcon } from "./Logo";

type Msg = { role: "user" | "bot"; content: string };

const SUGGESTIONS = [
  "At WiFi'ye bağlanır mı?",
  "Apartmana nasıl alırım?",
  "İade var mı?",
  "Teslimat kaç dakika?",
  "AtCoin gerçek para mı?",
  "Kedimle anlaşır mı?",
];

export default function SupportChat({
  initialMessages,
}: {
  initialMessages: Msg[];
}) {
  const [messages, setMessages] = useState<Msg[]>(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            role: "bot",
            content:
              "Merhaba! Ben AtBot 3000, kişisel at danışmanınız. Yazın, cevaplayayım — hızımız 27 dakikalık teslimatımızdan bile iyidir.",
          },
        ]
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || typing) return;
    setError("");
    setInput("");
    setMessages((m) => [...m, { role: "user", content }]);
    setTyping(true);
    try {
      const res = await fetch("/api/destek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-8),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "AtBot'a ulaşılamadı.");
        setTyping(false);
        return;
      }
      setMessages((m) => [...m, { role: "bot", content: data.reply }]);
    } catch {
      setError("Bağlantı koptu. AtBot muhtemelen molasında.");
    }
    setTyping(false);
  }

  return (
    <div className="sticker flex h-[560px] flex-col overflow-hidden rounded-3xl bg-white/85">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b-2 border-ink bg-ink px-5 py-3.5 text-cream">
        <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-hay bg-coffee text-hay">
          <HorseshoeIcon className="h-5 w-5" />
        </span>
        <div className="grow">
          <p className="font-display text-lg leading-none">AtBot 3000</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-cream/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Çevrimiçi — kişneme gecikmesi: 0 ms
          </p>
        </div>
        <Bot className="h-5 w-5 text-hay" />
      </div>

      {/* Mesajlar */}
      <div ref={boxRef} className="grow space-y-4 overflow-y-auto bg-parchment/60 p-4 sm:p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink ${
                m.role === "bot" ? "bg-hay" : "bg-grass text-cream"
              }`}
            >
              {m.role === "bot" ? (
                <HorseshoeIcon className="h-4 w-4" />
              ) : (
                <UserRound className="h-4 w-4" />
              )}
            </span>
            <div
              className={`max-w-[80%] whitespace-pre-line rounded-2xl border-2 border-ink px-4 py-2.5 text-sm font-medium leading-relaxed shadow-[2px_3px_0_#241708] ${
                m.role === "bot"
                  ? "rounded-tl-sm bg-white"
                  : "rounded-tr-sm bg-hay/80"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-hay">
              <HorseshoeIcon className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border-2 border-ink bg-white px-4 py-3 shadow-[2px_3px_0_#241708]">
              <span className="h-2 w-2 animate-bounce rounded-full bg-mocha" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-mocha [animation-delay:0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-mocha [animation-delay:0.3s]" />
              <span className="ml-1 text-xs font-bold text-mocha">AtBot kişniyor...</span>
            </div>
          </div>
        )}
        {error && (
          <p className="rounded-xl border-2 border-dashed border-brick/60 bg-[#ffe3df] px-3 py-2 text-center text-xs font-bold text-brick">
            {error}
          </p>
        )}
      </div>

      {/* Hazır sorular */}
      <div className="flex gap-2 overflow-x-auto border-t-2 border-dashed border-sand bg-white/60 px-4 py-2.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={typing}
            className="shrink-0 rounded-full border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold transition-colors hover:bg-hay disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t-2 border-ink bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder='Mesajını yaz... örn: "At apartmana sığar mı?"'
          className="grow rounded-xl border-2 border-ink bg-cream px-4 py-3 text-sm font-semibold outline-none placeholder:text-mocha/50 focus:ring-4 focus:ring-hay/40"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          className="sticker grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brick text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          aria-label="Gönder"
        >
          {typing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
}
