import React, { useState, useEffect } from 'react';

const TypewriterASCII = ({ text, speed = 2 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    setDisplayedText(""); // Reset text on start
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        // ASCII characters ko ek-ek karke add karo
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval); // Typing khatam
        setIsTyping(false);
      }
    }, speed); // Speed milliseconds mein (jitna kam, utna tez)

    // Cleanup function loop rokne ke liye
    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return (
    <div className="ascii-container">
      <pre className={`ascii-art ${isTyping ? 'typing' : 'finished'}`}>
        {displayedText}
        {/* Typing ke waqt cursor blink karega */}
        {isTyping && <span className="ascii-cursor">█</span>}
      </pre>
    </div>
  );
};

export default TypewriterASCII;