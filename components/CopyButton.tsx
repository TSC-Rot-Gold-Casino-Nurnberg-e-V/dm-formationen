"use client";

import { useState } from "react";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={twMerge(
        "inline-flex items-center gap-1 ml-2 p-0.5 rounded text-base-400 hover:text-base-300 hover:bg-base-700/50 transition-colors cursor-pointer",
        className,
      )}
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <CheckIcon className="size-4 text-green-400" />
      ) : (
        <DocumentDuplicateIcon className="size-4" />
      )}
    </button>
  );
}


