async function submitEvent(e){
    try{
        e.preventDefault();
    
        email=e.target.email.value;
        password=e.target.password.value;
        const obj={
            email,password
        }
        const check=await axios.post('http://localhost:4000/user/login',obj)
       .then(reponse=>{
        alert('user logged in successfulley');
       })
    }
    catch(err){
        console.log(err);
        document.body.innerHTML +=`<div style="color:red;">${err.message}</div>`
    }
    
}