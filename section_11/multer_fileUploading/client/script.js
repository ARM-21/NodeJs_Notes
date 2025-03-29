const form = document.querySelector("form")
// action="http://192.168.100.7:3000/upload"


form.addEventListener("submit", (e) => {
  // Prevent page refresh
  e.preventDefault(); 
    const formData = new FormData(form);

    //for appending the more data we can use 
    formData.append("parentId", 'id213')
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://192.168.100.7:3000/upload", true);
    xhr.send(formData);
    xhr.addEventListener("load", () => {
        console.log(xhr.response);
    });
    xhr.addEventListener('error',()=>{
        console.error("error aris")
    })

    xhr.upload.addEventListener("progress", (e) => {
        const totalProgress = (e.loaded / e.total) * 100;
        console.log(totalProgress);
    });
    

    
});
