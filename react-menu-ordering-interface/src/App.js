import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
    // *** You could add a warning property and set each to '' by default.
    menuItems: [{'name' : 'Cobb Salad', 'price':11.99, 'quantity':0, 'limit': 999},
    {'name' : 'Thai Noodles', 'price':12.99, 'quantity':0, 'limit':999},
    {'name' : 'Salmon Bisque', 'price':17.99, 'quantity':0, 'limit':4},
    {'name' : 'Fruit Flan', 'price':8.99, 'quantity':0, 'limit':999},
    {'name' : 'Orange Juice', 'price':2.99, 'quantity':0, 'limit':999},
    {'name' : 'Apple Juice', 'price':2.99, 'quantity':0, 'limit':999}]};

    this.add = this.add.bind(this);
    this.subtract = this.subtract.bind(this);
  }

  handleServerChange(event) {
    this.setState({serverName: event.target.value});
  }

  handleDiscountChange(event) {
    this.setState({applyDiscount: event.target.checked});
    this.refresh(event.target.checked);
  }

  setSubTotal(index, operation, applyDiscount = this.state.applyDiscount){
    let tempItems = this.state.menuItems;

    if(operation === 'add') {
      tempItems[index].quantity = tempItems[index].quantity + 1
    }
    else if (operation ==='subtract') {
      tempItems[index].quantity = tempItems[index].quantity - 1
    }

    // *** You can use a loop to reduce the code.
    let subtotal = 0;
    for(var i=0; i<tempItems.length; i++) {
      subtotal = subtotal
                  + tempItems[i].quantity * tempItems[i].price;
    }

    const TAX_RATE = 0.07;
    const DISCOUNT_RATE = 0.15;
    let discountRate =  applyDiscount ? DISCOUNT_RATE: 0;
  
    // Calculate discount with 'subTotal' and not something
    // that is stored in state due to timing issue.
    let discount = subtotal*discountRate
    let tax = (subtotal-discount)*TAX_RATE
    let total = subtotal - discount + tax

    // this.showWarningMessage();
    // When calculations are done set the state.
    // Set states here to avoid timing issue.
    this.setState({subtotal:subtotal.toFixed(2)});
    this.setState({discount:'-'+discount.toFixed(2)});
    this.setState({tax:tax.toFixed(2)});
    this.setState({total:'$'+total.toFixed(2)});
    
  }

  add(index) {
    this.setSubTotal(index, 'add');
    
  }

  subtract(index) {
    if (this.state.menuItems[index].quantity > 0) {
      this.setSubTotal(index, 'subtract'); 
    }
  }
  
  // refresh calculation to apply discount
  refresh(applyDiscount) {
    this.setSubTotal(null, null, applyDiscount);
  }

  render() {
    return  (
    <div className='wrapper'>
      <div className='top-inputs'>
        {/* <form> */}
          <label>
            Server Name: &nbsp;
            <input 
              type="text" 
              name="server-name" 
              value={this.state.serverName}
              onChange={this.handleServerChange.bind(this)}/>
          </label>
          <label>
            Apply 15% Discount: &nbsp;
            <input 
              type="checkbox" 
              name="apply-discount" 
              value={this.state.applyDiscount}
              onChange={(e) => {this.handleDiscountChange(e)}}/>
          </label>
      </div>
      <div className='order-select-inputs'>
        {this.state.menuItems.map((item, index) => (
          <div className={item.quantity>item.limit ? 'warning': ''}>
            <div className={item.quantity>item.limit ? 'row-warning': 'row'} key={item.name}>
              <div className='c1'>{item.name}</div> 
              <div className='c2'>{item.price}</div>                   
              <div className='c3'>
                <button onClick={(e) => this.subtract(index)}>-</button>            
                <button onClick={(e) => this.add(index)}>+</button>
              </div>
              <div className='c4'>{item.quantity}</div>
            </div>
            {item.quantity>item.limit
              ? <> *** Only {item.limit} remaining in stock.</>
              : <></>
            }
          </div>
        ))}
      </div>
      <div className='summary-output'>
        <div className='left-labels'>
          <span class='server'>Server Name</span>
          <br/>   
          Subtotal
          <br/>              
          { this.state.applyDiscount
            ? <>15% Discount<br/></>
            : <></>
          }               
          +7% Tax
          <br/>              
          Total
        </div>
        <div className='right-values'>
          <span class='server'>{this.state.serverName}</span>
          <br/>   
          {this.state.subtotal}
          <br/>
          { this.state.applyDiscount
            ? <>{this.state.discount}<br/></>
            : <></>
          }                          
          {this.state.tax}
          <br/>              
          {this.state.total}
        </div>           
      </div>
    </div>
    );
  }
}
export default App;