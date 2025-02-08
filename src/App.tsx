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
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

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
  const [aliceName, setAliceName] = useState<string>('Alice');
  const [bobName, setBobName] = useState<string>('Bob');

  const cards = Array.from({ length: 12 }, (_, i) => i + 1);
  const containerSize = 400; // コンテナのサイズ（px）
  const radius = 150; // 円の半径（px）
  const cardSize = 50;
  const data = [
    {
      name: 'Alice',
      data: aliceData,
      displayedName: aliceName,
      setName: setAliceName,
    },
    { name: 'Bob', data: bobData, displayedName: bobName, setName: setBobName },
  ];
  const [turn, setTurn] = useState<'Alice' | 'Bob'>('Alice');

  const [phase, setPhase] = useState<'SET_THUNDER' | 'CHOICE_THUNDER'>(
    'SET_THUNDER'
  );
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const [currentThunder, setCurrentThunder] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [turnPlayer, setTurnPlayer] = useState<'Alice' | 'Bob'>('Alice');
  const [usedCards, setUsedCards] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameOverMessage, setGameOverMessage] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#985ecf',
        dark: '#cf33c2',
        light: '#64b5f6',
      },
      secondary: {
        main: '#f3e074',
        dark: '#11c571',
        light: '#ff4081',
        contrastText: '#353030',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#000000',
        secondary: isDarkMode ? '#b3b3b3' : '#666666',
      },
    },
  });

  const setThunder = () => {
    setCurrentThunder(selectedCard);
    setSelectedCard(0);
    setTurn(turn === 'Alice' ? 'Bob' : 'Alice');
    setPhase('CHOICE_THUNDER');
  };
  const handleGameOver = (loser: string, reason: string) => {
    if (reason === 'AliceLoser') {
      setGameOverMessage(`${loser}が電気椅子に3回座ってしまいました！`);
    }
    if (reason === 'BobLoser') {
      setGameOverMessage(`${loser}が電気椅子に3回座ってしまいました！`);
    }
    if (reason === 'AliceWinner') {
      setGameOverMessage(
        `${loser === aliceName ? bobName : aliceName}が40点以上獲得しました！`
      );
    }
    if (reason === 'BobWinner') {
      setGameOverMessage(
        `${loser === aliceName ? bobName : aliceName}が40点以上獲得しました！`
      );
    }

    setIsGameOver(true);
    setIsGameEnded(true);
  };

  const resetGame = () => {
    setIsGameEnded(false);
    setIsGameOver(false);
    setGameOverMessage('');
    setAliceData([null, null, null, null, null, null, null, null]);
    setBobData([null, null, null, null, null, null, null, null]);
    setRound(1);
    setTurn('Alice');
    setTurnPlayer('Alice');
    setPhase('SET_THUNDER');
    setCurrentThunder(0);
    setSelectedCard(0);
    setUsedCards([]);
  };
  const choiceThunder = () => {
    let updatedAliceData = aliceData;

    let updatedBobData = bobData;

    if (turnPlayer === 'Alice') {
      updatedAliceData = setPoint();
    } else {
      updatedBobData = setPoint();
    }

    const { isGameOver, loser, reason } = checkGameOver(
      updatedAliceData,
      updatedBobData
    );
    if (isGameOver) {
      handleGameOver(loser, reason);
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
  const setPoint = (): (number | null)[] => {
    const targetData = turnPlayer === 'Alice' ? aliceData : bobData;

    const newPoint =
      currentThunder === selectedCard
        ? -1 *
          targetData
            .filter((score): score is number => score !== null)
            .reduce((acc, score) => acc + score, 0)
        : selectedCard;

    const updatedData = targetData.map((elm, index) =>
      index + 1 === round ? newPoint : elm
    );

    if (turnPlayer === 'Alice') {
      setAliceData(updatedData);
    } else {
      setBobData(updatedData);
    }

    if (currentThunder !== selectedCard) {
      setUsedCards((prev) => [...prev, selectedCard]);
    }

    return updatedData;
  };
  const checkGameOver = (
    updatedAliceData: (number | null)[],
    updatedBobData: (number | null)[]
  ): { isGameOver: boolean; loser: string; reason: string } => {
    const aliceScores = updatedAliceData.filter(
      (score): score is number => score !== null
    );
    const bobScores = updatedBobData.filter(
      (score): score is number => score !== null
    );

    const aliceSum = aliceScores.reduce((acc, score) => acc + score, 0);
    const bobSum = bobScores.reduce((acc, score) => acc + score, 0);

    if (aliceScores.filter((score) => score <= 0).length === 3) {
      return { isGameOver: true, loser: aliceName, reason: 'AliceLoser' };
    }
    if (bobScores.filter((score) => score <= 0).length === 3) {
      return { isGameOver: true, loser: bobName, reason: 'BobLoser' };
    }

    if (aliceSum >= 40) {
      return { isGameOver: true, loser: bobName, reason: 'AliceWinner' };
    }

    if (bobSum >= 40) {
      return { isGameOver: true, loser: aliceName, reason: 'BobWinner' };
    }

    return { isGameOver: false, loser: '', reason: '' };
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', width: '100%' }}>
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              startIcon={isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            >
              {isDarkMode ? 'ライトモード' : 'ダークモード'}
            </Button>
          </Box>
          <Box>
            <Typography
              variant="h3"
              component="h1"
              align="center"
              gutterBottom
              sx={{ color: 'text.primary' }}
            >
              電気椅子ゲーム
            </Typography>
            <Typography
              variant="h6"
              component="h1"
              align="center"
              gutterBottom
              sx={{ color: 'text.primary' }}
            >
              {`${
                turnPlayer === 'Alice'
                  ? turn === 'Alice'
                    ? bobName
                    : aliceName
                  : turn === 'Alice'
                  ? aliceName
                  : bobName
              }が${
                phase === 'SET_THUNDER'
                  ? '電気椅子を設定中'
                  : '電気椅子を選択中'
              }`}
            </Typography>
          </Box>
          {/* <Typography variant="h6" component="h6" align="center" gutterBottom>
            IsGameOver:{isGameOver ? 'True' : 'False'}
          </Typography> */}

          {/* <Typography variant="h6" component="h6" align="center" gutterBottom>
            ターン:{turn}
          </Typography>
          <Typography variant="h6" component="h6" align="center" gutterBottom>
            電気椅子:{currentThunder}
          </Typography>
          <Typography variant="h6" component="h6" align="center" gutterBottom>
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
            <Table
              aria-label="シンプルな表"
              sx={{ bgcolor: 'background.paper' }}
            >
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2}>プレイヤー</TableCell>
                  {Array.from({ length: 8 }, (_, idx) => (
                    <TableCell
                      align="right"
                      key={`header-score-${idx}`}
                      sx={{ color: 'text.primary' }}
                    >
                      {idx + 1}
                    </TableCell>
                  ))}
                  <TableCell
                    align="right"
                    key={`header-score-9`}
                    sx={{ color: 'text.primary' }}
                  >
                    合計
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={`rowIndex-${rowIndex}`}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        width: '20%',
                        color: 'text.primary',
                      }}
                    >
                      <TextField
                        label={`Player${rowIndex + 1}`}
                        value={row.displayedName}
                        onChange={(e) => {
                          row.setName(e.target.value);
                        }}
                        variant="standard"
                        sx={{ color: 'text.primary' }}
                      />
                    </TableCell>
                    {row.data.map((value, colIndex) => (
                      <TableCell
                        align="right"
                        key={`row-${rowIndex}-col-${colIndex}`}
                        sx={{
                          backgroundColor:
                            row.name === turnPlayer && round === colIndex + 1
                              ? isDarkMode
                                ? '#1a365d'
                                : '#d1f5f9'
                              : 'background.paper',
                          width: '8%',
                          color: 'text.primary',
                        }}
                      >
                        {value !== null ? (
                          value > 0 ? (
                            value
                          ) : (
                            <ElectricBoltIcon sx={{ color: '#ead154' }} />
                          )
                        ) : null}
                      </TableCell>
                    ))}
                    <TableCell
                      align="right"
                      key={`header-score-9`}
                      sx={{
                        width: '8%',
                        color: 'text.primary',
                      }}
                    >
                      {row.data
                        .filter((score): score is number => score !== null)
                        .reduce((acc, score) => acc + score, 0)}
                    </TableCell>
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
              const x =
                containerSize / 2 + radius * Math.cos(angle) - cardSize / 2;
              const y =
                containerSize / 2 + radius * Math.sin(angle) - cardSize / 2;
              return (
                <Button
                  key={`card-${idx}-${num}`}
                  variant="outlined"
                  disabled={usedCards.includes(num)}
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
                    color: selectedCard === num ? 'white' : 'primary.main',
                  }}
                  onClick={() => setSelectedCard(num)}
                >
                  <Typography variant="body2" align="center">
                    {num}
                  </Typography>
                </Button>
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {!isGameEnded && phase === 'SET_THUNDER' && (
              <Button
                size="large"
                disabled={!selectedCard}
                variant="contained"
                color="secondary"
                onClick={() => setThunder()}
                sx={{ width: '200px' }}
              >
                電気椅子を設定
              </Button>
            )}
            {!isGameEnded && phase === 'CHOICE_THUNDER' && (
              <Button
                size="large"
                disabled={!selectedCard}
                variant="contained"
                color="secondary"
                onClick={() => choiceThunder()}
                sx={{ width: '200px' }}
              >
                確定
              </Button>
            )}
            {isGameEnded && (
              <Button
                size="large"
                variant="contained"
                color="error"
                onClick={() => resetGame()}
                sx={{ width: '200px' }}
              >
                リセット
              </Button>
            )}
          </Box>
          <Dialog open={isGameOver} onClose={() => setIsGameOver(false)}>
            <DialogTitle>ゲーム終了！</DialogTitle>
            <DialogContent>{gameOverMessage}</DialogContent>
            <DialogActions>
              <Button onClick={() => setIsGameOver(false)}>閉じる</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
