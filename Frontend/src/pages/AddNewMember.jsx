import React from 'react'
import { Link } from 'react-router-dom'

function AddNewMember() {
  return (
    <div>
      <h1>Add New Member</h1>
      <Link to='/dashboard'><button className="back-btn">Back</button></Link>
    </div>

  )
}

export default AddNewMember
