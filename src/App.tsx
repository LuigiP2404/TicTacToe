import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [currentPlayer, setCurrentPlayer] = useState<string>('X');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [player1, updatePlayer1] = useState<number[]>([]);
  const [player2, updatePlayer2] = useState<number[]>([]);
  const [winner, updateWinner] = useState<string>('');

  const winConditions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  useEffect(() => {
    if (currentRound > 5) {
      checkWinCondition();
    }
  }, [player1, player2]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!winner) {
      const el = event.target as HTMLDivElement;
      if (!el.innerText) {
        setCurrentRound(currentRound + 1);
        if (currentPlayer === 'X') {
          el.innerText = 'X';
          el.classList.add('green');
          updatePlayer1([...player1, index]);
          setCurrentPlayer('O');
        } else {
          el.innerText = 'O';
          el.classList.add('cyan');
          updatePlayer2([...player2, index]);
          setCurrentPlayer('X');
        }
      }
    }
  };

  const checkWinCondition = () => {
    let p1 = player1;
    let p2 = player2;
    winConditions.forEach(function(winCond) {
      let p1won = winCond.every(elem => p1.includes(elem));
      let p2won = winCond.every(elem => p2.includes(elem));
      if (p1won) {
        updateWinner('X');
      } else if (p2won) {
        updateWinner('O');
      } else if (currentRound == 11) {
        updateWinner('Draw');
      }
    })
  };

  const clearTable = () => {
    const cells = document.getElementsByClassName('cell');
    Array.from(cells).forEach((el: Element) => {
      if (el instanceof HTMLDivElement) {
        el.innerText = '';
        el.classList.remove('cyan');
        el.classList.remove('green');
      }
    })
  };

  const restartGame = () => {
    setCurrentPlayer('X');
    setCurrentRound(1);
    updatePlayer1([]);
    updatePlayer2([]);
    updateWinner('');
    clearTable();
  };

  return (
    <div className="App">
      <h1 className="title gradient-text">Tic Tac Toe</h1>
      { winner ? null : <h2>Current player: { currentPlayer == 'X' ? <span className="green">{currentPlayer}</span> : <span className="cyan">{currentPlayer}</span> }</h2> }
      { winner ? <React.Fragment>
        { winner == 'X' || winner == 'O' ? <h2>Winner: { winner == 'X' ? <span className="green">{winner}</span> : <span className="cyan">{winner}</span> }</h2> : <h2>Draw</h2> }
        </React.Fragment> : null }
      <div className="grid">
        <div className="row">
          <div className="cell" onClick={(e) => {handleClick(e, 1)}}>

          </div>
          <div className="cell" onClick={(e) => {handleClick(e, 2)}}>

          </div>
          <div className="cell" onClick={(e) => {handleClick(e, 3)}}>

          </div>
        </div>
        <div className="row">
          <div className="cell" onClick={(e) => {handleClick(e, 4)}}>

          </div>
          <div className="cell" onClick={(e) => {handleClick(e, 5)}}>

          </div>
          <div className="cell" onClick={(e) => {handleClick(e, 6)}}>

          </div>
        </div>
        <div className="row">
          <div className="cell" onClick={(e) => {handleClick(e, 7)}}>

          </div>
          <div className="cell" onClick={(e) => {handleClick(e, 8)}}>

          </div>
          <div className="cell" onClick={(e) => {handleClick(e, 9)}}>

          </div>
        </div>
      </div>
     { winner ?  <a onClick={restartGame} className="restart-button">Restart</a> : null }
       
    </div>
  );
}

export default App;
