import React from 'react'
import AddFile from './AddFile'
import YourFiles from './YourFiles'
import { Outlet } from 'react-router'
import './yourfile.css'; 
import './addfile.css'; // Importing CSS file

export default function Home() {
  
  return (
    <div>
      <AddFile/>
      <Outlet/>
    </div>
  )
}
