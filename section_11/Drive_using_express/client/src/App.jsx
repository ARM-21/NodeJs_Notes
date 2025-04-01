
import YourFiles from "./components/yourfiles/YourFiles";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router"
import Directory from "./routes/images/Directory";
import Login from "./routes/login/Login.jsx"
import LandingPage from "./routes/InitialPage/LandingPage.jsx";
import './app.css'
import Register from "./routes/register/Register.jsx";

const routes = createBrowserRouter([
  {
  path: '/',
  element: <LandingPage />,
},
{
  path: 'register',
  element: <Register />,
}
  , {
  path: 'login',
  element: <Login />,
}
  , 
{
  path: "/user",
  element: <Home />,
  children:[{
      path: ':id',
      element: <Directory />,
  },


//   {
//     path: 'directory:id',
//     element: <Directory />,
// },

]
  },
  // {
  //       path: 'directory/:id',
  //       element: <Directory />,
  //   },
  {
    path: '/',
    element: <Home />,
    children:[
      {
        path:"files",
        element:<YourFiles/>,
        index:true
      },{
        path:"directory/:name",
        element:<Directory/>,
      }
    ]


}
]
)
function App() {

  return <RouterProvider router={routes} />
}

export default App;