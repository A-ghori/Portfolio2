 const input = document.getElementById('command-input');

const output = document.getElementById('output');

//document.addEventListner('click',()=> input.focus());

// Spelling fixed: addEventListener

input.addEventListener('keydown', async(e) => {

if(e.key === "Enter"){

  const userInput = input.value.trim()

  input.value = "";


  try{

    const response = await fetch('http://localhost:3000/test', {

    method: "POST",

    headers: { "Content-Type": "application/json" }, // Yahan 's' hona chahiye

    body: JSON.stringify({ command: userInput })

});

    const data = await response.json();

const resultDiv = document.createElement('div');

            // Backend se "html" aa raha hai toh:

            resultDiv.innerHTML = data.html || data.response.join('<br>'); 

            output.appendChild(resultDiv);


            // Auto-scroll logic

            // window.scrollTo(0, document.body.scrollHeight);

    

  } catch(err){

    console.error("Backend connect nahi ho raha:", err);

            const errP = document.createElement('p');

            errP.textContent = "Server down hai bhai!";

            output.appendChild(errP);

  }

}

}); 