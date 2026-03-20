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
     const res = await axios.post("http://localhost:3000/test", {command: userCommand});
        const botResponse = res.data.response;
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
                {line.content.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={line.type === 'user' ? 'user-text' : 'bot-text'}
                    // User text ko direct render karo (Safety) aur Bot text ko dangerously
                    dangerouslySetInnerHTML={{ __html: item.text || item }} 
                  />
                ))}
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
      </div>
    );
}
export default Terminal;