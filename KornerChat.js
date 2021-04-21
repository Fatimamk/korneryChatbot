const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    ID:   Symbol("id"),
    ORDER: Symbol("order"),
    PAYMENT: Symbol("payment")
});

module.exports = class KornerChat extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sOrder = "";
        this.nPrice = 21.00;
        this.sId = "";
        this.sReciept ="Reciept: ";
        this.nTprice = 0;
        this.nTax = 0;
        this.orderOngoing = true;
        this.sItem =" ";

      }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.ID;
                aReturn.push("Ready to Order? Please enter your reservation ID:");
                break;
            case OrderState.ID:
                 this.stateCur = OrderState.ORDER; 
                 this.sId = sInput;
                 if(sInput.length == 32){     
                  aReturn.push("Enter which items you would like in single word format, seperate your entries with a space. For example if you would like to order drink vinegar prism and taiyaki gastro tousled enter: drinkvinegarprism, taiyakigastrotousled");
                  }
                  else{
                    aReturn.push("Invalid ID - please enter a valid ID")
                    this.stateCur = OrderState.ID; 
                  }
                  this.sOrder = sInput;
                  break 
            case OrderState.ORDER: 
              this.sReciept += `<br/>`
                for (let i = 0; i < sInput.length; i++) {
                  if (sInput.charAt(i)==" "){
                    this.nPrice += 21;
                    console.log("space");
                  }
                }
                for (let i = 0; i < sInput.length; i++) {
                  this.sReciept += sInput.charAt(i);
                  this.sItem += sInput.charAt(i);
                  if (sInput.charAt(i)==" "){
                    this.sReciept += `$21 <br/>`;
                  }
                }
                this.sReciept += ` $21`;
                aReturn.push("Thank-you for your order!");
                aReturn.push(`${this.sReciept} <br/> Price $${this.nPrice}`);
                aReturn.push(`click here to pay: ${this.sUrl}/payment/${this.sNumber}/`);
                //aReturn.push(`click here to pay: ${this.sUrl}/payment/`);
                //aReturn.push(`click here to pay: https://mobile-dev-306.herokuapp.com/payment`);
                //aReturn.push(`click here to pay: https://serene-taiga-04277.herokuapp.com/payment`);
            case OrderState.PAYMENT:
                console.log(sInput);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                break;           
        }
        return aReturn;
    }
    renderForm(sTitle = "-2", sAmount = "-1"){

      if(sTitle != "-2"){
        this.sItem =sTitle;
      }
      if(sAmount != "-1"){
        this.sId =sAmount;
      }
      
      const sClientID = process.env.SB_CLIENT_ID;
      //AYYdysYcTluMaiRETcuwVYTiLS6JsYs1kkP9p1esuseIo26my86SETC5TIuTzCrudb70_f5kMjFPRZjk; <form action="https://serene-taiga-04277.herokuapp.com/payment" method="post">
       return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Order ${this.sId} has been placed. Your order ${this.sItem} total is $${this.nPrice}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
    }
}
