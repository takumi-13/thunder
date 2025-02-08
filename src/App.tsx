import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button } from '@mui/material';

const App: React.FC = () => {
  const [aliceData, setAliceData] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [bobData, setBobData] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const handleCardClick = (num: number) => {
    console.log('カードが押されました:', num);
    setSelectedCard(num);
  };

  const cards = Array.from({ length: 12 }, (_, i) => i + 1);
  const containerSize = 400; // コンテナのサイズ（px）
  const radius = 150; // 円の半径（px）
  const cardSize = 50;
  const data = [
    { name: 'Alice', data: aliceData },
    { name: 'Bob', data: bobData },
  ];
  const [turn, setTurn] = useState<'Alice' | 'Bob'>('Alice');
  const [phase, setPhase] = useState<'SET_THUNDER' | 'CHOICE_THUNDER'>(
    'SET_THUNDER'
  );
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const [currentThunder, setCurrentThunder] = useState<number>(0);
  const [selectedThunder, setSelectedThunder] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [turnPlayer, setTurnPlayer] = useState<'Alice' | 'Bob'>('Alice');
  const setThunder = () => {
    setCurrentThunder(selectedCard);
    setSelectedCard(0);
    setTurn(turn === 'Alice' ? 'Bob' : 'Alice');
    setPhase('CHOICE_THUNDER');
  };
  const choiceThunder = () => {
    if (selectedCard) {
      setSelectedThunder(selectedCard);
    }
    setPoint();
    if (currentThunder === selectedThunder) {
      console.log('あなたは電気椅子に座りました');
    }
    finishTurn();
  };
  const finishTurn = () => {
    setSelectedCard(0);
    setTurn(turn === 'Alice' ? 'Bob' : 'Alice');
    setPhase('SET_THUNDER');
    if (turnPlayer === 'Bob' && turn === 'Bob') {
      setRound(round + 1);
    }
    setTurnPlayer(turnPlayer === 'Alice' ? 'Bob' : 'Alice');
  };
  const setPoint = () => {
    const targetData = turnPlayer === 'Alice' ? aliceData : bobData;
    const setTargetData = turnPlayer === 'Alice' ? setAliceData : setBobData;

    const point =
      currentThunder === selectedThunder
        ? selectedCard
        : -1 *
          targetData
            .filter((score): score is number => score !== null)
            .reduce((acc, score) => acc + score, 0);

    setTargetData(
      targetData.map((elm, index) => (index + 1 === round ? point : elm))
    );
  };
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        電気椅子ゲーム
      </Typography>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        ターン:{turn}
      </Typography>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        電気椅子:{currentThunder}
      </Typography>
      {/* <Typography variant="h6" component="h6" align="center" gutterBottom>
        Phase:{phase}
      </Typography>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        ラウンド:{round}
      </Typography>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        ターンプレイヤー:{turnPlayer}
      </Typography>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        選択カード:{selectedCard}
      </Typography>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        選択電気椅子:{selectedThunder}
      </Typography> */}

      <TableContainer component={Paper}>
        <Table aria-label="シンプルな表">
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2}>プレイヤー</TableCell>
              {Array.from({ length: 8 }, (_, idx) => (
                <TableCell align="right" key={`header-score-${idx}`}>
                  {idx + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={`rowIndex-${rowIndex}`}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                {row.data.map((value, colIndex) => (
                  <TableCell
                    align="right"
                    key={`row-${rowIndex}-col-${colIndex}`}
                    sx={{
                      backgroundColor:
                        row.name === turnPlayer && round === colIndex + 1
                          ? '#d1f5f9'
                          : '#ffffff',
                    }}
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          position: 'relative',
          width: containerSize,
          height: containerSize,
          margin: '0 auto',
          borderRadius: '50%',
          mt: 10,
        }}
      >
        {cards.map((num, idx) => {
          // カード1を上に配置するように -π/2 を加算
          const angle = ((2 * Math.PI) / 12) * idx - Math.PI / 2;
          const x = containerSize / 2 + radius * Math.cos(angle) - cardSize / 2;
          const y = containerSize / 2 + radius * Math.sin(angle) - cardSize / 2;
          return (
            <Button
              key={`card-${idx}-${num}`}
              variant="outlined"
              sx={{
                position: 'absolute',
                width: cardSize,
                height: cardSize,
                left: x,
                top: y,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  selectedCard === num ? 'primary.main' : 'transparent',
                color: selectedCard === num ? 'white' : 'inherit',
              }}
              onClick={() => handleCardClick(num)}
            >
              <Typography variant="body2" align="center">
                {num}
              </Typography>
            </Button>
          );
        })}
      </Box>
      {phase === 'SET_THUNDER' && (
        <Button
          disabled={!selectedCard}
          variant="contained"
          color="primary"
          onClick={() => setThunder()}
        >
          電気椅子を設定
        </Button>
      )}
      {phase === 'CHOICE_THUNDER' && (
        <Button
          disabled={!selectedCard}
          variant="contained"
          color="primary"
          onClick={() => choiceThunder()}
        >
          確定
        </Button>
      )}
    </Container>
  );
};

export default App;
