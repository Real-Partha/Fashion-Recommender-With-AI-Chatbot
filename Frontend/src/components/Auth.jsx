import React from 'react'
import {Link} from 'react-router-dom'

const auth = () => {
  return (
    <div>
      <div className="login">
        <span>Click here to login</span>
        <Link to="/login"><button>Login</button></Link>
      </div>
    </div>
  )
}

export default auth
