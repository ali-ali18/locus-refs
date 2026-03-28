"use client";

import { Check, Copy } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "../../button";

export function CopyContent({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      {copied ? <Icon icon={Check} /> : <Icon icon={Copy} />}
    </Button>
  );
}
