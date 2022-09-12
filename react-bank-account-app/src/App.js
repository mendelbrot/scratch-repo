import React from 'react';

const BASE_URL = 'http://localhost:51146/api/clientaccounts';

const fetchService = {
  getAll(callback, errorCallback) {
    const URL = BASE_URL;

    fetch(URL)
    .then(response => response.json())
    .then((responseJSON) => {
      if (typeof callback === 'function'){
        callback(responseJSON);
      };
    })
    .catch((errorJSON) => {
      if (typeof errorCallback === 'function') {
        errorCallback(errorJSON);
      };
    });
  },

  create(item, callback, errorCallback) {
    const URL = BASE_URL;

    fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'clientID': item.clientID,
        'accountID': item.accountID,
        'balance': item.balance
      })
    })
    .then((response) => {
      if (typeof callback === 'function') {
        callback(response.json());
      };
    })
    .catch((error) => {
      if (typeof errorCallback === 'function') {
        errorCallback(error.message);
      };
    });
  },

  update(item, callback, errorCallback) {
    const URL = BASE_URL;

    fetch(URL, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'clientID': item.clientID,
        'accountID': item.accountID,
        'balance': item.balance
      })
    })
    .then(response => response.json())
    .then((responseJSON) => {
      if (typeof callback === 'function') {
        callback(responseJSON);
      };
    })
    .catch((errorJSON) => {
      if (typeof errorCallback === 'function') {
        errorCallback(errorJSON);
      };
    });
  },

  delete(item, callback, errorCallback) {
    const URL = BASE_URL + '/delete'
      + '?clientid=' + item.clientID
      + '&accountid=' + item.accountID;

    fetch(URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then((responseJSON) => {
      if (typeof callback === 'function') {
        callback(responseJSON);
      };
    })
    .catch((errorJSON) => {
      if (typeof errorCallback === 'function') {
        errorCallback(errorJSON);
      };
    });
  },

  getDetails(item, callback, errorCallback) {
    const URL = BASE_URL + '/getdetails'
      + '?clientid=' + item.clientID
      + '&accountid=' + item.accountID;

    fetch(URL)
    .then(response => response.json())
    .then((responseJSON) => {
      if (typeof callback === 'function') {
        callback(responseJSON);
      };
    })
    .catch((errorJSON) => {
      if (typeof errorCallback === 'function') {
        errorCallback(errorJSON);
      };
    });
  }
};

function DetailsView(props) {

  var UpdateInputBalance;

  if (props.item != null) {
    return (
      <div>

        <hr/>

        First Name: {props.item.firstName} <br/>
        Last Name: {props.item.lastName} <br />
        Account Description: {props.item.accountDescription} <br />
        Balance: {props.item.balance} <br />

        <h3>Update Balance:</h3>
        Balance:<input type="text" ref={(element) => UpdateInputBalance = element} /><br />
        <button onClick={() => {
            fetchService.update(
              {
                clientID: props.item.clientID,
                accountID: props.item.accountID,
                balance: UpdateInputBalance.value
              },
              props.updateCallback,
              props.errorCallback,
            );
          }
        }>update</button>

        <hr/>

      </div>
    );
  } else {
    return null;
  }
  
};

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      clientAccounts: [], 
      detailsItem: null
    };

    this.getAllCallback = this.getAllCallback.bind(this);
    this.createCallback = this.createCallback.bind(this);
    this.updateCallback = this.updateCallback.bind(this);
    this.deleteCallback = this.deleteCallback.bind(this);
    this.getDetailsCallback = this.getDetailsCallback.bind(this);
    this.clearDetailsItem = this.clearDetailsItem.bind(this);
    this.errorCallback = this.errorCallback.bind(this);
    this.refreshViewCallback = this.refreshViewCallback.bind(this);
    
  };

  componentDidMount() {
    fetchService.getAll(this.getAllCallback, this.errorCallback);
  };

  getAllCallback(responseJSON){
    this.setState({ clientAccounts: responseJSON});
  };

  createCallback() {
    this.createInputClientID.value = '';
    this.createInputAccountID.value = '';
    this.createInputBalance.value = '';
    this.refreshViewCallback();
  };

  updateCallback() {
    this.refreshViewCallback();
  };

  deleteCallback() {
    this.refreshViewCallback();
  };

  getDetailsCallback(responseJSON) {
    this.setState({ detailsItem: responseJSON});
  };

  clearDetailsItem() {
    this.detailsInputClientID.value = '';
    this.detailsInputAccountID.value = '';
    this.setState({ detailsItem: null });
  };

  errorCallback(errorJSON) {
    //alert(JSON.stringify(errorJSON));
  };

  refreshViewCallback() {
    fetchService.getAll(this.getAllCallback, this.errorCallback);
    fetchService.getDetails(this.state.detailsItem, this.getDetailsCallback, this.errorCallback);
  };

  render() {
    return (
      <div>

        <h2>Show Client Account Details</h2>
        Client ID:<input type="text" ref={(element) => this.detailsInputClientID = element} /><br />
        Account ID:<input type="text" ref={(element) => this.detailsInputAccountID = element} /><br />
        <button onClick={() => {
            fetchService.getDetails(
              {
                clientID: this.detailsInputClientID.value,
                accountID: this.detailsInputAccountID.value
              },
              this.getDetailsCallback,
              this.errorCallback,
            );
          }
        }>Show</button>
        <button onClick={this.clearDetailsItem}>Clear</button>
        <DetailsView 
          item={this.state.detailsItem} 
          updateCallback={this.updateCallback}
          errorCallback={this.errorCallback}
        />

        <h2>Create New Client Account</h2>
        Client ID:<input type="text" ref={(element) => this.createInputClientID = element} /><br />
        Account ID:<input type="text" ref={(element) => this.createInputAccountID = element} /><br />
        Balance:<input type="text" ref={(element) => this.createInputBalance = element} /><br />
        <button onClick={() => {
            fetchService.create(
              {
                clientID: this.createInputClientID.value,
                accountID: this.createInputAccountID.value,
                balance: this.createInputBalance.value
              },
              this.createCallback,
              this.errorCallback,
            );
          }
        }>Create</button>
        
        <h2>Client Accounts List</h2>
        <ul>
          {this.state.clientAccounts.map((item, index) => (
            <li key={index}>
              ClientID: {item.clientID}, AccountID: {item.accountID} , Balance: {item.balance}
              <button onClick={() => {
                  fetchService.delete(
                    item,
                    this.deleteCallback,
                    this.errorCallback,
                  );
                }
              }>delete</button>
            </li>
          ))}
        </ul>

      </div>
    )
  };
}
export default App;


