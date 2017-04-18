/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from 'components/login';
//import Register from 'components/register';
import Dashboard from 'components/dashboard';
import firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'public/theme.css';
import configureStore from './store';
import * as Actions from 'app/actions';

const store  = configureStore({});

class App extends Component {
  state = {};

  componentWillMount() {
    injectTapEventPlugin();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn:true
        });
      } else {
        this.setState({
          loggedIn:false
        });
      }
    });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      //this.setState({loggedIn: false});
    }, (error) => {
      console.log(error);
    });
  }

  onLoggedIn() {
    this.setState({
      loggedIn: true
    })
  }

  render() {
    const { loggedIn } = this.state;
    if (typeof loggedIn === 'undefined') {
      return (
        <div></div>
      );
    } else {
      return (
        <Provider store={store}>
          <MuiThemeProvider>
            <BrowserRouter>
              <div style={{height:'100%', display:'flex', flexDirection:'column', width:'100%'}}>
                <div style={{flex: '0 0 50px', display: 'flex', alignItems:'center', borderBottom:'1px solid #eee',
                  backgroundColor:'#f9f9f9', padding:'0px 10px'}}>
                  <div style={{flex:'1 0 auto'}}>
                    <h2>Mom's Cookbook</h2>
                  </div>
                  {loggedIn &&
                  <button style={{border: 'none', background: 'transparent'}} onClick={::this.logout}>
                    {firebase.auth().currentUser.displayName}: Logout
                  </button>
                  }
                </div>
                <div style={{flex:'1 0 auto', width:'100%', display:'flex', flexDirection:'column'}}>
                  <Switch>
                    <Route path='/login' exact={true} render={(props) => {
                      if (loggedIn) {
                        return <Redirect to='/' />;
                      } else {
                        return <Login {...props} onLoggedIn={::this.onLoggedIn} />;
                      }
                    }} />
                    <Route path='/' render={(props) => {
                      if (!loggedIn) {
                        return <Redirect to='/login' />;
                      } else {
                        return <Dashboard {...props} firebaseRef={this.firebaseRef} auth={this.auth} />;
                      }
                    }} />
                    <Route render={() => <h3>No Match</h3>} />
                  </Switch>
                </div>
              </div>
            </BrowserRouter>
          </MuiThemeProvider>
        </Provider>
      );
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);