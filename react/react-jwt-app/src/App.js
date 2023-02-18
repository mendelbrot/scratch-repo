import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const BASE_URL = 'http://inclass4-chat.azurewebsites.net/api/login/'
//const BASE_URL = 'http://localhost:49207/api/login/';
const defaultEmail = 'bob@home.com'
const defaultPassword = 'P@ssw0rd!'

class App extends Component {

  
  email = defaultEmail
  password = defaultPassword;

  constructor(){
    super()
    this.state = { token: '', message: '', stringArray: [], loginName: '' }

    this.getSecureData = this.getSecureData.bind(this);
    this.getLoginName = this.getLoginName.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.showContentIfLoggedIn = this.showContentIfLoggedIn.bind(this);
  }

  componentDidMount(){
    this.showContentIfLoggedIn()
  }


  getSecureData() {
    const URL = BASE_URL + 'list';

    fetch(URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      }
    })
      .then(response => response.json())
      .then((r) => {
        console.log(r)
        this.setState({stringArray: r})
      }).catch(error => console.log(error))
  }

  getLoginName(){
    const URL = BASE_URL + 'name';

    fetch(URL, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.state.token
      }
    })
      .then(response => response.json())
      .then((r) => {
        console.log(r)
        if (r.status == 'OK'){
          this.setState({ loginName: r.loginName })
        }
      }).catch(error => console.log(error))
  }

  login() {
    const URL = BASE_URL;

    this.email = this.emailInput.value
    this.password = this.passwordInput.value

    fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'Password': this.password,
        'Email': this.email,
        'RememberMe': false,
      }),
    })
      .then(response => response.json())
      .then((r) => {
        if (r['status'] == 'OK') {
          localStorage.setItem('auth_token', r["token"]);
          this.setState({ token: r["token"], message: "The user has been logged in."})
        } else {
          this.message = r["status"];
        }
      }).catch(error => {
        localStorage.clear();
        this.message = 'Not logged in. ' + JSON.stringify(error);
      })
  }

  logout() {
    localStorage.clear();
    this.showContentIfLoggedIn();
  }

  showContentIfLoggedIn() {
    if (sessionStorage.getItem('auth_token') != null) {
      this.setState({token: sessionStorage.getItem('auth_token')})
      this.message = "The user has been logged in."
    }
    else {
      this.setState({message: "Not logged in."})
      this.setState({stringArray: []})
      this.setState({ token: '' })
      this.setState({ loginName: '' })
    }
  }

  render() {
    return (
      <div>
        Login name: <input type='text' defaultValue={defaultEmail} ref={(element) => this.emailInput = element} /><br />
        Password: <input type='text' defaultValue={defaultPassword} ref={(element) => this.passwordInput = element} /><br />
        <input type='button' value='login' onClick={this.login} />
        <br /><br />
        Token: { this.state.token }<br />
        Message: { this.state.message }
        <br /><br />

        <input type='button' value='Get Secure Data' onClick={this.getSecureData}/><br />
        <ul>
          {this.state.stringArray.map((item, index) => (
              <li key={index}> { item }</li>
            ))}
        </ul>
        <br /> <br />

        <input type='button' value='Show login name' onClick={this.getLoginName} />
        {this.state.loginName}
        <br /> <br />

        <input type='button' value='Logout' onClick={this.logout} />
        <br /> <br />

      </div>
    );
  }
}

export default App;
