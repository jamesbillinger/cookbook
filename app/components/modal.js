/**
 * Created by jamesbillinger on 4/18/17.
 */
import React, { Component } from 'react';
import Modal from 'react-modal';

export default class MyModal extends Component {
  render() {
    const {open, closeAction, style, ...props} = this.props;
    let myStyle = {
      overlay: Object.assign({zIndex: 10}, style)
    };
    return <Modal isOpen={open} onRequestClose={closeAction} contentLabel='' style={myStyle} {...props} />;
  }
}