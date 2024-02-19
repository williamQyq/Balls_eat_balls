import React, { Component } from 'react';

class Player extends Component {
  constructor(props) {
    super(props);
    // Initialize player's state
    this.state = {
      position: props.position, 
      size: props.size || 10, 
      speed: 2, 
      moving: { left: false, right: false, up: false, down: false }, // Object to track which direction the player is moving
    };
    this.animationFrameId = null; // Will be used to store requestAnimationFrame ID
  }

  // Event listeners to handle keyboard inputs
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    this.updatePlayerPosition();
    // Prevents the window from scrolling when arrow keys are pressed
    window.addEventListener('keydown', this.preventWindowScroll);

  }

  // Cleans up event listeners and the animation frame to prevent memory leaks
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.preventWindowScroll);
  }

  // Prevents scrolling when arrow keys are pressed
  preventWindowScroll = (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  };

  // Updates the moving state to true based on the key pressed
  handleKeyDown = (event) => {
    const { moving } = this.state;
    const direction = this.props.controlKeys[event.keyCode];
    if (direction) {
      this.setState({
        moving: { ...moving, [direction]: true },
      });
    }
  };
  
  // Updates the moving state to false when the key is released
  handleKeyUp = (event) => {
    const { moving } = this.state;
    const direction = this.props.controlKeys[event.keyCode];
    if (direction) {
      this.setState({
        moving: { ...moving, [direction]: false },
      });
    }
  };
  
  // Resets the moving state to false for all directions
  resetMovement = () => {
    this.setState({
      moving: { left: false, right: false, up: false, down: false },
    });
  };
  
  // Resets the player's position to the initial position provided through props
  resetPosition = () => {
    this.setState({ position: this.props.position });
  };

  // Continuously updates the player's position based on the current movement state
  updatePlayerPosition = () => {
    const { position, speed, moving, size } = this.state;
    const { canvasWidth, canvasHeight } = this.props; 

    let newX = position.x;
    let newY = position.y;

    // Adjusts the player's position based on the movement direction and speed
    if (moving.left) newX = Math.max(size / 2, newX - speed);
    if (moving.right) newX = Math.min(canvasWidth - size / 2, newX + speed);
    if (moving.up) newY = Math.max(size / 2, newY - speed);
    if (moving.down) newY = Math.min(canvasHeight - size / 2, newY + speed);

    const newPosition = { x: newX, y: newY };

    // Notifies the parent component of the new position and updates the state
    this.props.updatePosition(newPosition);
    this.setState({ position: newPosition });
    // Requests the next frame for smooth animation
    this.animationFrameId = requestAnimationFrame(this.updatePlayerPosition);
  };

  render() {
    const { position, size, color } = this.props; 
    const style = {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: '50%',
      left: `${position.x - size / 2}px`,
      top: `${position.y - size / 2}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white', 
      fontSize: `${Math.max(12, size / 4)}px`, 
      userSelect: 'none', 
    };

    return (
      <div style={style}>
        {Math.floor(size)} 
      </div>
    );
  }
}

export default Player;