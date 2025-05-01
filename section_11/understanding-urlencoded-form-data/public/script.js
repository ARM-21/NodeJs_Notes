const form = document.querySelector("form");
const nameInput = document.querySelector('[name="name"]');
const emailInput = document.querySelector('[name="email"]');
const file = document.querySelector('[name="profilePic"]')

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();
  
//   console.log(e)
//   const name = nameInput.value;
//   const email = emailInput.value;

//   const read = new FileReader();
//   read.addEventListener('load',async (e)=>{
//     console.log(e.target.result)
//    await  getContent(name,email,e.target.result)
//   })
//   read.readAsArrayBuffer(file.files[0])

// });

// async function getContent(name,email,fileBinary){
//   const response = await fetch("http://localhost:4000/user", {
//     method: "POST",
//     body: fileBinary,
//   });
// async function getFile() {
//   // Open file picker and destructure the result the first handle
//   const [fileHandle] = await window.showOpenFilePicker();
//   const file = await fileHandle.getFile();
//   return file;
// }




//   const data = await response.json();
//   console.log(data);
// }
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form"); // ✅ properly define it
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // ✅ Now this will run

    const formData = new FormData(form);
    try {
      const response = await fetch("http://localhost:4000/user", {
        method: "POST",
        body: formData,
      });

      // if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  });
});