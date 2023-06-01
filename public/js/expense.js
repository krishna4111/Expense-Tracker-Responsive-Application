
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
    const post=await axios.post('http://localhost:4000/expense/add-expense',obj)
    location .reload();
    console.log(post.data);
        //showExpences(obj);
}
   catch(err){
    console.log(err);
   }
   
}
addEventListener("DOMContentLoaded",async ()=>{
    await axios.get('http://localhost:4000/expense/show-all')
        .then(response=>{
            console.log(response.data.fetched[0]);
            for(var i=0;i<response.data.fetched.length;i++){
                //console.log(response.data.allUsers[0])
                showExpences(response.data.fetched[i]);
        }})
        .catch(err=>{
            console.log(err);
        }) 
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
    await axios.delete(`http://localhost:4000/expense/delete-expense/${userId}`)
    .then((response)=>{
      removeItemFromScreen(userId);
      location .reload();

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