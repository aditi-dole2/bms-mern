import React, { useState, useEffect, useRef, } from "react";
import { useNavigate } from "react-router-dom"; 

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const navigateTo = useNavigate(); // Use useNavigate hook for navigation

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

      const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { from: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
          const response = await fetch("http://localhost:5000/chatbox/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
          });
          const data = await response.json();
          if (response.ok) {
            if (data.navigateTo) {
              setMessages((prev) => [...prev, { from: "bot", text: data.reply, linkTo: data.navigateTo }]);
            } else {
              setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
            }
          } else {
            setMessages((prev) => [
              ...prev,
              { from: "bot", text: "Sorry, something went wrong." },
            ]);
          }
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Sorry, failed to connect to server." },
          ]);
        }
      };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          fontSize: "30px",
          cursor: "pointer",
          zIndex: 1000,
        }}
        aria-label="Toggle Chatbox"
      >
        💬
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              fontSize: "14px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "15px",
                      backgroundColor:
                        msg.from === "user" ? "#007bff" : "#e5e5ea",
                      color: msg.from === "user" ? "white" : "black",
                      maxWidth: "80%",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.text}
                    {msg.linkTo && (
                      <>
                        {" "}
                        <a
                          href="#!"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo(msg.linkTo);
                          }}
                          style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
                        >
                          Click here
                        </a>
                      </>
                    )}
                  </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div
            style={{
              borderTop: "1px solid #ccc",
              padding: "10px",
              display: "flex",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              style={{
                flex: 1,
                resize: "none",
                borderRadius: "15px",
                border: "1px solid #ccc",
                padding: "8px 12px",
                fontSize: "14px",
                outline: "none",
              }}
              rows={1}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "15px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
