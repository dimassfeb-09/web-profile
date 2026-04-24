"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Check } from "lucide-react";

// Custom SVG Icons for Brands
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ChatGPTIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
  </svg>
);

const ClaudeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
      fillRule="nonzero"
    />
  </svg>
);

const GeminiIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
      fill="#3186FF"
    />
    <path
      d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
      fill="url(#gemini-gradient-1)"
    />
    <path
      d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
      fill="url(#gemini-gradient-2)"
    />
    <path
      d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
      fill="url(#gemini-gradient-3)"
    />
    <defs>
      <linearGradient
        id="gemini-gradient-1"
        x1="7"
        y1="15.5"
        x2="11"
        y2="12"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#08B962" />
        <stop offset="1" stopColor="#08B962" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="gemini-gradient-2"
        x1="8"
        y1="5.5"
        x2="11.5"
        y2="11"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F94543" />
        <stop offset="1" stopColor="#F94543" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="gemini-gradient-3"
        x1="3.5"
        y1="13.5"
        x2="17.5"
        y2="12"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FABC12" />
        <stop offset=".46" stopColor="#FABC12" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

interface QuoteShareProps {
  authorName: string;
}

export default function QuoteShare({ authorName }: QuoteShareProps) {
  const [selection, setSelection] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setSelection(null);
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Check if the selection is within a blog content area (optional but recommended)
    // For now, we'll just show it if there's selection

    // Hide if selection is under the navbar (approx 100px)
    if (rect.top < 100) {
      setSelection(null);
      return;
    }

    setSelection({
      text: sel.toString().trim(),
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY - 10, // Absolute position in document
    });
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);
    document.addEventListener("selectionchange", handleSelection);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, [handleSelection]);

  const getFormattedQuote = () => {
    if (!selection) return "";
    const url = window.location.href;
    return `"${selection.text}" - ${authorName}\nSource: ${url}`;
  };

  const handleCopy = async () => {
    if (!selection) return;
    const quote = getFormattedQuote();

    try {
      // Priority 1: Navigator Clipboard (Requires HTTPS/Localhost)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(quote);
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (err) {
      // Priority 2: Fallback using execCommand (Works on HTTP/Mobile IP)
      const textArea = document.createElement("textarea");
      textArea.value = quote;

      // Ensure it's not visible
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
      } catch (copyErr) {
        console.error("Fallback copy failed", copyErr);
      }

      document.body.removeChild(textArea);
    }

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setSelection(null);
    }, 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (selection) {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed) {
          const range = sel.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.top < 100) {
            setSelection(null);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selection]);

  const handleTwitterShare = () => {
    const quote = getFormattedQuote();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      quote,
    )}`;
    window.open(url, "_blank");
    setSelection(null);
  };

  const handleWhatsAppShare = () => {
    const quote = getFormattedQuote();
    const url = `https://wa.me/?text=${encodeURIComponent(quote)}`;
    window.open(url, "_blank");
    setSelection(null);
  };

  const handleFacebookShare = () => {
    const url = window.location.href;
    const quote = getFormattedQuote();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url,
    )}&quote=${encodeURIComponent(quote)}`;
    window.open(fbUrl, "_blank");
    setSelection(null);
  };

  const handleAIShare = (type: "gpt" | "claude" | "gemini") => {
    const text = selection?.text || "";
    const prompt = `Can you explain or give more context about this: "${text}"`;
    let url = "";

    switch (type) {
      case "gpt":
        url = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
        break;
      case "claude":
        url = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
        break;
      case "gemini":
        url = `https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`;
        break;
    }

    window.open(url, "_blank");
    setSelection(null);
  };

  if (!selection) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-[40] -translate-x-1/2 -translate-y-full pb-4 animate-in fade-in zoom-in duration-200 pointer-events-auto"
      style={{
        left: selection.x,
        top: selection.y,
      }}
    >
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high shadow-2xl border border-outline-variant/20 backdrop-blur-md">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-on-surface hover:bg-primary/10 hover:text-primary transition-all"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copied!" : "Copy Quote"}
        </button>
        <div className="w-px h-4 bg-outline-variant/30" />
        <button
          onClick={handleTwitterShare}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-black/10 hover:text-black transition-all"
          title="Share on X"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleWhatsAppShare}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-green-500/10 hover:text-green-600 transition-all"
          title="Share on WhatsApp"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFacebookShare}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-blue-600/10 hover:text-blue-600 transition-all"
          title="Share on Facebook"
        >
          <FacebookIcon className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-outline-variant/30" />

        <button
          onClick={() => handleAIShare("gpt")}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-[#10a37f]/10 hover:text-[#10a37f] transition-all"
          title="Ask ChatGPT"
        >
          <ChatGPTIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleAIShare("claude")}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-[#d97757]/10 hover:text-[#d97757] transition-all"
          title="Ask Claude"
        >
          <ClaudeIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleAIShare("gemini")}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-[#1a73e8]/10 hover:text-[#1a73e8] transition-all"
          title="Ask Gemini"
        >
          <GeminiIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Arrow */}
      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-surface-container-high border-r border-b border-outline-variant/20 rotate-45" />
    </div>
  );
}
