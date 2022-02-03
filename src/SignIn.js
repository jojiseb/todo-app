import React from 'react';
import { useNavigate } from "react-router-dom";
import google_logo from './img/google_logo.jpg';
import { authentication } from './firebase-config';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";


const SignIn = ({ setUser }) => {
    const navigate = useNavigate();
    const signInWithGoogle = () => {
          const provider = new GoogleAuthProvider();
          signInWithPopup(authentication, provider)
          .then((re) => {
            console.log(re);
            console.log("I am logged in")
            setUser(re);
            navigate("/", { replace: true });
            //To Dashboard when the user is signed in successfully
          })
          .catch((err) => {
            console.log(err)
          })
        }

  onAuthStateChanged(authentication,(user) => {
    if(user)
    {
        setUser(user);
        navigate("/", { replace: true });
    }
  });

    return(
        <>
        <h1>Login to Todo</h1>
        <button type='button'className='btn-btn-google'onClick={signInWithGoogle}>
          <span className='icon'>
            <img src={google_logo} alt='google'/>
          </span>
        </button>
        </>
    );
}

export default SignIn;