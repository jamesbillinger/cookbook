/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react'
import firebase from 'firebase';
const providers = {
  google: new firebase.auth.GoogleAuthProvider()
};
providers.google.addScope('https://www.googleapis.com/auth/plus.login');

function setErrorMsg(error) {
  return {
    loginMessage: error
  };
}

export default class Login extends Component {
  state = {
    loginMessage: null
  };

  loginProvider(providerName) {
    const { onLoggedIn } = this.props;
    firebase.auth().signInWithPopup(providers[providerName])
      .then((result) => {
        //var token = result.credential.accessToken;
        //var user = result.user;
        onLoggedIn && onLoggedIn();
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'TRANSPORT_UNAVAILABLE') {
          firebase.auth().signInWithRedirect(providers[providerName])
            .then((result) => {
              onLoggedIn && onLoggedIn();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          //self.props.errorHandler(error);
        }
      });
  }

  render () {
    const { loginMessage } = this.state;
    return (
      <div style={{alignItems:'center', justifyContent:'center', flex:'1 0 auto', width:'100%', display:'flex',
                   flexDirection:'column'}}>
        <h1> Login </h1>
        {loginMessage}
        <button onClick={this.loginProvider.bind(this, 'google')}>Login With Google</button>
      </div>
    );
  }
}