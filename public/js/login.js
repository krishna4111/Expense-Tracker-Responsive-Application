async function submitEvent(e){
    try{
        e.preventDefault();
    
        email=e.target.email.value;
        password=e.target.password.value;
        const obj={
            email,password
        }
        const check=await axios.post('http://localhost:4000/user/login',obj)
       .then(response=>{
        console.log(response.data)
        alert(response.data.message);
        localStorage.setItem('token',response.data.token);
        if(response.data.ispremiumuser==true){
            window.location.href='http://localhost:4000/expense/premiumexpense'
        }
       
        else{
            window.location.href='http://localhost:4000/expense/add-expense'
        }
        
       })
    }
    catch(err){
        console.log(err);
        document.body.innerHTML +=`<div style="color:red;">${err.message}</div>`
    }
    
}