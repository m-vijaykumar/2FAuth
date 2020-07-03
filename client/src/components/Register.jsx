import React from 'react'
import {Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

 function Register(props) {


  const [userData, setUserData] = useState({});
  const [errMessage, setErrMessage] = useState("");
  
  const [isSpinner,setSpinner] =useState(true);
  const [isSpinner1,setSpinner1] =useState(false);

  
  const googlelog = async() =>{

    try{
      const resp = await fetch("/api/auth/verify/google");
    const data = await resp.json();
    if(data.success === false){
        verifylog()
        }
        // setSpinner(false)
    }catch(e){
        console.log(e);
        props.history.push("/login");
    }
}

    const verifylog= async ()=>{

      try{
      const resp = await fetch("/api/auth/verify/status");
      const data = await resp.json();
      // console.log(data)
           if(data.success === true){
              props.history.push("/verify");
           }
           setSpinner(false)
      }catch(e){
          console.log(e);
          props.history.push("/register");
          
      }
  }

  const userlog= async ()=>{

    try{
    const resp = await fetch("/api/auth/verify");
    const data = await resp.json();
    // console.log(data)
          if(data.success === true){
            props.history.push("/dashboard");
          }
          googlelog()
          
      }catch(e){
          console.log(e);
          setErrMessage("internal error..!!")
          
      }
    }

  useEffect( () => {
    
      // console.log("sssss")
      userlog();
      setSpinner(false)
     
  },[]);


  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    //console.log("vijay")
  };

  const handleSubmit = async (e) => {
    try{
    if(!userData.email || ! userData.password ){

      setErrMessage("fill the details")
    }else{
      var phone = "" + 91 + userData.phone;
      console.log(phone)
    const userdata = {
      username : userData.username,
      email: userData.email,
      phone : phone,
      password: userData.password
    };
 
      setSpinner1(true)
      e.persist();
    const response = await fetch('/api/auth/register' , {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"

    },
    mode:"cors",
    body :JSON.stringify(userdata)
  })
  
    const data = await response.json();
    // console.log(data)
   
      if (data.error === false) {
        
        // MyVerticallyCenteredModal()
        // console.log(data.success)
        props.history.push("/verify");

        setSpinner1(false)
        // return <Redirect to="/Dashboard" />
        
      }else{ 
          setSpinner1(false) ;setErrMessage(data.msg)
          }
    }
  }catch(ee){
    setSpinner1(false) ;setErrMessage("Internal Error")
    console.log(ee)
  } 
 
  }



// function MyVerticallyCenteredModal(props) {
//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton style={{border:"none"}}>
        
//       </Modal.Header>
//       <Modal.Body style={{textAlign:"center"}}>
//         <h2>{props.data}</h2>
        
//       </Modal.Body>
//       <Modal.Footer style={{border:"none"}}>
//         <Button onClick={props.onHide}>Close</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }



// html  code

  const sp1 =  <button className="btn btn-success " type="button" disabled>
  <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Loading...
</button>

const sp =  <input type="button" name="register"  value={isSpinner1 ? sp1 :"Register"} className="btn btn-success " onClick={handleSubmit} />
    if (isSpinner) {
      return (
        <div className="d-flex justify-content-center " >
            <div className="spinner-border" role="status" id="spinner">
                <span className="sr-only">Loading...</span>
            </div>
        </div> 
      )
  }else{
    return (
         
        <div className="App">
        <h3>Register To Create Wonders</h3><br />
       
        <table className="login" onChange={handleChange}>
        <tbody>
        <tr>
        <td><p>Username  : </p></td><td><input type="text" name="username" /></td>
        </tr>
        <tr>
        <td><p>Email  : </p></td><td><input type="email" name="email" /></td>
        </tr>
        <tr>
        <td><p>Phone  : </p></td><td><input type="text" defaultValue="+91" disabled style={{width:"8%"}} />  <input type="number" name="phone" onInput={(e) => e.target.value = e.target.value.slice(0, 10)}/>
        </td>
        </tr>
        <tr>
        <td><p>Password  : </p></td><td><input type="password" name="password" /></td>
        </tr>
        <tr>
        <td colSpan="2"><p >{isSpinner1 ? sp1 :sp }</p></td>
        </tr>
        </tbody> 
        </table>
       
        <br />
        <Link to="/login">
          <p >Login</p>
        </Link>

        <p style={{color:'red'}}>{errMessage}</p>
        </div>
    
    )
  
  }
}

export default Register;