/**
 * Created by jamesbillinger on 4/18/17.
 */
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class Button extends Component {
  render() {
    const { onClick, ...props } = this.props;
    return <RaisedButton onTouchTap={onClick} {...props} />;
  }
}