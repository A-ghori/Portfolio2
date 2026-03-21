import React, { useState, useEffect, useRef } from "react";
import TypewriterASCII from "./TypeWritterAscii.jsx";
import axios from "axios";



const welcomeArt = `
  _____ _    _ _    _ ____  _    _           驰_   _ 
 / ____| |  | | |  | |  _ \\| |  | |   /\\    \\ \\_/ / | |  | |
| (___ | |__| | |  | | |_) | |__| |  /  \\    \\   /  | |  | |
 \\___ \\|  __  | |  | |  _ <|  __  | / /\\ \\    | |   | |  | |
 ____) | |  | | |__| | |_) | |  | |/ ____ \\   | |   | |__| |
|_____/|_|  |_|\\____/|____/|_|  |_/_/    \\_\\  |_|    \\____/ 
`;

function Terminal() {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [showImage, setShowImage] = useState(null); // Image URL store karne ke liye
    const bottomRef = useRef(null);
const terminalPrompt = "user@Linux:~$";
    // Auto-scroll whenever history updates
   // useEffect(() => {
     //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //}, [history]);

    // Initial Welcome Message
 // useEffect(() => {
   // const welcomeMessage = [
     //   {type: "bot", content: [welcomeArt], isAscii: true},
       // {type: "bot", content: ["Welcome Stranger! Type 'help' to see available commands."]}
    //];
    //setHistory(welcomeMessage);
  //},[]);

  const handleCommand = async (e) => {
    if(e.key === "Enter"){
        const userCommand = input.trim().toLowerCase();
        if(!userCommand) return;
       if (userCommand === "clear") {
                setHistory([]);
                setInput('');
                return;
            }
        // Add usercommand to history
        setHistory(prev => [...prev, {type: "user", content: [`user@Linux:~$ ${userCommand}`]}]);
        setInput(''); // Clear input after adding to history
        // Handle Commands
try{
  const API_URL = "https://portfolio2-ei5x.onrender.com/test";  
  const res = await axios.post(API_URL, {command: userCommand});
        const botResponse = res.data.response;
        botResponse.forEach(item => {
          if(item.isImage){
            setShowImage(item.link)
          }
        });
        setHistory(prev => [...prev, {type : "bot", content: botResponse}]);
}catch(err){
    setHistory(prev => [...prev, {type: "bot", content: "Command Not Found!"}]);
    console.error(err)
}
    }
  }
return (
      <div className="terminal">
        <div className="history-container">
          <div className="welcome-area">
            <TypewriterASCII text={welcomeArt} speed={1} />
            <p style={{ marginTop: '10px' }}>Welcome Stranger! Type 'help' to start.</p>
          </div>
<div className="history-area">
  {history.map((line, i) => (
    <div key={i}>
      {/* 1. Check karo ki line aur line.content exist karte hain ya nahi */}
      {line && line.content && Array.isArray(line.content) ? (
        line.content.map((item, idx) => {
          const isLink = typeof item === 'object' && item !== null && item.link;
          const displayContent = isLink 
            ? `${item.text}: <a href="${item.link}" target="_blank" style="color: cyan;">${item.link}</a>` 
            : item;

          return (
            <div 
              key={idx} 
              className={line.type === 'user' ? 'user-text' : 'bot-text'}
              dangerouslySetInnerHTML={{ __html: displayContent }} 
            />
          );
        })
      ) : (
        // 2. Agar content nahi hai, toh kuch mat dikhao ya error handle karo
        <div className="bot-text">Error: Invalid response format</div>
      )}
    </div>
  ))}
</div>
          <div ref={bottomRef} />
        </div>

        {/* 2. Input Section - Prompt change kar diya */}
        <div className="input-line">
          <span className="prompt">{terminalPrompt}&nbsp;</span>
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={handleCommand}
            autoFocus 
          />
        </div>



        {/* Image Modal Popup */}
{showImage && (
    <div className="modal-overlay" onClick={() => setShowImage(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setShowImage(null)}>&times;</span>
            <img src={showImage} alt="Private" className="terminal-img" />
            <p style={{ color: 'cyan', marginTop: '10px' }}>[ Image Accessed Successfully ]</p>
        </div>
    </div>
)}
      </div>
    );
}
export default Terminal;