document.getElementById("rzp-button1").onclick = async function (e) {
    try{
      e.preventDefault();
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/expense/purchase-premium",
        { headers: { 'Authorization': token } }
      );
      console.log(response);
      var options = {
        //this key_id is very impotant bcz of this only our razorpay knows which company trys to place an order
        'key': response.data.key_id,
        'order_id': response.data.order.id,
    
        //the below function will handle the success payment.
        'handler': async function (response) {
          await axios.post(
            "http://localhost:4000/expense/update-transaction",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id
            },
            { headers: { 'Authorization': token } }
          );
          alert("you are a premium user now");
          window.location.href='http://localhost:4000/expense/premiumexpense'
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open(); //it opens the payment screen
    
      rzp1.on("payment.failed", function (response) {
        console.log(response);
        alert("something went wrong");
      });
    }
    catch(err){
      console.log(err);
      throw new Error(err);
    }
  
  };