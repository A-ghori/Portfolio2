const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const PORT = 3000;
app.use(cors());
app.use(express.json());

// YE SABSE ZAROORI HAI:
// Ye line browser ko batati hai ki Public folder ki saari files (CSS, JS) open hain


app.get("/", (req, res) => {
    // Sirf index.html bhejo, baaki files static middleware handle kar lega
res.send("Hii bro");
});

const commands = [
  {
    name: "help",
    response: ["Available commands:", "about", "projects", "resume"],
  },
  {
    name: "about",
   response: ["I am Programmer"]
  },
  {
    name: "projects",
    response: [
      {text: "1. Road Project", link:"https://github.com/A-ghori/Road.git"},
      {text: "2. Pacman Game", link: "https://github.com/A-ghori/PacMan.git"},
      {text: "3. Rest API", link: "https://github.com/A-ghori/Rest_Api.git"}
    ]
  },
  {
    name : "resume",
    respose:[
      {text: "See", link:"xyz"}
    ]
  }
];

app.post("/test",(req,res)=>{
  const userInput = req.body.command.toLowerCase().trim();
  const cmd = commands.find(c => c.name === userInput);

if (!req.body || !req.body.command) {
        return res.status(400).json({ success: false, message: "Bhai, command bhejo!" });
    }

if(cmd){
   //let htmlContent = "";
// for(let line of cmd.responses){
  
// }
  
  res.json({success: true, response: cmd.response})
} else {
   res.status(400).send({success: false, message: "Command Not Found"});
}
})


app.listen(PORT, ()=> {
  console.log(`Server is Running on Port ${PORT}`)
})
