 import AddFile from "./AddFile";
 import YourFiles from "./YourFiles";
 import './app.css'
 
 function App(){
     
return (<>
  {/* //Adding file section */}
  <div id="main_container">
    <AddFile/>
    <YourFiles/>
  </div>
    
</>)
}

export default App;