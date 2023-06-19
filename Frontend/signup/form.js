console.log('js')
async function submitEvent(e){
 
    try{
        e.preventDefault();
        console.log(e.target.name.value)
        console.log(e.target.password.value)
        const name=e.target.name.value;
        const email=e.target.email.value;
        const password=e.target.password.value;
        detail={
            name,
            email,
            password
        }
        console.log(detail);
     const response= await  axios.post('http://localhost:4000/user/signup',detail)
        window.location.href="../Login/login.html" //change the page on successful login
      showExpenses(detail);
    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">${err}</div>`
    }
}
function redirectLogin(){
    window.location.href="../Login/login.html"
}
