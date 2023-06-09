async function submitEvent(e){
    try{
        e.preventDefault();
        const email=e.target.email.value;
        const obj={
          email
        }
        
      const send=  await axios.post('http://localhost:4000/password/forgotpassword',obj);
      if(send.status===202){
        document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
      }
      else{
        throw new Error ('Something went wrong!!!')
      }
    }
  catch(err){
    document.body.innerHTML += `<div style="color:red;">${err} <div>`;
  }
}