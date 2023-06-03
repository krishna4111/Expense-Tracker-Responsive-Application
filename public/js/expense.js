
async function addFunction(e){
    try{
    e.preventDefault();
    const amount=e.target.amount.value;
    const description=e.target.description.value;
    const category=e.target.category.value;
    console.log(amount,description,category);
    obj={
        amount,
        description,
        category
    }
    const token=localStorage.getItem('token');
    console.log(token);
    await axios.post('http://localhost:4000/expense/add-expense',obj,{headers:{'Authorization' : token}})
    .then(response=>{
      console.log('very very>>', response.data)
      showExpences(response.data.expense); 
        location.reload();
        
    })
   
}
   catch(err){
    console.log(err);
   }
   
}
addEventListener("DOMContentLoaded",async ()=>{
    try{
        const token=localStorage.getItem('token');
        await axios.get('http://localhost:4000/expense/show-all',{ headers : { "Authorization" : token }})
            .then(response=>{
                response.data.expenses.forEach(expenses=>{
                    showExpences(expenses);
                })
                })
    }
   catch(error){
            console.log(error); 
        } 
})

function showExpences(obj){
    const parentNode=document.getElementById('showing');
    const createNewUser=`<li id=${obj.id}> ${obj.amount} - ${obj.description} - ${obj.category} 
    <button style="padding:3px;margin:5px" onclick=deleteExpense('${obj.id}') class="btn btn-danger">Delete</button>
    
        </li>`
        //<button style="padding:3px;margin:5px" onclick=editExpense('${obj}') class="btn btn-success">Edit</button>

        parentNode.innerHTML+=createNewUser;
        
}
async function editExpense(expense){
    const expId=expense.id;
    console.log(expense.amount)
    console.log(expense.amount)
    document.getElementById('amount').value=expense.amount;
    document.getElementById('desc').value=expense.description
    document.getElementById('cata').value=expense.catagory;
    deleteExpense(expId);
    axios.put(`http://localhost:3000/expense/delete-expense/${expId}`)
    .then(response=>{
        console.log(response)
        removeItemFromScreen(expId);
    })
    .catch((err) => {
        console.log(err);
    })
}
    



async function deleteExpense(userId){
    console.log('inside delete');
    const token=localStorage.getItem('token');
    await axios.delete(`http://localhost:4000/expense/delete-expense/${userId}`,{headers : {'Authorization':token}})
    .then((response)=>{
      removeItemFromScreen(userId);
      //location .reload();

    })
    .catch((err)=>{
      console.log(err);
    })
  }
function removeItemFromScreen(UserId) {
const parentNode = document.getElementById("showing");
const elem = document.getElementById(UserId);
parentNode.removeChild(elem);
}