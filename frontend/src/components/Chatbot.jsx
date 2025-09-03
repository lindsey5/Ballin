import { useState, useRef, useEffect, memo } from "react";
import { postData } from "../services/api";

const MessageContainer = memo(({ messages, loading, bottomRef }) => {
  return (
    <div className="flex-grow p-3 overflow-y-auto bg-gray-50">
      {messages.map((msg, index) => (
        <div
          key={index}
          ref={index === messages.length - 1 ? bottomRef : undefined}
          className={`flex items-end my-2 ${
            msg.from === "bot" ? "justify-start" : "justify-end"
          }`}
        >
          {/* Bot Avatar */}
          {msg.from === "bot" && (
            <img
              className="w-8 h-8 rounded-full mr-2"
              src="/ali.png"
              alt="bot"
            />
          )}

          {/* Message Bubble */}
          <div
            className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
              msg.from === "bot"
                ? "bg-white border border-gray-200 shadow-sm text-gray-900"
                : "bg-purple-600 text-white"
            }`}
          >
            <div
              className="relative"
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {loading && (
        <div className="flex items-center gap-2 my-2">
          <img className="w-8 h-8 rounded-full" src="/ali.png" alt="bot" />
          <div className="flex space-x-1 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
          </div>
        </div>
      )}
    </div>
  );
});


const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const bottomRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", content: "👋 Hi, I'm Ali. Welcome to Ballin! How can I help?" },
  ]);

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = message;
    setMessage("");
    setMessages((prev) => [...prev, { from: "user", content: newMessage }]);
    setLoading(true);

    const response = await postData(`/api/agent/chat`, { message: newMessage });
    if (response.success) {
      setMessages((prev) => [...prev, { from: "bot", content: response.response }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (bottomRef.current && messages.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed right-5 bottom-5 z-50">
      {/* Floating Button */}
      <button
        className="cursor-pointer hover:scale-110 transition-transform shadow-lg p-3 bg-white rounded-full shadow-lg shadow-purple-500"
        onClick={() => setOpen(!open)}
      >
        <img className="w-8 h-8 md:w-10 md:h-10" src="/speech-bubble.png" alt="Chat" />
      </button>

      {/* Chat Window */}
      {open && (
        <form
          className="bg-white absolute flex flex-col shadow-xl border border-gray-200 rounded-xl w-[90vw] sm:w-[380px] h-[70vh] bottom-[calc(100%+15px)] right-0 animate-fade-in-scale"
          onSubmit={submitMessage}
        >
          {/* Header */}
          <div className="flex items-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-t-xl">
            <img className="w-10 h-10 rounded-full border border-white" src="/ali.png" alt="Ali" />
            <span className="font-semibold">Ali • Support</span>
          </div>

          {/* Messages */}
          <MessageContainer messages={messages} loading={loading} bottomRef={bottomRef}/>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-gray-200 bg-white rounded-b-xl">
            <input
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              type="submit"
              className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition"
            >
              <img className="w-5 h-5 invert" src="/send.png" alt="send" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Chatbot;
