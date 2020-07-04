import React ,{useEffect , useState } from 'react'

export default function Verify(props) {
    const [message, setMessage] = useState("");
    const [errmessage, setErrMessage] = useState("");
    const [userData ,setUserData] = useState();
    const [status ,setStatus] = useState({});
    const [isSpinner,setSpinner] =useState(true);
    const [codeBlock ,setCodeBlock] = useState(false)

    const handleChange = e => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        //console.log("vijay")
    };

    
    const handleSubmit = async (e) => {

        try{
            if( !userData.code){
                setErrMessage("fill the details")
            }else{
                const userdata = {
                    code : userData.code
                };
                console.log(userdata)
            // setSpinner1(true)
                e.persist();
                const response = await fetch('/api/auth/phoneverification' , {
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
                    window.location.reload(false);
                }else{
                    setErrMessage(data.msg)
                }
            }
        }catch(e){
            setErrMessage("Internal Error...")
            console.log(e)
            }

    }

    
 const  signout = async(e)=>{

    // e.preventDefault()
    try{
        // e.persist();
      const resp = await fetch("/api/auth/logout",{
        method:"DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
    
        },
        mode:"cors"
      });
      const data = await resp.json();
          
           if(data.error === false){
              
              props.history.push("/login");
           }else{
            setErrMessage(data.msg)
           }
      }catch(e){
          console.log(e);
          setErrMessage("inernal error")
        //   props.history.push("/login");
      }

    }
   const  codeInput = <tr onChange={handleChange}>
                        <td><input type="number" name="code"/> <button onClick={handleSubmit}> Verify</button></td>
                    </tr>
    // const emailVerify = ()=>{
    //     console.log("sssss")
    // }


    const userlog= async ()=>{

        try{
        const resp = await fetch("/api/auth/verfiy");
        const data = await resp.json();
        // console.log(data)
             if(data.success === true){
                props.history.push("/dashboard");
             }
              verifylog()
        }catch(e){
            console.log(e);
            setErrMessage("internal Error!")
            
        }
    }
    const verifylog= async ()=>{

        try{
        const resp = await fetch("/api/auth/verify/status");
        const data = await resp.json();
        // console.log(data)
             if(data.success === false){
                props.history.push("/login");
             }
             setUserData({id:data.msg})
             getStatus(data.msg)
        }catch(e){
            console.log(e);
            setErrMessage("internal Error...!")
            
        }
    }

    const getStatus= async (id)=>{

        try{
            
            const response = await fetch('/api/auth/getstatus' , {
                method: "POST",
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            
                },
                mode:"cors",
                body :JSON.stringify({id:id})
            })
             const data = await response.json();
                setStatus({email : data.status.email , phone :data.status.phone})
             if((data.status.email === true) && (data.status.phone === true) ){
                 alert("verifed ...!")
                 signout()
                props.history.push("/dashboard");

             }
        }catch(e){
            console.log(e);
            setErrMessage("internal Error...!!!")
            
        }
    }

    useEffect(() => {
         userlog()
       
    },[])

    const emailVerify = async(e)=>{
        e.preventDefault();
        try{
            const resp = await fetch("/api/auth/verify/email");
            const data = await resp.json();
            if(data.error === false){
                setMessage("please check your mail")
            }else{
                setMessage("error"+data.msg)
            }
        }catch(error){
            setMessage("internal Error")
        }
    }

    const phoneVerify = async(e)=>{
        setMessage("getting verified");
        e.preventDefault();
        try{
            const resp = await fetch("/api/auth/verify/phone");
            const data = await resp.json();
            if(data.error === false){
                setCodeBlock(true)
            }else{
                setMessage("error"+data.msg)
            }
        }catch(error){
            setMessage("internal Error")
        }
    }

    const pointer = status.phone ? "none" : "pointer" ;
    const verifyButton = <span style={{marginLeft:"5px",color:"Green",cursor:"pointer" }} onClick={emailVerify}> Verify</span>
    const verifiedButton = <span style={{marginLeft:"5px",color:"Green" }} > Verified </span>
    return (
        <div>
            <h1>Account not verfied</h1>

            <table style={{justifyContent:"center",margin: "auto 40%"}} className="container">
            
            <tr>
            <label class="checkbox-inline h6"><input type="checkbox" value="" checked={status.email} disabled/> Email</label>{status.email ? verifiedButton : verifyButton }
            
            </tr> 
            <tr>
                <label class="checkbox-inline h6"><input type="checkbox" value="" checked={status.phone} disabled /> Phone</label><span style={{marginLeft:"5px",color:"Green",cursor:pointer }} onClick={status.phone ? "": phoneVerify }> {status.phone ? "Verified": "Verify" }</span>
            </tr>
            {codeBlock ? codeInput : ""}
            </table>
            

            {message}<br/><br/><br/>
            {errmessage}<br/><br/><br/>

            <button onClick={signout} className="btn btn-primary">Use Another Account</button>
        </div>
    )
}
