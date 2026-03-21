const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const { text } = require("stream/consumers");
const PORT = 3000;
app.use(cors());
app.use(express.json());

// YE SABSE ZAROORI HAI:
// Ye line browser ko batati hai ki Public folder ki saari files (CSS, JS) open hain


app.get("/", (req, res) => {
    // Sirf index.html bhejo, baaki files static middleware handle kar lega
res.send("Hii bro");
});

//const commands = [
//  {
//    name: "help",
//    response: ["Available commands:", "about", "projects", "resume"],
//  },
//  {
//    name: "about",
//   response: ["I am Programmer"]
//  },
//  {
//    name: "projects",
//    response: [
//      {text: "1. Road Project", link:"https://github.com/A-ghori/Road.git"},
//      {text: "2. Pacman Game", link: "https://github.com/A-ghori/PacMan.git"},
//      {text: "3. Rest API", link: "https://github.com/A-ghori/Rest_Api.git"}
//    ]
//  },
//  {
//    name : "resume",
//    response:[
//      {text: "See", link:"xyz"}
//    ]
//  }
//];

// Inspire from tree Data Structure -> VFS(virtual file system )
const root = {
  'home': {
    'user': {
      // Aapke naye folders yahan add ho gaye
     'help.txt':"This is tricky kinda thing to get actual paths to get my resume and projects links and all things, you must know the basic of linux to access my portfolio... for accesing contact - cat contact for accessing pictures - cd pictures password ",

      'documents': {
        'projects': {
          "road-projects": {
            type: 'file',
            content: "Built with React and Node.",
            link: "https://github.com/A-ghori/Road.git",
          },
          "pacman": {
            type: "file",
            content: "Classic Pacman game.",
            link: "https://github.com/A-ghori/PacMan.git"
          },
          "about.txt": "I am a Programmer",
          //"contact.txt": "Email: shubhayu@gmail.com"
        },
        "resume.txt": { type: "file", content: "My Professional Resume", link: "xyz" }
      },
      'downloads': {

      }, // Abhi khali hain, baad mein files daal sakte ho
      'pictures': {
        'secretcrush.img':{
          type: 'file',
          isProtected:true,
          link: "",
          isImage: true,
          password: "teri_maki_chu",
          hint: "MC-STAN-FAV-SLUNG"
        }
      },
      'music': {},
      'videos': {},
      'contact' : {
        type: 'file', 
        content: 'Email Me',
        link: "mailto:modulonodes@gmail.com"
      }
    }
  }
};

// State to track location
let currentPath = ["home", "user"];

// Helper navigation logic 
//let getDir = (patharr) => {
//  let curr = root;
//
//  for(let items of patharr){
//    curr = curr[items];
//    if(!curr) return null;
//  }
//  return curr;
//}




//let folders = ["Documents", "Downloads", "Pictures", "Music", "Videos","Contact"];
app.post("/test",(req,res)=>{
  const {command} = req.body;
  if(!command) return res.json({response: []});
  
  
const args = command.trim().split(" ");
    const cmd = args[0].toLowerCase();

 // const cmd = commands.find(c => c.name === userInput);
 
let currDir = root;
 for(let items of currentPath){
  currDir = currDir[items]; 
 }


 let response = [];

 switch(cmd) {
  case "ls" : 
  const items = Object.keys(currDir);
if(items.length > 0){
  response = [items.join("  ")];

}else {
  response = ["Empty ls"]
}
break;

case "pwd" : 
response = [ "/" + currentPath.join("/")];
break;
 case "cd":
  const target = args[1]; // User ne likha 'cd documents' toh target = 'documents'

  if (!target || target === "~") {
    currentPath = ["home", "user"]; // Home wapsi
    response = ["Moved to home directory"];
  } 
  else if (target === "..") {
    if (currentPath.length > 2) { // 'home/user' se piche mat jane dena
      currentPath.pop();
      response = ["Moved back"];
    } else {
      response = ["Already at home base"];
    }
  } 
  else {
    // Check karo ki kya wo folder currDir mein exist karta hai
    const folder = currDir[target]; 
    
    // Logic: Agar mil gaya, aur wo object hai, aur file nahi hai... toh wo folder hai!
    if (folder && typeof folder === 'object' && folder.type !== 'file') {
      currentPath.push(target);
      response = [`Entered into ${target}`];
    } else {
      response = [`cd: ${target}: No such directory`];
    }
  }
  break;

case "help" : 
response = ["Available Commands are : ls, pwd, cat, clear"]
break;

case "cat" :
  const filename = args[1];
  const userPassword = args[2];
  const file = currDir[filename];

  if(!filename) response = ["Usage : cat<filename><password if needed>"];
  else if(!file) response = [`Cat : ${filename} No Such Files in the directories`];
  else if(file.type === 'file'){
    if(!userPassword || userPassword !==file.password){
        response = [
          `Access Denied ${userPassword} you mf ${filename} is protected`,
          `Hint: ${file.hint || "No Hint Available"}` 
        ]
    } else {
          response = [{
            text : `Access granted! Opening ${filename}`,
            link: "",
            isImage: true,
    }]
    }
    }

  else if(file.type === 'file') response = [{
    text: file.content || "Opening the file...",
    link: file.link
  }]

  else if(typeof file === 'string') response = [file];

  else response = [`cat: ${filename}: Is a directory (Use 'cd' to enter)`];
break;
  
  default: 
response = [`Command not found ${cmd}`];
break
}
  res.json({success: true, response: response})
})


app.listen(PORT, ()=> {
  console.log(`Server is Running on Port ${PORT}`)
})
