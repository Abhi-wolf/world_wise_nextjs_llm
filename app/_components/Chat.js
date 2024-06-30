"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const listRef = useRef(null);

  useEffect(() => {
    // if (messages.length)
    //   listRef.current?.scrollIntoView({
    //     behaviour: "smooth",
    //     block: "end",
    //   });

    // Add welcome message to list on initial render
    if (messages.length === 0) {
      messages.push({
        id: "welcome",
        role: "system",
        content: "Welcome to Wild Oasis! How can I help you today?",
      });
    }

    if (messages.length)
      listRef.current?.scrollIntoView({
        behaviour: "smooth",
        block: "end",
      });
  }, [messages]);

  return (
    <div className="flex flex-col justify-between w-[500px] h-[500px] fixed bottom-5 right-5 max-w-md py-4 mx-auto stretch scroll overflow-y-auto border-2 border-primary-700 rounded-2xl p-4 bg-primary-900">
      <div className="h-[380px] overflow-y-auto flex flex-col">
        {messages.map((m, index) => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === "user" ? (
              <span className="text-orange-400 font-semibold">User : </span>
            ) : (
              <span className="text-green-400 font-semibold">AI : </span>
            )}
            {m.role === "user"
              ? m.content
              : isLoading && messages.length === index + 1
              ? "Loading..."
              : m.content}
          </div>
        ))}

        <div ref={listRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex justify-center items-center self-end "
      >
        <input
          className="text-black  w-full max-w-sm p-2  border border-gray-300 rounded shadow-xl cursor-pointer disabled:cursor-wait"
          value={input}
          placeholder="Say something. .."
          disabled={isLoading}
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
