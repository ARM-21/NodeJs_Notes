
 import YourFiles from "./components/yourfiles/YourFiles";
 import Home from "./Home";
 import  { createBrowserRouter, RouterProvider } from "react-router"
import Images from "./routes/images/Images";
import './app.css'
 
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