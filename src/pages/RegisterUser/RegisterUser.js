import { useState,useEffect } from "react";
import { toast } from "react-toastify";

function RegisterUser() {
  const roles = [
    "Select Role",
    "Buyer",
    "Seller",
    "TAO User",
    "Tea Board",
    "Buyer",
    "Warehouse",
  ];

  const [role,setRole] = useState('');

  const selectRole = (role) => {
    setRole(role)
  };


 const  handleSubmit = ()=>{
  if(role === "Select Role"){
    toast.error("Select Role")
  }else{
    alert(role)
        
  }
  
  
}
 
  return (
    <>

        <div className="row">
          <div className="col-md-12">
            <label>Select Role </label>
            <select
              className="select-form form-control"
              onChange={(e) => selectRole(e.target.value)}
            >
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <div className="BtnGroup">
              <button className="SubmitBtn" onClick={()=>handleSubmit()}>Submit</button>
            </div>
          </div>
        </div>

        
    </>
  );
}

export default RegisterUser;
