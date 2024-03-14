import React, { Component } from 'react';

class Food extends Component {
  render() {
    const { position } = this.props; 
    return (
      position &&(
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '10px',
          backgroundColor: 'green',
          borderRadius: '50%', 
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />)
    );
  }
}

export default Food;
