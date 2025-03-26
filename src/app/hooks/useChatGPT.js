import { useState, useEffect, useRef } from "react";
import { useHandleStreamResponse } from "../../utilities/runtime-helpers";

const useChatGPT = () => {
    const initialContent = "Welcome to your daily spiritual guide. Let me begin with a prayer for you."
const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [hasGeneratedDailyPrayer, setHasGeneratedDailyPrayer] = useState(false);
  const [promptContent, setPromptContent] = useState(initialContent);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: (message) => {
      const processedMessage = message.replace(/\*\*/g, " ** ");
      setStreamingMessage(processedMessage);
    },
    onFinish: (message) => {
      const processedMessage = message.replace(/\*\*/g, " ** ");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: processedMessage },
      ]);
      setPromptContent(processedMessage)
      setStreamingMessage("");
    },
  });

  const fetchChatGPT = async (prompt, systemRole) => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemRole },
            { role: "user", content: prompt },
          ],
          stream: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");
      await handleStreamResponse(response);
    } catch (err) {
      setError("Failed to generate response. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDailyPrayer = async (prompt) => {
    if (hasGeneratedDailyPrayer || isLoading) return;
    setIsLoading(true);
    setHasGeneratedDailyPrayer(true);

    try {
      await fetchChatGPT(
        prompt,
        `You are a spiritual assistant dedicated to Orthodox Christian teachings. Generate a unique, meaningful, and concise daily prayer.`
      );
    } catch (err) {
      setError("Failed to generate prayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    messages,
    streamingMessage,
    fetchChatGPT,
    generateDailyPrayer,
    promptContent
  };
}

export default useChatGPT;