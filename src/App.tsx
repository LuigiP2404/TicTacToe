import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [currentPlayer, setCurrentPlayer] = useState<string>('X');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [player1, updatePlayer1] = useState<number[]>([]);
  const [player2, updatePlayer2] = useState<number[]>([]);
  const [winner, updateWinner] = useState<string>('');
  const [availableBoard, updateAvailableBoard] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [playMode, updatePlayMode] = useState<string | null>(null);

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
    let indexOf = availableBoard.indexOf(index);
    if (indexOf >= 0) {
      availableBoard.splice(availableBoard.indexOf(index), 1);
      updateAvailableBoard(availableBoard);
      console.log(availableBoard);
    }
    if (!winner) {
      const el = event.target as HTMLDivElement;
      if (!el.innerText) {
        setCurrentRound(currentRound + 1);
        if (playMode === 'manual') {
          playerMove(currentPlayer, index, el);
        } else {
          el.innerText = 'X';
          el.classList.add('green');
          updatePlayer1([...player1, index]);
          IAMove();
        }
      }
    }
  };

  const IAMove = () => {
    if (!winner) {
      setTimeout(() => {
        const randomElement = availableBoard[Math.floor(Math.random() * availableBoard.length)];
        let indexOf = availableBoard.indexOf(randomElement);
        if (indexOf >= 0) {
          availableBoard.splice(availableBoard.indexOf(randomElement), 1);
          updateAvailableBoard(availableBoard);
          console.log(availableBoard);
        }
        const el = document.getElementById(`cell-${randomElement}`) as HTMLDivElement;
        el.innerText = 'O';
        el.classList.add('cyan');
        updatePlayer2([...player2, randomElement]);
        setCurrentPlayer('X');
        setCurrentRound(currentRound + 2);
      }, 300);   
    }
  }

  const playerMove = (player: string, index: number, el: HTMLDivElement) => {
    if (player == 'X') {
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
  };

  const checkWinCondition = () => {
    let p1 = player1;
    let p2 = player2;
    let winner = null;
    winConditions.forEach(function (winCond) {
      let p1won = winCond.every(elem => p1.includes(elem));
      let p2won = winCond.every(elem => p2.includes(elem));
      if (p1won) {
        winner = 'X';
      } else if (p2won) {
        winner = 'O';
      }
    })
    if (winner) {
      updateWinner(winner);
    } else if (currentRound == 10) {
      updateWinner('Draw');
    }
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
    updatePlayMode(null);
  };

  return (
    <div className="App">
      <h1 className="title gradient-text">Tic Tac Toe</h1>

      {playMode != null ? <React.Fragment>
        {winner ? null : <h2>Current player: {currentPlayer == 'X' ? <span className="green">{currentPlayer}</span> : <span className="cyan">{currentPlayer}</span>}</h2>}
        {winner ? <React.Fragment>
          {winner == 'X' || winner == 'O' ? <h2>Winner: {winner == 'X' ? <span className="green">{winner}</span> : <span className="cyan">{winner}</span>}</h2> : <h2>Draw</h2>}
        </React.Fragment> : null}
        <h2>Current round: {currentRound}</h2>
        <div className="grid">
          <div className="row">
            <div className="cell" id="cell-1" onClick={(e) => { handleClick(e, 1) }}>

            </div>
            <div className="cell" id="cell-2" onClick={(e) => { handleClick(e, 2) }}>

            </div>
            <div className="cell" id="cell-3" onClick={(e) => { handleClick(e, 3) }}>

            </div>
          </div>
          <div className="row">
            <div className="cell" id="cell-4" onClick={(e) => { handleClick(e, 4) }}>

            </div>
            <div className="cell" id="cell-5" onClick={(e) => { handleClick(e, 5) }}>

            </div>
            <div className="cell" id="cell-6" onClick={(e) => { handleClick(e, 6) }}>

            </div>
          </div>
          <div className="row">
            <div className="cell" id="cell-7" onClick={(e) => { handleClick(e, 7) }}>

            </div>
            <div className="cell" id="cell-8" onClick={(e) => { handleClick(e, 8) }}>

            </div>
            <div className="cell" id="cell-9" onClick={(e) => { handleClick(e, 9) }}>

            </div>
          </div>
        </div>
        {winner ? <a onClick={restartGame} className="mt-50 gradient-button ">Restart</a> : null}
      </React.Fragment>
        : <React.Fragment>
          <h2>Choose the play mode</h2>
          <div className="flex-row">
            <a className="gradient-button" onClick={() => { updatePlayMode('manual') }}>Manual</a>
            <a className="gradient-button" onClick={() => { updatePlayMode('IA') }}>vs IA</a>
          </div>
        </React.Fragment>
      }

    </div>
  );
}

export default App;
