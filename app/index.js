/**
 * Created by jamesbillinger on 3/4/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'public/theme.css';
import numericQuantity from 'numeric-quantity';

//standard base is teaspoon
//metric base is gram
const units = {
  cup: {
    label:'cup',
    type:'standard',
    factor: 48
  },
  oz: {
    label:'oz',
    plural: 'oz',
    type:'standard',
    factor: 6
  },
  tsp: {
    label: 'tsp',
    type: 'standard',
    factor: 1
  },
  lb: {
    label: 'lb',
    type: 'standard_weight'
  }
};

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
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
    let title = '';
    let directions = recipe.trim();
    let ingredients = [];
    let ti = directions.indexOf('\n');
    if (ti > -1) {
      title = this.toTitleCase(directions.substring(0,ti).trim());
      directions = directions.substring(ti + 1);
    }
    let tmp = directions;
    while (tmp.indexOf('\t\t') > -1) {
      tmp = tmp.replaceAll('\t\t','\t');
    }
    tmp = tmp.replaceAll('\t', ', ').replaceAll('\n', ', ');
    let s = tmp.split(/[\s\n]+/);
    s.map((w, wi) => {
      if (typeof amount === 'undefined') {
        //first watch for a number to start an amount
        let num = w.match(/\d+/g);
        if (num !== null && num.length > 0) {
          num = w.match(/[\d\/]+/g);
          if (num !== null && num.length > 0) {
            amount = num[0];
            if (w.length > amount.length) {
              //unit is part of same word
              unit = this.parseUnit(w.replaceAll('num', ''));
            }
          }
        }
      } else if (typeof amount !== 'undefined' && typeof unit === 'undefined') {
        //then see what comes next to see if it is a unit or a whole item or something else
        if (w === 'to' && s[wi + 1].match(/\d+/g) !== null) {
          amount += ' to ';
        } else if (w === 'x' && s[wi + 1].match(/\d+/g) !== null) {
          //probably a dimension
          amount += ' x ';
        } else {
          let num = w.match(/[\d\/]+/g);
          if (num !== null && num.length > 0) {
            //this is probably a fraction - 1 1/2 or such
            amount += ' ' + w;
          } else {
            unit = this.parseUnit(w);
            if (unit === 'notUnit') {
              amount = undefined;
              unit = undefined;
              item = '';
            } else if (unit === 'whole') {
              unit = '';
              item += w.replaceAll(/[,.]+/, '');
            }
          }
        }
      } else if (typeof amount !== 'undefined' && typeof unit !== 'undefined') {
        //now try to find the end of the item - look for punctuation
        if (w.match(/[,.]/g) !== null) {
          //console.log('punctuation', w.match(/[,.]/g));
          item += w.replaceAll(/[,.]+/,'');
          ingredients.push({
            amount,
            unit,
            item
          });
          amount = undefined;
          unit = undefined;
          item = '';
        } else {
          item += w.replaceAll(/[,.]+/,'') + ' ';
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
      ingredients,
      title,
      directions
    });
  }

  toTitleCase(str)
  {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  parseUnit(unit) {
    let u = unit && unit.trim().toLowerCase();
    let notUnit = [
      'min',
      'day',
      'ho',
      'sec',
      'deg'
    ];
    if (u) {
      if (u.startsWith('cup')) {
        return 'cup';
      } else if (u.startsWith('oz') || u.startsWith('ou')) {
        return 'oz';
      } else if (u.startsWith('tsp') || u.startsWith('tea')) {
        return 'tsp';
      } else if (u.startsWith('inch')) {
        return 'inch';
      } else if (u.startsWith('lb') || u.startsWith('pound')) {
        return 'lb';
      } else if (u.startsWith('stick') || u.startsWith('stc')) {
        return 'stick';
      } else if (u.startsWith('pack') || u.startsWith('pk')) {
        return 'package';
      } else if (u.startsWith('cart')) {
        return 'carton';
      } else {
        let ret = true;
        notUnit.map((n) => {
          if (u.startsWith(n)) {
            ret = false;
          }
        });
        if (ret) {
          return 'whole';
        } else {
          return 'notUnit';
        }
      }
    }
  }

  recipeChanged(e) {
    this.setState({recipe: e.target.value});
    this._processRecipe();
  }

  render() {
    const { recipe, ingredients, title, directions } = this.state;
    let cellStyle = {
      padding:'0px 5px'
    };
    return (
      <MuiThemeProvider>
        <div>
          <h2>Cookbook</h2>
          <div style={{display:'flex', alignItems:'flex-end'}}>
            <TextField name='recipe' multiLine={true} value={recipe} onChange={::this.recipeChanged} style={{width:'500px'}} />
            <button onClick={this._processRecipe} style={{height:'24px'}}>Run</button>
          </div>
          <h2>{title}</h2>
          <table>
            <thead><tr><th>Measurement</th><th>Ingredient</th></tr></thead>
            <tbody>
              {ingredients.map((i, ii) => {
                let unitString = i.unit;
                if (units[i.unit]) {
                  unitString = units[i.unit].abbreviation || units[i.unit].label;
                  if (numericQuantity(i.amount) > 1) {
                    unitString = units[i.unit].plural || (unitString + 's');
                  }
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
          <h4 style={{marginTop:'30px', marginBottom:'5px'}}>Directions</h4>
          <div style={{whiteSpace:'pre-wrap'}}>{directions}</div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
