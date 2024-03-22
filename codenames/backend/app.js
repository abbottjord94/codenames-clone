const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
const fs = require('fs');

const gameStates = {};
const initialGameState = {gameWords: [], isRedTurn: true, redScore: 0, blueScore: 0, redWin: false, blueWin: false};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('click', (id, index) => {
        gameStates[id].gameWords[index].clicked = true;
        if (gameStates[id].gameWords[index].color === 'red') {
            gameStates[id].redScore++;
            if(!gameStates[id].isRedTurn) {
                gameStates[id].isRedTurn = true;
            }
        } else if (gameStates[id].gameWords[index].color === 'blue') {
            gameStates[id].blueScore++;
            if(gameStates[id].isRedTurn) {
                gameStates[id].isRedTurn = false;
            }
        }
        else if(gameStates[id].gameWords[index].color === 'neutral') {
            gameStates[id].isRedTurn = !gameStates[id].isRedTurn;
        }
        else if(gameStates[id].gameWords[index].color === 'black') {
            if(gameStates[id].isRedTurn) {
                gameStates[id].blueWin = true;
            } else {
                gameStates[id].redWin = true;
            }
        }
        if(gameStates[id].redScore === 9) {
            gameStates[id].redWin = true;
        }
        if(gameStates[id].blueScore === 9) {
            gameStates[id].blueWin = true;
        }
    });

    socket.on('getList', (id) => {
        if(gameStates[id] == undefined) {
            generateNewGameState(id, () => {
                socket.emit('getListResponse', gameStates[id]);
            });
        }
        else {
            socket.emit('getListResponse', gameStates[id]);
        }
    });

    socket.on('nextPlayer', (id) => {
        gameStates[id].isRedTurn = !gameStates[id].isRedTurn;
    });
});

app.get('/*', (req, res) => {
    res.send('Hello World!');
});

function generateNewGameState(id, callback) {
    if(gameStates[id] == undefined) {
        gameStates[id] = JSON.parse(JSON.stringify(initialGameState));
        let wordlist = [];
        fs.readFile('top-1000-nouns.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading top-1000-nouns.txt', err);
                return;
            }
            wordlist.push(...data.split('\n'));
            //Choose 36 random unique words and randomly assign either red or blue colors to them(9 red, 9 blue, 1 black, 17 neutral), set clicked to false, and add each object to the gameState array
            let words = [];
            for (let i = 0; i < 36; i++) {
                let word = wordlist[Math.floor(Math.random() * wordlist.length)];
                if (words.includes(word)) {
                    i--;
                    continue;
                }
                words.push(word);
            }
            for (let i = 0; i < 36; i++) {
                let color = 'neutral';
                if (i < 9) {
                    color = 'red';
                } else if (i < 18) {
                    color = 'blue';
                } else if (i === 18) {
                    color = 'black';
                }
                gameStates[id].gameWords.push({word: words[i], color: color, clicked: false});
            }
            
            for (let i = gameStates[id].gameWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gameStates[id].gameWords[i], gameStates[id].gameWords[j]] = [gameStates[id].gameWords[j], gameStates[id].gameWords[i]];
            }
        });
        callback();
    }
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});