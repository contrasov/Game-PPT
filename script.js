const playerLifeElement = document.getElementById('player-life');
const cpuLifeElement = document.getElementById('cpu-life');
const playerCardsElement = document.querySelector('.player-cards');
const cpuCardsElement = document.querySelector('.cpu-cards');
const middleSpaceElement = document.querySelector('.middle-space');
const playedCardsElement = document.querySelector('.played-cards');

let playerLife = 6;
let cpuLife = 6;

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
    card.innerHTML = `<img src="./src/cartas/${type} ${number}.png" alt="Carta ${type} ${number}" style="width: 70px; height: 100px;">`;
    return card;
}

function createCpuCard() {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="./src/cartas/fundo.png" alt="Carta Oculta" style="width: 80px; height: 120px;">`;
    return card;
}

function chooseRandomCards() {
    const chosenCards = [];
    
    while (chosenCards.length < 6) {
        const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        const cardId = `${randomType} ${randomNumber}`;

        if (!chosenCards.includes(cardId)) {
            chosenCards.push(cardId);
            const card = createCard(randomType, randomNumber);
            playerCardsElement.appendChild(card);
        }
    }
}

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
    if (historyContainers.length > 3) {
        historyCardsElement.removeChild(historyContainers[historyContainers.length - 1]);
    }
}


function playRound(playerCard) {
    const cpuCardTypeRound = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const cpuCardNumber = Math.floor(Math.random() * 5) + 1;
    const cpuCard = createCard(cpuCardTypeRound, cpuCardNumber);

    middleSpaceElement.innerHTML = '';
    middleSpaceElement.appendChild(cpuCard);
    middleSpaceElement.appendChild(playerCard);

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
    }
    
    updatePlayerLife();
    updateCpuLife();
    updateHistory(playerCardType, cpuCardType); // Atualiza o histórico

    // Adicionar a carta jogada à área de cartas jogadas
    addPlayedCard(playerCardType, playerCard.getAttribute('data-number'));
}

function addPlayedCard(type, number) {
    const playedCard = createCard(type, number);
    playedCardsElement.appendChild(playedCard);
}

function initGame() {
    chooseRandomCards();
    updatePlayerLife();
    updateCpuLife();

    for (let i = 0; i < 6; i++) {
        const card = createCpuCard();
        cpuCardsElement.appendChild(card);
    }

    playerCardsElement.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.card');
        if (clickedCard && clickedCard.parentElement === playerCardsElement) {
            playRound(clickedCard);
            const cpuCards = cpuCardsElement.querySelectorAll('.card');
            if (cpuCards.length > 0) {
                cpuCardsElement.removeChild(cpuCards[0]);
            }
        }
    });
}



initGame();

