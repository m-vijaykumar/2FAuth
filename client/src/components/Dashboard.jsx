import React, { useEffect ,useState} from 'react'
import AdminNavbar from './AdminNavbar'
import "./../App.css"


export default  function Dashboard(props) {

    const [isSpinner1,setSpinner1] =useState(false);
    const [isSpinner,setSpinner]=useState(true);
    const [userId , setUserId] = useState([])
    const [userData , setUserData] = useState([])
    const [errMessage , setErrMessage] = useState()


    const googlelog = async() =>{

        try{
        const resp = await fetch("/api/auth/verify/google");
        const data = await resp.json();
        if(data.success === false){
            props.history.push("/login");
            }
            getUserData(data.msg)
            
        }catch(e){
            console.log(e);
            props.history.push("/login");

        }
    }

    const userlog= async ()=>{

    try{
    const resp = await fetch("/api/auth/verify");
    const data = await resp.json();
    if(data.success === false){
        googlelog()
     }else if (data.success === true) {
         getUserData(data.msg)
         
     }

    }catch(e){
        console.log(e);
        props.history.push("/login");
    }
    }
    

   const sp = <div className="spinner-border " role="status" id="spinner" style={{backgroundColor:"transparent"}}>
   <span className="sr-only">Loading...</span>
   </div> 
    useEffect(()=>{
        userlog();
        // setSpinner(false)
    },[])

    
    const getUserData = async (id)=>{

        try{
            
            const response = await fetch('/api/auth/getuser' , {
                method: "POST",
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            
                },
                mode:"cors",
                body :JSON.stringify({id:id})
            })
             const data = await response.json();

                if (data.error === false) {
                    console.log(data.user)
                    // var user = data.user.map((k)=>{
                    //     return k
                    // })
                    // console.log(user)
                    setUserData(data.user) 
                }

                if (data.error === true) {
                    setErrMessage(data.msg)
                }
                setSpinner(false)
             
        }catch(e){
            console.log(e);
            setSpinner(false)
            setErrMessage("internal Error...!!!")
            
        }
    }


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
        <div>
        <AdminNavbar />
        
        {isSpinner1? sp : ''}
        <div className="AdminApp">
        <h1>Welcome</h1>
                {userData.username}<br/>
                {userData.email}<br />
                {userData.phone ? userData.phone : ""}<br />
            <br />
    
        </div>
            {errMessage}
        </div>
        
    )
    }
}
