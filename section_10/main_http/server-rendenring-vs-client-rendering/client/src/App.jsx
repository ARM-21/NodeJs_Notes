 import AddFile from "./AddFile";
 import YourFiles from "./YourFiles";
 import Home from "./Home";
 import  { createBrowserRouter, RouterProvider } from "react-router"


 import './app.css'
import Images from "./Images";
 
 const routes = createBrowserRouter([{
  path:'/',
  element:<Home/>,
  children:[{
    path:'/images',
    element:<Images/>,
  },
  {
    path:"/",
    element:<YourFiles/>,
    index:true
  }
]
  }])
 function App(){
     
return <RouterProvider  router={routes}/>
}

export default App;