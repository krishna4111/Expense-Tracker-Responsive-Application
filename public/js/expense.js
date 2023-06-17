async function addFunction(e) {
  try {
    e.preventDefault();
    const amount = e.target.amount.value;
    const description = e.target.description.value;
    const category = e.target.category.value;
    //console.log(amount, description, category);
    obj = {
      amount,
      description,
      category,
    };
    const token = localStorage.getItem("token");
    //console.log(token);
    await axios
      .post("http://localhost:4000/expense/add-expense", obj, {
        headers: { 'Authorization': token },
      })
      .then((response) => {
       // console.log("very very>>", response.data);
        showExpences(response.data.expense);
       // location.reload();
      });
  } catch (err) {
    console.log(err);
  }
}

//below function is for after a user buys premium the buypremium button hides
function showPremiumUserMessage(){
  document.getElementById("rzp-button1").style.visibility="hidden";
  document.getElementById("message").innerHTML=`<span style='color: gold;'>You are a Premium user now</span>`;
}

//this method is for decoding our token in frontend
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

//below method is for each and every time reload the page
addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const decodeToken=parseJwt(token);
    const ispremiumuser=decodeToken.ispremiumuser;
    if(ispremiumuser){
      showPremiumUserMessage();
      showLeaderBoard();
      downloadExpense();
      showDownloadLinks();
    }
    page=1;
    const getdata=await axios.get(`http://localhost:4000/expense/pagination?page=${page}` , {headers : {'Authorization':token }});
    console.log(getdata.data.allExpenses);
    getdata.data.allExpenses.forEach(ele=>{
      showExpences(ele);
    });
    console.log(getdata.data);
    showPagination(getdata.data);
    
    // await axios
    //   .get("http://localhost:4000/expense/show-all", {
    //     headers: { 'Authorization': token },
    //   })
    //   .then((response) => {
    //     response.data.ans.forEach((expenses) => {
    //       showExpences(expenses);
    //     });
    //   });
  } catch (error) {
    console.log(error);
  }
});

function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage}){

  const dynamicpagination=document.getElementById('dynamicpagination');
  if(dynamicpagination){
    dynamicpagination.addEventListener('change',()=>{
      const pageSize=document.getElementById('dynamicpagination').value;
      console.log(pageSize);
      localStorage.setItem('pagesize' ,pageSize);
      getProducts();
      //const pageSize=document.getElementById('dynamicpagination').value;
     // const getdata=await axios.get(`http://localhost:4000/expense/pagination?page=${page}&${pageSize}` , {headers : {'Authorization':token }});
    })
  }



  const pagination=document.getElementById('pagination');

  if(hasPreviousPage){
    const prevBtn=document.createElement('button');
    prevBtn.innerHTML=previousPage;
    prevBtn.addEventListener('click' , ()=>{

      getProducts(previousPage);
    });
    pagination.appendChild(prevBtn);
   }

  const crtBtn=document.createElement('button');
  crtBtn.innerHTML=currentPage;
  crtBtn.addEventListener('click',()=>{
    getProducts(currentPage);
  });
  pagination.appendChild(crtBtn);



   if(hasNextPage){
    const nextBtn=document.createElement('button');
    nextBtn.innerHTML=nextPage;
    nextBtn.addEventListener('click',()=>{
      getProducts(nextPage);
    });
    pagination.appendChild(nextBtn);
   }
}

async function getProducts(page){
  const pageSize=localStorage.getItem('pageSize');
  const token=localStorage.getItem('token');
  const getdata=await axios.get(`http://localhost:4000/expense/pagination?page=${page}&${pageSize}` , {headers : {'Authorization':token }});
  const ul=document.getElementById('showing');
  ul.innerHTML="";
  const pagination=document.getElementById('pagination');
  pagination.innerHTML='';
  console.log(getdata.data.allExpenses);
  getdata.data.allExpenses.forEach(ele=>{
    showExpences(ele);
  });
  console.log('data');
  showPagination(getdata.data);
}



//this method is for buy premium
document.getElementById("rzp-button1").onclick = async function (e) {
  try{
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:4000/premium/purchase-premium",
      { headers: { 'Authorization': token } }
    );
    //console.log(response);
    var options = {
      //this key_id is very impotant bcz of this only our razorpay knows which company trys to place an order
      'key': response.data.key_id,
      'order_id': response.data.order.id,
  
      //the below function will handle the success payment.
      'handler': async function (response) {
        await axios.post(
          "http://localhost:4000/premium/update-transaction",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id
          },
          { headers: { 'Authorization': token } }
        )
        .then(response=>{
          alert("you are a premium user now");
          showPremiumUserMessage();
          console.log('res.data.token',response);
          localStorage.setItem('token',response.data.token);
          showLeaderBoard();
          downloadExpense();
          showDownloadLinks();
          
        });
      }
    };
    
    const rzp1 = new Razorpay(options);
    rzp1.open(); //it opens the payment screen
  
    rzp1.on("payment.failed", function (response) {
      alert("something went wrong");
    });
  }
  catch(err){
    console.log(err);
    throw new Error(err);
  }

};


//below method is for showing the download expenses as links
function showDownloadLinks(){
  const inputElement= document.createElement('input');
  inputElement.type="button";
  inputElement.value="Show Download File Link";
  inputElement.id='downloadfile-btn';
  inputElement.style.backgroundColor = 'gold';
  inputElement.style.color = 'black';
  inputElement.style.borderRadius = '15px';
  inputElement.style.padding = '8px';
  inputElement.style.marginLeft = '100px';
  const header=document.getElementById('main-header');
  header.appendChild(inputElement);



  inputElement.onclick=async()=>{
    const heading=document.getElementById('heading');
    heading.innerText="Show Download Url";
    const downloadUrl=document.getElementById('downloadlinks');
    const token=localStorage.getItem('token');
  
    const downloadLinks=await axios.get( "http://localhost:4000/user/show-downloadLink",{ headers:{'Authorization':token}});
console.log('downloadLinks' ,downloadLinks);
if(downloadLinks.data.url==[] || downloadLinks.data.url==''){
  const li = document.createElement('li');
  li.innerText = "No Downloaded Url";
  downloadUrl.append(li);
}
else{
  downloadLinks.data.url.forEach((Element) => {
    console.log('Element.filelink',Element);
    const li = document.createElement('li');
    const a=document.createElement('a');
    a.href=`${Element.filelink}`;
    a.innerHTML=` Url:  ${Element.filelink} `; 
    li.appendChild(a);
    downloadUrl.appendChild(li);
});
}

   

};
}

//this method is for showing the leaderboard for premium user
function showLeaderBoard(){
 //s console.log('i am inside')
  const inputElement= document.createElement('input');
  inputElement.type="button";
  inputElement.value="showLeaderBoard";
  inputElement.id='leaderboard-btn';
  inputElement.style.backgroundColor = 'gold';
  inputElement.style.color = 'black';
  inputElement.style.borderRadius = '15px';
  inputElement.style.padding = '8px';
  inputElement.style.marginLeft = '100px';
  const header=document.getElementById('main-header');
  header.appendChild(inputElement);


  inputElement.onclick=async()=>{
    const token=localStorage.getItem('token');
  
    const userLeaderBoardArray=await axios.get( "http://localhost:4000/premium/show-leaderboard",{ headers:{'Authorization':token}});
    var leaderboardElem=document.getElementById('leaderboard');
    leaderboardElem.innerHTML+='<h1> Leader Board</h1>';
    userLeaderBoardArray.data.forEach((userDetail)=>{
      //console.log('userDetail>>',userDetail)
      leaderboardElem.innerHTML+=`<li>Name-${userDetail.name} -- total expense-->${userDetail.totalexpense}`;
    });
  };
}


//this method is for directly download the expenses when you click on download expenses button
function downloadExpense(){
  console.log('i am in download');
  const inputElement= document.createElement('input');
  inputElement.type="button";
  inputElement.value="download-expenses";
  inputElement.id='download-btn';
  inputElement.style.backgroundColor = 'gold';
  inputElement.style.color = 'black';
  inputElement.style.borderRadius = '9px';
  inputElement.style.padding = '8px';
  inputElement.style.marginLeft = '100px';
  const header=document.getElementById('main-header');
  header.appendChild(inputElement);


  inputElement.onclick = async(eve) => {
    const token = localStorage.getItem('token');

    const getUserDownloadedData = await axios.get('http://localhost:4000/user/download', { headers: { 'Authorization': token } });
    if(getUserDownloadedData.status===200){
      var a=document.createElement("a");
      a.href=getUserDownloadedData.data.fileURl;
      a.click();
      const parentNode = document.getElementById("showing");
    }
    else{
      throw new Error(document.data.message);
    }
};
  
}

//this is for normally showing the expenses 
function showExpences(obj) {
  const parentNode = document.getElementById("showing");
  const createNewUser = `<li id=${obj.id}> ${obj.amount} - ${obj.description} - ${obj.category} 
    <button style="padding:3px;margin:5px" onclick=deleteExpense('${obj.id}') class="btn btn-danger">Delete</button>
    
        </li>`;
  //<button style="padding:3px;margin:5px" onclick=editExpense('${obj}') class="btn btn-success">Edit</button>

  parentNode.innerHTML += createNewUser;
}


// async function editExpense(expense){
//     const expId=expense.id;
//     console.log(expense.amount)
//     console.log(expense.amount)
//     document.getElementById('amount').value=expense.amount;
//     document.getElementById('desc').value=expense.description
//     document.getElementById('cata').value=expense.catagory;
//     deleteExpense(expId);
//     axios.put(`http://localhost:3000/expense/delete-expense/${expId}`)
//     .then(response=>{
//         console.log(response)
//         removeItemFromScreen(expId);
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// }


//this is for deleting the expenses
async function deleteExpense(userId) {
  console.log("inside delete");
  const token = localStorage.getItem("token");
  await axios
    .delete(`http://localhost:4000/expense/delete-expense/${userId}`, {
      headers: { 'Authorization': token },
    })
    .then((response) => {
      removeItemFromScreen(userId);
      //location .reload();
    })
    .catch((err) => {
      console.log(err);
    });
}
function removeItemFromScreen(UserId) {
  const parentNode = document.getElementById("showing");
  const elem = document.getElementById(UserId);
  parentNode.removeChild(elem);
}

