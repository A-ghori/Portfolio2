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
        setHistory(prev => [...prev, {type: "user", content: [`> ${userCommand}`]}]);
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
        <div className="terminal" style={{ background: '#000', color: '#0f0', height: '100vh', padding: '20px', overflowY: 'auto', fontFamily: 'monospace' }}>
            
            {/* --- FIXED SECTION: ASCII Welcome (Yeh kabhi clear nahi hoga) --- */}
            <div className="welcome-area">
                <TypewriterASCII text={welcomeArt} speed={1} />
                <div style={{ color: '#0f0', marginBottom: '20px' }}>
                    Welcome Stranger! Type 'help' to see available commands.
                </div>
            </div>

            {/* --- DYNAMIC SECTION: History (Sirf yahi clear hoga) --- */}
            <div className="history-area">
                {history.map((line, i) => (
                    <div key={i} style={{ marginBottom: '10px' }}>
                        {line.content?.map((item, idx) => {
                            const isObject = typeof item === 'object' && item !== null;
                            const displayContent = isObject 
                                ? `${item.text} - <a href="${item.link}" target="_blank" style="color: cyan;">${item.link}</a>` 
                                : item;

                            return (
                                <div key={idx} 
                                     style={{ color: line.type === 'user' ? '#fff' : '#0f0' }}
                                     dangerouslySetInnerHTML={{ __html: displayContent }} 
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* --- INPUT AREA --- */}
            <div className="input-area" style={{ display: 'flex', marginTop: '10px' }}>
                <span style={{ color: '#0f0' }}>&gt;&nbsp;</span>
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={handleCommand}
                    style={{ background: 'transparent', border: 'none', color: '#0f0', outline: 'none', width: '100%', fontFamily: 'monospace', fontSize: '16px' }}
                    autoFocus
                />
            </div>
            <div ref={bottomRef} style={{ height: '50px' }} />
        </div>
    );
}

export default Terminal;