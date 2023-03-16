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
  const [gridReady, updateGridReady] = useState<boolean>(true);

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
    checkWinCondition();
  }, [player1, player2]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (gridReady) {
      let indexOf = availableBoard.indexOf(index);
      if (indexOf >= 0) {
        availableBoard.splice(availableBoard.indexOf(index), 1);
        updateAvailableBoard(availableBoard);
        console.log(availableBoard);
      }
    }
    if (!winner) {
      const el = event.target as HTMLDivElement;
      if (!el.innerText) {
        if (playMode === 'manual') {
          playerMove(currentPlayer, index, el);
          setCurrentRound(currentRound + 1);
        } else {
          if (gridReady) {
            el.innerText = 'X';
            el.classList.add('green');
            updatePlayer1([...player1, index]);
            setCurrentPlayer('O');
            setCurrentRound(currentRound + 1);
          }
        }
      }
    }
  };

  const IAMove = (spot?: number|null) => {
    if (!winner) {
      updateGridReady(false);
      setTimeout(() => {
        let randomElement = null;
        if (!spot) {
          randomElement = availableBoard[Math.floor(Math.random() * availableBoard.length)];
        } else {
          randomElement = spot;
        }
        let indexOf = availableBoard.indexOf(randomElement);
        if (indexOf >= 0) {
          availableBoard.splice(availableBoard.indexOf(randomElement), 1);
          updateAvailableBoard(availableBoard);
          console.log(availableBoard);
        }
        const el = document.getElementById(`cell-${randomElement}`) as HTMLDivElement;
        if (el) {
          el.innerText = 'O';
          el.classList.add('cyan');
          updatePlayer2([...player2, randomElement]);
          setCurrentRound(currentRound + 1);
          setCurrentPlayer('X');
        }
        updateGridReady(true);
      }, 1000);
    }
  }

  // const minimaxMove = (board?: number[] | null, player?: string | null) => {
  //   if (!board || (board && board.length === 0)) {
  //     board = availableBoard;
  //   }
  //   if (!player) {
  //     player = currentPlayer;
  //   }
  //   let bestScore = (player === 'X') ? -Infinity : Infinity;
  //   let bestMove = null;

  //   availableBoard.forEach((free) => {
  //     if (player == 'X') {
  //       updatePlayer1([...player1, free]);
  //     } else {
  //       updatePlayer2([...player2, free]);
  //     }
  //     let indexOf = availableBoard.indexOf(free);
  //     let updatedBoard:number[] = [];
  //     if (indexOf >= 0) {
  //       updatedBoard = availableBoard.splice(availableBoard.indexOf(free), 1);
  //       updateAvailableBoard(updatedBoard);
  //     }
  //     let score = minimaxMove(updatedBoard, (player == 'X') ? 'O' : 'X');
  //     if (player == 'X') {
  //       let updatedArr = player1.splice(free, 1);
  //       updatePlayer1(updatedArr);
  //     } else {
  //       let updatedArr = player2.splice(free, 1);
  //       updatePlayer2(updatedArr);
  //     }
  //     if (player === 'X') {
  //       if (score && score > bestScore) {
  //         bestScore = score;
  //         bestMove = free;
  //       }
  //     } else {
  //       if (score && score < bestScore) {
  //         bestScore = score;
  //         bestMove = free;
  //       }
  //     }
  //   })
  //   return bestMove;
  // };

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
    let winnerVar = null;
    winConditions.forEach(function (winCond) {
      let p1won = winCond.every(elem => p1.includes(elem));
      let p2won = winCond.every(elem => p2.includes(elem));
      if (p1won) {
        winnerVar = 'X';
      } else if (p2won) {
        winnerVar = 'O';
      }
    })
    if (winnerVar) {
      updateWinner(winnerVar);
    } else if (currentRound == 10) {
      updateWinner('Draw');
    }
    if (playMode == 'IA' && !winnerVar && currentPlayer == 'O') {
     // let spot = minimaxMove();
      IAMove();
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
    updateAvailableBoard([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  };

  return (
    <div className="App">
      <h1 className="title gradient-text">Tic Tac Toe</h1>

      {playMode != null ? <React.Fragment>
        {winner ? null : <h2>Current player: {currentPlayer == 'X' ? <span className="green">{currentPlayer}</span> : <span className="cyan">{currentPlayer}</span>}</h2>}
        {winner ? <React.Fragment>
          {winner == 'X' || winner == 'O' ? <h2>Winner: {winner == 'X' ? <span className="green">{winner}</span> : <span className="cyan">{winner}</span>}</h2> : <h2>Draw</h2>}
        </React.Fragment> : null}
        {winner ? null : <h2>Current round: {currentRound}</h2>}
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
