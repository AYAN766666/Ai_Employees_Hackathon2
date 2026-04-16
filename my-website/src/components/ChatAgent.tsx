import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'agent';
  text: string;
}

interface ChatAgentProps {
  bookName: string;
}

export default function ChatAgent3D({ bookName }: ChatAgentProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: inputMessage }]);
    setInputMessage('');
    setLoading(true);
    setError(null);
    setIsTyping(true);

    try {
      const response = await fetch('https://ayanu8-ai-book-deploy.hf.space/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        { sender: 'agent', text: data.response || 'No response from agent.' },
      ]);
    } catch (e: any) {
      setIsTyping(false);
      setError(e.message);
      setMessages((prev) => [
        ...prev,
        { sender: 'agent', text: 'Error contacting agent.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= FLOATING BUTTON ================= */}
      <motion.div
        whileHover={{ scale: 1.15, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
          backgroundSize: '200% 200%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)',
          zIndex: 9999,
          animation: 'gradientShift 3s ease infinite, pulseGlow 2s ease-in-out infinite',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>
          {open ? '✕' : '🤖'}
        </span>
      </motion.div>

      {/* ================= CHAT WINDOW ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: '110px',
              right: '25px',
              zIndex: 10000,
              width: '400px',
              maxWidth: 'calc(100vw - 50px)',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '0',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.2)',
                color: '#f1f1f1',
                overflow: 'hidden',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  padding: '16px 20px',
                  borderRadius: '24px 24px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    style={{ fontSize: '28px' }}
                  >
                    🤖
                  </motion.div>
                  <div>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700' }}>
                      AI Book Assistant
                    </h3>
                    <p style={{ margin: '0', fontSize: '11px', opacity: 0.9 }}>
                      Powered by Groq AI • Online
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Chat Box */}
              <div
                style={{
                  height: '350px',
                  overflowY: 'auto',
                  padding: '20px',
                  background: 'linear-gradient(to bottom, #1a1a1a, #222)',
                }}
              >
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ fontSize: '48px', marginBottom: '16px' }}
                    >
                      📚
                    </motion.div>
                    <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>
                      Hi! I'm your AI assistant for<br />
                      <strong style={{ color: '#a855f7' }}>Physical AI & Humanoid Robotics</strong>
                    </p>
                    <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
                      Ask me anything about the book!
                    </p>
                  </motion.div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        textAlign: msg.sender === 'user' ? 'right' : 'left',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          maxWidth: '85%',
                          flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: msg.sender === 'user' 
                              ? 'linear-gradient(135deg, #06b6d4, #22d3ee)' 
                              : 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            flexShrink: 0,
                          }}
                        >
                          {msg.sender === 'user' ? '👤' : '🤖'}
                        </div>
                        <span
                          style={{
                            background:
                              msg.sender === 'user'
                                ? 'linear-gradient(135deg, #06b6d4, #22d3ee)'
                                : 'rgba(99, 102, 241, 0.2)',
                            padding: '10px 14px',
                            borderRadius: msg.sender === 'user' 
                              ? '16px 16px 4px 16px' 
                              : '16px 16px 16px 4px',
                            display: 'inline-block',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            color: msg.sender === 'user' ? '#000' : '#fff',
                            border: msg.sender === 'agent' ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
                            wordWrap: 'break-word',
                          }}
                        >
                          {msg.text}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{ textAlign: 'left', marginBottom: '12px' }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          maxWidth: '85%',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            flexShrink: 0,
                          }}
                        >
                          🤖
                        </div>
                        <div
                          style={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            padding: '12px 18px',
                            borderRadius: '16px 16px 16px 4px',
                            display: 'flex',
                            gap: '6px',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                          }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}
                          />
                          <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}
                          />
                          <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={chatEndRef} />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(255, 107, 107, 0.1)',
                      borderLeft: '3px solid #ff6b6b',
                      color: '#ff6b6b',
                      fontSize: '12px',
                    }}
                  >
                    ⚠️ {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Box */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'rgba(30, 30, 30, 0.8)',
                  borderTop: '1px solid rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about the book..."
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '20px',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    background: 'rgba(40, 40, 40, 0.8)',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a855f7';
                    e.target.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={loading || !inputMessage.trim()}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: 'none',
                    background: inputMessage.trim()
                      ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                      : 'rgba(99, 102, 241, 0.2)',
                    color: '#fff',
                    cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    opacity: inputMessage.trim() ? 1 : 0.5,
                  }}
                >
                  ➤
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
