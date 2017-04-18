/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import Recipe from './recipe';
import Button from 'components/button';

class Dashboard extends Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.getRecipes();
    /*const { firebaseRef } = this.props;
    const { selectedRecipe } = this.state;
    firebaseRef.child('/recipes/').on('value', (snap) => {
      let recipes = [];
      snap.forEach((child) => {
        recipes.push(Object.assign({}, child.val(), {key: child.key}));
      });
      this.setState({recipes})
    }, (error) => {
      console.log(error);
    });*/
  }

  openRecipe(id) {
    const { history } = this.props;
    if (id) {
      history.push('/recipe/' + id);
    } else {
      history.push('/recipe');
    }
  }

  render() {
    const { history, location, cookbook } = this.props;
    const { recipesData } = cookbook;
    return (
      <div style={{flex:'1 0 auto', width:'100%', display:'flex'}}>
        <div style={{width:'200px', borderRight:'1px solid #eee'}}>
          <div style={{textAlign:'center', padding:'10px 0px'}}>
            <Button onClick={this.openRecipe.bind(this, '')}>Add New Recipe</Button>
          </div>
        </div>
        <div style={{flex:'1 0 auto', padding:'10px'}}>
          {recipesData && Object.keys(recipesData).map((k) => {
            const r = recipesData[k];
            return (
              <div key={k} style={{display:'flex'}}>
                <div>{k}</div>
                <div>{r.title}</div>
              </div>
            );
          })}
          <Route path='/recipe/:recipeid?' component={Recipe} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cookbook: state.cookbook
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...Actions}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);