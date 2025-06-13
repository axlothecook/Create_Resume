import { useState } from 'react';
import './failedLogin.css';

const users = [
  {
    "email": "maelle@gmail.com",
    "username": "poffy",
    "password": "maellepass"
  },
  {
    "email": "verso@gmail.com",
    "username": "goofy",
    "password": "versopass"
  }
];


function Login() {
  const [emailValue, setemailValue] = useState("");
  const [passValue, setpassValue] = useState("");
  const [match1, setMatch1] = useState(false);
  const [match2, setMatch2] = useState(false);
  const confirmLogin = () => { 
    users.forEach(user => {
      if(user.username === emailValue || user.email === emailValue) {
        console.log('email match');
        setMatch1(true);
        console.log(setMatch1(true));
        console.log(user.username === emailValue);
      } else setMatch1(false);
      if(user.password === passValue) {
        console.log('password match');
        setMatch2(true);
      } else setMatch2(false);
      console.log(`match1 is ${match1} and match2 is ${match2}`);
    });
  };

  return (
    <>
      <div className='email'>
        <h1>Enter Email or Username</h1><input type='text' value={emailValue} onChange = {e => setemailValue(e.target.value)} required></input>
        {emailValue !== '' && <p>Your email is {emailValue}</p>}
      </div>
      <div className='password'>
        <h1>Enter password</h1><input type='password' value={passValue} onChange = {e => setpassValue(e.target.value)} required></input>
        {passValue !== '' && <p>Your password is {passValue}</p>}
      </div>
      <div>
        <button onClick={confirmLogin}>Click</button>
      </div>
      <div className='matching'>
        {match1 && !match2 && <p>Password is wrong</p>}
        {!match1 && match2 && <p>Username or email is wrong</p>}
        {match1 && match2 && <p>User exists</p>}
      </div>
    </>
  )
}

export default Login
