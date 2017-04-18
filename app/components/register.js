/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react'
import { auth } from 'src/auth'

function setErrorMsg(error) {
  return {
    registerError: error.message
  }
}

export default class Register extends Component {
  state = {
    registerError: null
  };

  handleSubmit(e) {
    e.preventDefault();
    auth(this.email.value, this.pw.value)
      .catch(e =>
        this.setState(setErrorMsg(e))
      );
  }

  render () {
    const { registerError } = this.state;
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={::this.handleSubmit}>
          <div>
            <label>Email</label>
            <input ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          {registerError &&
            <div role="alert">
              <span aria-hidden="true"></span>
              <span >Error:</span>
              &nbsp;{registerError}
            </div>
          }
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}