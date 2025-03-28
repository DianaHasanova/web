import React from 'react';
import Registration from './Registration'; 
import Profile from './Profile'

function AuthRoute() {
  const token = localStorage.getItem('token');

  return (
    <>
       {token ? < Profile /> : <Registration/>} 
    </>
  );
}

export default AuthRoute; 
