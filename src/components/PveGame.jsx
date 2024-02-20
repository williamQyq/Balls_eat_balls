import React, { Component } from 'react';
import Food from './Food';
import Player from './Player';
import Monster from './Monster';
import Poison from './Poison';
import ScoreBoard from './ScoreBoard';


class PvEGame extends Component {
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      foods: [], // Array to store food positions
      poisons: [], // Array to store poison positions
      playerPosition: { x: 1000, y: 500 }, // Initial player position
      playerSize: 10, // Initial player size
      monsterPosition: this.generateRandomPosition(), // Initial monster position
      monsterSize: 200, // Initial monster size
      isGameOver: false, // Flag to track if the game is over
      viewportOffset: { x: 0, y: 0 }, // Offset for the viewport, used for scrolling
      canvasWidth: 1920, // Width of the game canvas
      canvasHeight: 1080, // Height of the game canvas
      playerScore: 0, // Player's score
      monsterScore: 0, // Monster's score
    };
  }

  componentDidMount() {
    this.generateInitialFoods();
    this.startGameLoop();
    this.updateViewportOffset(this.state.playerPosition); // Center viewport on the player at the start
  }
  

  componentWillUnmount() {
    clearInterval(this.gameLoopInterval); // Clean up by clearing the game loop interval
  }


  generateInitialFoods() {
    const foods = [];
    const poisons = []; 
    for (let i = 0; i < 300; i++) { 
      foods.push(this.generateRandomPosition());
      if (i % 30 === 0) { // Generate a poison for every 30 foods
        poisons.push(this.generateRandomPosition());
      }
    }
    this.setState({ foods, poisons });
}

  // Generates a random position within the canvas
  generateRandomPosition() {
    const x = Math.floor(Math.random() * 1920);
    const y = Math.floor(Math.random() * 1080);
    return { x, y };
  }

  // Starts the game loop
  startGameLoop() {
    this.gameLoopInterval = setInterval(() => {
      this.setState((prevState) => ({
        playerPosition: prevState.playerPosition,
        monsterPosition: prevState.monsterPosition,
      }), () => {
        this.checkCollisionWithMonster(); 
      });
    }, 1000 / 60); // 60 times per second
  }
  
  // Updates player position and checks for collisions
  updatePlayerPosition = (newPosition) => {
    this.handleFoodCollision(newPosition, 'player');
    this.handlePoisonCollision(newPosition, 'player'); 
    this.setState({ playerPosition: newPosition });
    this.updateViewportOffset(newPosition);
  };
  
  // Updates monster position and checks for collisions
  handleMonsterPositionChange = (newPosition) => {
    this.handleFoodCollision(newPosition, 'monster');
    this.handlePoisonCollision(newPosition, 'monster'); 
    this.setState({ monsterPosition: newPosition });
  };

  // Handles collision with food for both player and monster
  handleFoodCollision = (newPosition, collider) => {
    const { foods, playerSize, monsterSize } = this.state;
    let sizeKey = collider === 'player' ? 'playerSize' : 'monsterSize';
    let collided = false;

    const newFoods = foods.filter(food => {
      const dx = newPosition.x - food.x;
      const dy = newPosition.y - food.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const colliderSize = collider === 'player' ? playerSize : monsterSize;

      if (distance < colliderSize / 2 + 10) { 
        collided = true;
        return false;
      }
      return true;
    });

    if (collided) {
      this.setState(prevState => ({
        foods: [...newFoods, this.generateRandomPosition()],
        [sizeKey]: prevState[sizeKey] + 1,
      }));
    }
  };

  // Handles collision with poison for both player and monster
   handlePoisonCollision = (newPosition, collider) => {
    const { poisons } = this.state;
    let sizeKey = collider === 'player' ? 'playerSize' : 'monsterSize';
    const colliderSize = this.state[sizeKey];
    let newSize = colliderSize;

    const newPoisons = poisons.filter(poison => {
      const dx = newPosition.x - poison.x;
      const dy = newPosition.y - poison.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < colliderSize / 2 + 10) {
        newSize = newSize * 0.9; // reduce by 10%
        return false;
      }
      return true;
    });

    if (newSize !== colliderSize) { // Only update status when size changes
      this.setState({ [sizeKey]: newSize, poisons: newPoisons });
    }
  };

  // Checks collision between player and monster to determine the game over condition
  checkCollisionWithMonster = () => {
    const { playerPosition, playerSize, monsterPosition, monsterSize } = this.state;
    const dx = playerPosition.x - monsterPosition.x;
    const dy = playerPosition.y - monsterPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (playerSize / 2) + (monsterSize / 2)) {
      clearInterval(this.gameLoopInterval);
      let winner;
      if (playerSize > monsterSize) {
        winner = "Player wins!";
        this.setState(prevState => ({ playerScore: prevState.playerScore + 1 }));
      } else {
        winner = "Monster wins!";
        this.setState(prevState => ({ monsterScore: prevState.monsterScore + 1 }));
      }
      this.setState({ isGameOver: true });

      const message = `${winner} Play again?`;
      const restartGame = window.confirm(message);
      if (restartGame) {
        this.resetGame();
      } else {
        this.setState({ playerScore: 0, monsterScore: 0 }); // Reset scores if player chooses not to play again
        window.location.reload(); 
        
      }
    }
  };

  // Resets the game to its initial state
  resetGame = () => {
    clearInterval(this.gameLoopInterval);

    this.setState({
      foods: [],
      poisons: [],
      playerPosition: { x: 1000, y: 500 },
      playerSize: 10,
      monsterPosition: this.generateRandomPosition(),
      monsterSize: 200, 
      isGameOver: false,
      
    }, () => {
      this.generateInitialFoods();
      this.startGameLoop();
      if (this.player1Ref.current) {
        this.player1Ref.current.resetMovement();
        this.player1Ref.current.resetPosition();
      }
    });
  };

  // Updates the viewport offset to keep the player centered
  updateViewportOffset = (playerPosition) => {
    const viewportWidth = 1280;
    const viewportHeight = 720;
    let offsetX = -playerPosition.x + viewportWidth / 2;
    let offsetY = -playerPosition.y + viewportHeight / 2;
  
    
    offsetX = Math.min(0, offsetX);
    offsetY = Math.min(0, offsetY);
    offsetX = Math.max(viewportWidth - 1920, offsetX);
    offsetY = Math.max(viewportHeight - 1080, offsetY);
  
    this.setState({ viewportOffset: { x: offsetX, y: offsetY } });
  };
  
  player1Ref = React.createRef();

  render() {
    const { foods, poisons, playerPosition, playerSize, monsterPosition, monsterSize, viewportOffset, playerScore, monsterScore } = this.state;
    const gameCanvasStyle = {
      width: '1920px',
      height: '1080px',
      position: 'absolute',
      transform: `translate(${viewportOffset.x}px, ${viewportOffset.y}px)`,
      backgroundColor: '#b8d9b8',
      backgroundSize: '50px 50px',
      backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)'
    };

    return (
      <div id="gameContainer" style={{ width: '1280px', height: '720px', overflow: 'hidden', position: 'relative' }}>
        <ScoreBoard 
          player1Score={playerScore} 
          player2Score={monsterScore} 
          player1Label="Player" 
          player2Label="Monster" />
        <div id="gameCanvas" style={gameCanvasStyle}>
          {foods.map((food, index) => (
           <Food key={index} position={food} size={10} /> ))}
          {poisons.map((poison, index) => (
           <Poison key={index} position={poison} size={10} /> ))}
           <Player
            ref={this.player1Ref}
            position={this.state.playerPosition}
            size={this.state.playerSize}
            color="blue"
            controlKeys={{
              65: 'left',
              68: 'right',
              87: 'up',
              83: 'down',
            }}
            updatePosition={this.updatePlayerPosition}
            canvasWidth={this.state.canvasWidth} // Pass canvas dimensions to Player
            canvasHeight={this.state.canvasHeight}
           />
           <Monster
            position={this.state.monsterPosition}
            playerPosition={playerPosition}
            size={this.state.monsterSize}
            onPositionChange={this.handleMonsterPositionChange}
           />
        </div>
      </div>
    );
  }
}

export default PvEGame;
