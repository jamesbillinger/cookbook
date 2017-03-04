/**
 * Created by jamesbillinger on 3/4/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//standard base is ounce
//metric base is gram
const units = {
  cup: {
    label:'Cup',
    type:'standard',
    factor: 8
  },
  oz: {
    label:'Ounce',
    abbreviation: 'oz',
    type:'standard',
    factor: 8
  }
};

class Root extends Component {
  constructor() {
    super();
    injectTapEventPlugin();
    this.state = {
      recipe: '',
      ingredients: []
    };
  }

  componentWillMount() {
    this._processRecipe = debounce(() => {
      this.parseRecipe();
    }, 250);
  }

  parseRecipe() {
    const { recipe } = this.state;
    let amount;
    let unit;
    let item = '';
    let ingredients = [];
    let s = recipe.split(' ');
    s.map((w, wi) => {
      if (typeof amount === 'undefined') {
        let num = w.match(/\d+/g);
        if (num !== null) {
          console.log(num);
          amount = num;
          if (w.length > num.length) {
            unit = w.replace('num', '');
            //unit is part of same word
          }
        }
      } else if (typeof amount !== 'undefined' && typeof unit === 'undefined') {
        unit = w;
      } else if (typeof amount !== 'undefined' && typeof unit !== 'undefined' ) {
        //check for punctuation
        if (item.length > 0 && w.match(/[,.]/g) !== null) {
          console.log('punctuation', w.match(/[,.]/g));
          item += w.replace(',','').replace('.','');
          ingredients.push({
            amount,
            unit,
            item
          });
          amount = undefined;
          unit = undefined;
          item = '';
        } else {
          item += w + ' ';
          if (wi === s.length - 1) {
            ingredients.push({
              amount,
              unit,
              item
            });
          }
        }
      }
    });

    this.setState({
      ingredients: ingredients
    });
  }

  parseUnit(unit) {
    let u = unit && unit.trim().toLowerCase();
    if (u) {
      if (u.startsWith('cup')) {
        return units.cup;
      } else if (u.startsWith('cup')) {
        return units.cup;
      } else {
        return u;
      }
    }
  }

  recipeChanged(e) {
    this.setState({recipe: e.target.value});
    this._processRecipe();
  }

  render() {
    const { recipe, ingredients } = this.state;
    let cellStyle = {
      padding:'0px 5px'
    };
    return (
      <MuiThemeProvider>
        <div>
          <h2>Cookbook</h2>
          <TextField name='recipe' multiLine={true} value={recipe} onChange={::this.recipeChanged} style={{width:'500px'}} />
          <table>
            <thead>
              <tr>
                <th>Measurement</th>
                <th>Ingredient</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((i, ii) => {
                let unitString = i.unit.label || i.unit;
                if (i.amount !== 1) {
                  unitString = i.unit.plural || (unitString + 's');
                }
                return (
                  <tr key={ii}>
                    <td style={cellStyle}>{i.amount} {unitString}</td>
                    <td style={cellStyle}>{i.item}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
