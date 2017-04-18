/**
 * Created by jamesbillinger on 4/18/17.
 */
import React, { Component } from 'react';
import TextField from "material-ui/TextField";

export default class FormInput extends Component {
  focus() {
    this._field && this._field.focus();
  }

  render() {
    const {style, type, input, meta, label, ...props} = this.props;
    const { value, onChange, onBlur, onFocus } = input || props;
    const { error, touched } = meta || props;
    let newStyle = Object.assign({
      margin:'0px 10px',
      verticalAlign:'top',
      fontWeight:'normal'
    }, style);
    if (props.disabled) {
      newStyle.color = 'rgba(0,0,0,0.3)';
    }
    if (props.multiLine) {
      newStyle.width = '80%';
    }
    return (
      <TextField ref={(c) => this._field = c} id='unique' style={newStyle} value={value || ''}
                 floatingLabelStyle={{pointerEvents: 'none', whiteSpace:'nowrap', left:'0px', color:'rgba(33, 33, 33, 0.5)'}}
                 type={type} onChange={onChange} floatingLabelText={label} errorText={(touched && error) ? error : null}
                 underlineFocusStyle={{borderColor:'rgb(158, 158, 158)'}} onBlur={onBlur} onFocus={onFocus} {...props} />
    );
  }
}