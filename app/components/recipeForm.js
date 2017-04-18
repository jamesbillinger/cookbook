/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Field, FieldArray, reduxForm } from 'redux-form';
import FormInput from 'components/formInput';
import numericQuantity from 'numeric-quantity';
import Button from 'components/button';

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

class Ingredient extends Component {
  render() {
    const { input } = this.props;
    const { value } = input;
    let unitString = value.unit;
    if (value.unit && units[value.unit]) {
      unitString = units[value.unit].abbreviation || units[value.unit].label;
      if (numericQuantity(value.amount) > 1) {
        unitString = units[value.unit].plural || (unitString + 's');
      }
    }
    return (
      <div>{value.amount} {unitString} {value.item}</div>
    );
  }
}

class Ingredients extends Component {
  render() {
    const { fields } = this.props;
    return (
      <div style={{width:'80%', marginLeft:'10px', marginTop:'20px', borderBottom:'1px solid #ddd', paddingBottom:'5px'}}>
        <div style={{color:'rgba(33, 33, 33, 0.5)', fontSize:'12px', lineHeight:'16.5px', marginBottom:'5px'}}>
          Ingredients
        </div>
        {fields.map((f, fi) => (
          <Field key={fi} name={f} component={Ingredient} />
        ))}
        {/*ingredients.map((i, ii) => {
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
         })*/}
      </div>
    )
  }
}

class RecipeForm extends Component {
  constructor() {
    super();
    this.state = {};
    this._save = ::this.save;
  }

  componentWillMount() {
    this._processRecipe = debounce(() => {
      this.parseRecipe();
    }, 250);
  }

  parseRecipe() {
    const { change } = this.props;
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
    change('directions', directions);
    change('title', title);
    change('ingredients', ingredients);
    /*this.setState({
      ingredients,
      title,
      directions
    });*/
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

  save(data) {
    const { actions, closeAction } = this.props;
    const { recipe } = this.state;
    let imported = {};
    if (recipe) {
      imported.recipe = recipe;
    }
    actions.submitRecipe(Object.assign({}, data, imported), closeAction);
  }

  render() {
    const { initialValues, mode, handleSubmit, closeAction } = this.props;
    const { recipe } = this.state;
    return (
      <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
        <div style={{display:'flex', flexWrap:'wrap', flex:'1 1 auto'}}>
          {mode === 'add' &&
            <FormInput name='recipe' multiLine={true} label='Import'
                       input={{value:recipe, onChange:this.recipeChanged.bind(this)}} />
          }
          <Field component={FormInput} name='title' label='Title' disabled={!mode} />
          <Field component={FormInput} name='directions' label='Directions' disabled={!mode} multiLine={true} />
          <FieldArray component={Ingredients} name='ingredients' />
        </div>
        <div style={{flex:'1 1 auto'}}></div>
        <div style={{flex:'0 0 50px', display:'flex', justifyContent:'center', paddingTop:'10px'}}>
          <Button primary={true} style={{margin:'0px 10px'}} onClick={handleSubmit(::this.save)}>Save</Button>
          <Button secondary={true} style={{margin:'0px 10px'}} onClick={closeAction}>Cancel</Button>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'recipe'
})(RecipeForm);