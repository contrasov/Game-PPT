const playerLifeElement = document.getElementById('player-life');
const cpuLifeElement = document.getElementById('cpu-life');
const playerCardsElement = document.querySelector('.player-cards');
const cpuCardsElement = document.querySelector('.cpu-cards');
const middleSpaceElement = document.querySelector('.middle-space');

let playerLife = 6;
let cpuLife = 6;

const cardTypes = ['Pedra', 'Papel', 'Tesoura'];

// Função para atualizar a vida do jogador
function updatePlayerLife() {
    playerLifeElement.textContent = playerLife;
}

// Função para atualizar a vida da CPU
function updateCpuLife() {
    cpuLifeElement.textContent = cpuLife;
}

// Função para criar uma carta
function createCard(type, number) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-type', type); // Adicione o atributo data-type à carta
    card.innerHTML = `<img src="./src/cartas/${type} ${number}.png" alt="Carta ${type} ${number}" style="width: 80px; height: 120px;">`;
    return card;
}

function createCpuCard() {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="./src/cartas/fundo.png" alt="Carta Oculta" style="width: 80px; height: 120px;">`;
    return card;
}

// Função para escolher 6 cartas aleatórias
function chooseRandomCards() {
    const chosenCards = [];
    
    while (chosenCards.length < 6) {
        const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        const randomNumber = Math.floor(Math.random() * 5) + 1; // Cartas de 1 a 5
        const cardId = `${randomType} ${randomNumber}`;

        if (!chosenCards.includes(cardId)) {
            chosenCards.push(cardId);
            const card = createCard(randomType, randomNumber);
            playerCardsElement.appendChild(card);
        }
    }
}

// Função para jogar uma rodada
function playRound(playerCard) {
    // Escolher uma carta aleatória para a CPU
    const cpuCardTypeRound = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const cpuCardNumber = Math.floor(Math.random() * 5) + 1;
    const cpuCard = createCard(cpuCardTypeRound, cpuCardNumber);
    
    middleSpaceElement.innerHTML = ''; // Limpar o espaço do meio
    middleSpaceElement.appendChild(cpuCard); // Mover a carta da CPU para o meio
    middleSpaceElement.appendChild(playerCard); // Mover a carta do jogador para o meio

    // Comparar as cartas e determinar o vencedor
    const playerCardType = playerCard.getAttribute('data-type');
    const cpuCardType = cpuCard.getAttribute('data-type');
    const result = compareCards(playerCardType, cpuCardType);

    // Atualizar as vidas do jogador e da CPU com base no resultado
    if (result === 'player') {
        cpuLife--;
    } else if (result === 'cpu') {
        playerLife--;
    }
    
    updatePlayerLife();
    updateCpuLife();

}

// Função para comparar as cartas e determinar o vencedor
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

// Inicializar o jogo
function initGame() {
    chooseRandomCards();
    updatePlayerLife();
    updateCpuLife();

    // Criar 6 cartas aleatórias para a CPU
    for (let i = 0; i < 6; i++) {
        const card = createCpuCard();
        cpuCardsElement.appendChild(card);
    }


    // Adicione eventos de clique às cartas do jogador
    playerCardsElement.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.card');
        if (clickedCard && clickedCard.parentElement === playerCardsElement) {
            playRound(clickedCard); // Jogar a rodada
            const cpuCards = cpuCardsElement.querySelectorAll('.card');
            if (cpuCards.length > 0) {
                cpuCardsElement.removeChild(cpuCards[0]); // Remover a primeira carta da CPU
            }
        }
    });
}

// Chamar a função de inicialização do jogo
initGame();
