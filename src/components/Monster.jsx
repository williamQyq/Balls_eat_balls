import React, { Component } from 'react';

class Monster extends Component {
  constructor(props) {
    super(props);
    // Initializes the state
    this.state = {
      position: this.props.position, 
      size: props.size,
      speed: 10, 
    };
  }

  // Updates the position and size in the state
  componentDidUpdate(prevProps) {
    if (this.props.position !== prevProps.position) {
      this.setState({
        position: this.props.position,
        size: this.props.size,
      });
    }
  }

  // Starts the monster chasing logic when the component mounts.
  componentDidMount() {
    this.startChasingPlayer();
  }

  componentWillUnmount() {
    clearInterval(this.chaseInterval);
  }

  // Sets up an interval to repeatedly invoke the chase logic.
  startChasingPlayer = () => {
    // Chases the player every 100 milliseconds.
    this.chaseInterval = setInterval(this.chasePlayer, 100); 
  };

  chasePlayer = () => {
    const { position, speed } = this.state;
    const { playerPosition } = this.props;

    // Calculates the direction towards the player to move the monster.
    const dx = playerPosition.x - position.x;
    const dy = playerPosition.y - position.y;
    const angle = Math.atan2(dy, dx);

    // Moves the monster towards the player based on the calculated angle and speed.
    const newX = position.x + Math.cos(angle) * speed;
    const newY = position.y + Math.sin(angle) * speed;

    // Updates the monster's position in the state and notifies the parent component.
    this.setState({ position: { x: newX, y: newY } }, () => {
      this.props.onPositionChange(this.state.position);
    });
  };

  render() {
    const { position, size } = this.state;
    const radius = size / 2;

    // Styles the monster element
    const monsterStyle = {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: 'red',
      borderRadius: '50%',
      left: `${position.x - radius}px`,
      top: `${position.y - radius}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white', 
      fontSize: `${Math.max(12, size / 4)}px`, // Dynamically adjusts font size based on monster size.
      userSelect: 'none', // Prevents text selection for better UX.
    };

    return (
      <div style={monsterStyle}>
        {Math.floor(size)}  {/* Displays the integer part of the monster's size. */}
      </div>
    );
  }
}

export default Monster;