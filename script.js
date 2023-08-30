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
    card.innerHTML = `<img src="./src/cartas/${type} ${number}.png" alt="Carta ${type} ${number}" style="width: 160px; height: 240px;">`;
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
    
    updatePlayerLife();
    updateCpuLife();

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
