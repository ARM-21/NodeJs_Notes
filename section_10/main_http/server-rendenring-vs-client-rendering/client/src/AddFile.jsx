import React from 'react'

export default function AddFile() {
  return (

    <div className='user_add_file'>
    <h1>Add Files</h1>
      <form action="" method="post">
        <input type="text" name='userName' placeholder='Enter file Name'/>
        <input type="file" name="userFile" id="userFile" />
        <input type="submit" value="Add" />
      </form>
    </div>
  )
}
