/**
 * Created by jamesbillinger on 4/18/17.
 */
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

const initialState = {};
function cookbook(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_RECIPES_STARTED':
      return Object.assign({}, state, {
        fetchingRecipes: true
      });
    case 'FETCH_RECIPES_SUCCEEDED':
      return Object.assign({}, state, {
        fetchingRecipes: false,
        recipesData: action.payload
      });

    case 'FETCH_RECIPE_STARTED':
      return Object.assign({}, state, {
        ['fetchingRecipe_' + action.key]: true
      });
    case 'FETCH_RECIPE_SUCCEEDED':
      return Object.assign({}, state, {
        ['fetchingRecipe_' + action.key]: false,
        recipesData: Object.assign({}, state.recipesData || {}, {[action.key]: action.val})
      });

    case 'SAVE_RECIPE_STARTED':
      return Object.assign({}, state, {
        savingRecipe: true
      });
    case 'SAVE_RECIPE_SUCCEEDED':
      return Object.assign({}, state, {
        savingRecipe: false
      });

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  cookbook,
  form: formReducer
});

export default rootReducer;