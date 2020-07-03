import React, {useEffect, useState }  from 'react'

export default function Home() {

    const [isSpinner,setSpinner] =useState(true);
    const [message , setMessage] =useState("");
   

    useEffect( () => {
        
        setSpinner(false)
    }, []);

    if (isSpinner) {
        return (
          <div className="spinner-border" role="status" id="spinner">
            <span className="sr-only">Loading...</span>
          </div>
        )
    }else{

            return (
                <div className="App">
                <br /> <br />
                    <h1>Welcome </h1>
        
                    <p ><a href="/register">Register</a>  /  <a href="/login">  Login</a></p> 

                    <br />
                    <br />
                    {message}
                </div>
            )
        }
   
}
