import firebase from 'firebase';
import config from '../config.json';

const firebaseApp = firebase.initializeApp(config.firebase);
const database = firebaseApp.database();
const firebaseRef = database.ref();

export function getRecipes() {
  return dispatch => {
    firebaseRef.child('/recipes/').on('value', (snap) => {
      dispatch({type: 'FETCH_RECIPES_STARTED'});
      let items = {};
      snap.forEach((child) => {
        items[child.key] = child.val();
      });
      dispatch({
        type: 'FETCH_RECIPES_SUCCEEDED',
        payload: items
      });
    }, (err) => {
      console.log(err);
    });
  }
}

export function getRecipe(id) {
  return dispatch => {
    dispatch({type: 'FETCH_RECIPE_STARTED'});
    firebaseRef.child('/recipes/' + id).once('value', (snap) => {
      snap.forEach((child) => {
        dispatch({
          type: 'FETCH_RECIPE_SUCCEEDED',
          key: child.key,
          val: child.val()
        });
      });
    }, (err) => {
      console.log(err);
    });
  }
}

export function submitRecipe(data, cb) {
  return dispatch => {
    dispatch({type: 'SAVE_RECIPE_STARTED'});
    let ref = firebaseRef.child('/recipes').push(data, (err) => {
      if (err) {
        console.log(err);
      } else {
        dispatch({type: 'SAVE_RECIPE_SUCCEEDED'});
        cb && cb();
      }
    });
  }
}