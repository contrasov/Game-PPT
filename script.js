const playerLifeElement = document.getElementById('player-life');
const cpuLifeElement = document.getElementById('cpu-life');
const playerCardsElement = document.querySelector('.player-cards');
const cpuCardsElement = document.querySelector('.cpu-cards');
const middleSpaceElement = document.querySelector('.middle-space');
const playedCardsElement = document.querySelector('.played-cards');

let playerLife = 100;
let cpuLife = 100;

const cardTypes = ['Pedra', 'Papel', 'Tesoura'];

function updatePlayerLife() {
    playerLifeElement.textContent = playerLife;
}

function updateCpuLife() {
    cpuLifeElement.textContent = cpuLife;
}

function createCard(type, number) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-type', type);
    card.innerHTML = `<img src="./src/cartas/${type} ${number}.png" alt="Carta ${type} ${number}" style="width: 120px; height: 160px;">`;
    return card;
}

function createCpuCard() {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="./src/cartas/fundo.png" alt="Carta Oculta" style="width: 80px; height: 110px;">`;
    return card;
}

let playerCards = []; // Array para armazenar as cartas do jogador


function compareCards(playerCardType, cpuCardType) {
    if (playerCardType === cpuCardType) {
        return 'draw';
    } else if (
        (playerCardType === 'Pedra' && cpuCardType === 'Tesoura') ||
        (playerCardType === 'Papel' && cpuCardType === 'Pedra') ||
        (playerCardType === 'Tesoura' && cpuCardType === 'Papel')
    ) {
        return 'player';
    } else {
        return 'cpu';
    }
}


function updateHistory(playerCardType, cpuCardType, playerCardNumber, cpuCardNumber) {
    const historyCardsElement = document.querySelector('.history-cards');

    const historyContainer = document.createElement('div');
    historyContainer.classList.add('history-container');

    const middleCards = middleSpaceElement.querySelectorAll('.card'); // Seleciona as cartas jogadas no meio

    const playerMiddleCardClone = middleCards[1].cloneNode(true); // Clone da carta do jogador
    const cpuMiddleCardClone = middleCards[0].cloneNode(true); // Clone da carta da CPU

    historyContainer.appendChild(cpuMiddleCardClone);
    historyContainer.appendChild(playerMiddleCardClone);


    historyCardsElement.prepend(historyContainer);

    // Limitar o número de jogadas no histórico (mantendo apenas as 3 últimas)
    const historyContainers = historyCardsElement.querySelectorAll('.history-container');
    if (historyContainers.length > 2) {
        historyCardsElement.removeChild(historyContainers[historyContainers.length - 1]);
    }

    if (historyContainers.length >= 2) {
        historyContainers[1].classList.add('low-opacity');
    }
}


function playRound(playerCard) {
    const cpuCardTypeRound = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const cpuCardNumber = Math.floor(Math.random() * 5) + 1;
    const cpuCard = createCard(cpuCardTypeRound, cpuCardNumber);

    middleSpaceElement.innerHTML = '';
    middleSpaceElement.appendChild(cpuCard);
    middleSpaceElement.appendChild(playerCard);

    setTimeout(() => {
        middleSpaceElement.innerHTML = '';
    }, 1800); // Remove as cartas após 3 segundos (3000 milissegundos)

    const playerCardType = playerCard.getAttribute('data-type');
    const cpuCardType = cpuCard.getAttribute('data-type');
    const result = compareCards(playerCardType, cpuCardType);

    if (result === 'player') {
        cpuLife--;
    } else if (result === 'cpu') {
        playerLife--;
    }
    
    
    const allCards = [...middleSpaceElement.querySelectorAll('.card')];
    allCards.forEach(card => card.classList.remove('winner-card')); 

    if (result === 'player') {
        cpuLife--;
        playerCard.classList.add('winner-card'); // Adicione a classe à carta ganhadora
    } else if (result === 'cpu') {
        playerLife--;
        cpuCard.classList.add('winner-card'); // Adicione a classe à carta ganhadora
    } else {
        playerCard.classList.add('draw-card'); // Adicione a classe de empate à carta do jogador
        cpuCard.classList.add('draw-card'); // Adicione a classe de empate à carta da CPU
    }

    
    updatePlayerLife();
    updateCpuLife();
    updateHistory(playerCardType, cpuCardType); // Atualiza o histórico

    const playerCardCount = playerCardsElement.childElementCount;
    const cpuCardCount = cpuCardsElement.childElementCount;
    if (playerLife <= 0 || cpuLife <= 0 || playerCardCount === 0 || cpuCardCount === 0) {
        showWinnerModal();
    }

    // Adicionar a carta jogada à área de cartas jogadas
    addPlayedCard(playerCardType, playerCard.getAttribute('data-number'));
}

function addPlayedCard(type, number) {
    const playedCard = createCard(type, number);
    playedCardsElement.appendChild(playedCard);
}

function showWinnerModal() {
    const modal = document.getElementById('winner-modal');
    const winnerMessage = document.getElementById('winner-message');

    if (playerLife > cpuLife) {
        winnerMessage.textContent = 'Vencedor: Jogador';
    } else if (cpuLife > playerLife) {
        winnerMessage.textContent = 'Vencedor: CPU';
    } else {
        winnerMessage.textContent = 'Empate';
    }

    modal.style.display = 'block';
}

function createBuyButton() {
    const buyButton = document.getElementById('buy-button');
    buyButton.addEventListener('click', () => {
        const playerCardCount = playerCardsElement.childElementCount;

        if (playerLife > 0 && playerCardCount < 6) {
            const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            const randomNumber = Math.floor(Math.random() * 5) + 1;
            const playerCard = createCard(randomType, randomNumber);
            playerCards.push(playerCard);
            playerCardsElement.appendChild(playerCard);

            // Mostrar notificação de compra bem-sucedida
            const notification = document.createElement('div');
            notification.textContent = 'Carta comprada com sucesso!';
            notification.classList.add('notification');
            document.body.appendChild(notification);

            // Remover a notificação após um curto período de tempo (opcional)
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 2000); // Remove a notificação após 2 segundos

            const cpuCard = createCpuCard();
            cpuCardsElement.appendChild(cpuCard);
        } else if (playerCardCount >= 6) {
            const notification = document.createElement('div');
            notification.textContent = 'Não é possível comprar mais cartas.';
            notification.classList.add('notification-error');
            document.body.appendChild(notification);

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 2000); // Remove a notificação após 2 segundos
        }
    });
}



function initGame() {
    updatePlayerLife();
    updateCpuLife();

    for (let i = 0; i < 6; i++) {
        const card = createCpuCard();
        cpuCardsElement.appendChild(card);
    }

    for (let i = 0; i < 6; i++) {
        const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        const card = createCard(randomType, randomNumber);
        playerCards.push(card);
        playerCardsElement.appendChild(card);
    }

    createBuyButton();

    const playAgainButton = document.getElementById('play-again-button');
    playAgainButton.addEventListener('click', () => {
        location.reload(); // Recarrega a página
    });


    playerCardsElement.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.card');
        if (clickedCard && clickedCard.parentElement === playerCardsElement) {
            playRound(clickedCard);
            const cpuCards = cpuCardsElement.querySelectorAll('.card');
            if (cpuCards.length > 0) {
                cpuCardsElement.removeChild(cpuCards[0]);
            }
            if (playerCardsElement.childElementCount === 0 && cpuCardsElement.childElementCount === 0) {
                showWinnerModal();
            }
        }
    });
}




initGame();

