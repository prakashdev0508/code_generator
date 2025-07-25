import React, { useEffect, useState } from "react";
import Image from "next/image";

const simmilarMessages = [
  "Thinking...",
  "Analyzing...",
  "Processing...",
  "Generating...",
  "Building your website...",
  "Crafting your component...",
  "Adding fianl touches...",
  "Almost there...",
];

const MessageLoading = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % simmilarMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-4 ml-3">
      <div className="flex items-center gap-x-2 ml-3">
        <Image src="/logo2.png" alt="logo" width={20} height={20} />
        <span className="text-sm font-medium">Vibe</span>
      </div>
      <span className="text-sm text-muted-foreground animate-pulse ml-10">
        {simmilarMessages[currentMessageIndex]}
      </span>
    </div>
  );
};

export default MessageLoading;
