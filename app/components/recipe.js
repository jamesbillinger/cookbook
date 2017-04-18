/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import RecipeForm from './recipeForm';
import Modal from 'components/modal';

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (!props.match.params.recipeid) {
      this.state.mode = 'add';
    }
  }

  componentDidMount() {
    const { match, cookbook } = this.props;
    if (match.params.recipeid && (!cookbook.recipes || !cookbook.recipes[match.params.recipeid])) {
      //load recipe
      actions.getRecipe(match.params.recipeid);
    }
  }

  closeRecipe() {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const { cookbook, match, actions } = this.props;
    const { mode } = this.state;
    let recipe;
    if (match.params.recipeid) {
      recipe = cookbook.recipesData && cookbook.recipesData[match.params.recipeid];
    } else {
      recipe = {};
    }
    return (
      <Modal open={true} closeAction={this.closeRecipe.bind(this)}>
        {(recipe) &&
          <RecipeForm initialValues={recipe} mode={mode} closeAction={this.closeRecipe.bind(this)} actions={actions} />
        }
      </Modal>
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
)(Recipe);