const playerCardsElement = document.querySelector('.player-cards');
const cpuCardsElement = document.querySelector('.cpu-cards');
const middleSpaceElement = document.querySelector('.middle-space');
const playedCardsElement = document.querySelector('.played-cards');
const playerScoreElement = document.querySelector('#player-score');

let playerLife = 20;
let cpuLife = 20;
let playerScore = 0;

const cardTypes = ['Pedra', 'Papel', 'Tesoura'];

function updatePlayerScore(){
    playerScoreElement.textContent = playerScore;
}

function updatePlayerLife() {
    const playerHealthBar = document.getElementById('player-health-bar');
    playerHealthBar.style.width = (playerLife * 5) + '%'; 
}

function updateCpuLife() {
    const cpuHealthBar = document.getElementById('cpu-health-bar');
    cpuHealthBar.style.width = (cpuLife * 5) + '%'; 
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
    card.innerHTML = `<img src="./src/cartas/fundo.png" alt="Carta Oculta" style="width: 120px; height: 160px;">`;
    return card;
}

let playerCards = []; 



function compareCards(playerCardType, cpuCardType) {
    if (playerCardType === cpuCardType) {
        return 'draw';
    } else if (
        (playerCardType === 'Pedra' && cpuCardType === 'Tesoura') ||
        (playerCardType === 'Papel' && cpuCardType === 'Pedra') ||
        (playerCardType === 'Tesoura' && cpuCardType === 'Papel')
    ) {
        return 'player';
    } else if (
        (playerCardType === 'Papel F' && (cpuCardType === 'Pedra' || cpuCardType === 'Papel' || cpuCardType === 'Tesoura')) || 
        (playerCardType === 'Pedra F' && (cpuCardType === 'Tesoura' || cpuCardType === 'Pedra'|| cpuCardType === 'Papel')) || 
        (playerCardType === 'Tesoura F' && (cpuCardType === 'Papel' || cpuCardType === 'Tesoura' ||  cpuCardType === 'Pedra'))
        
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
    historyContainers.forEach((container) => {
        const historyCards = container.querySelectorAll('.card');
        historyCards.forEach((card) => {
            card.classList.remove('blue-border');
        });
    });
    if (historyContainers.length > 2) {
        historyCardsElement.removeChild(historyContainers[historyContainers.length - 1]);
    }

    if (historyContainers.length >= 2) {
        historyContainers[1].classList.add('low-opacity');
    }
}


let continueUsed = false;

function showContinueDialog() {
    if (!continueUsed) {
        const continueModal = document.getElementById('continue-modal');
        continueModal.style.display = 'block';
        const continueButton = document.getElementById('continue-button');
        const quitButton = document.getElementById('quit-button');

        continueButton.addEventListener('click', () => {
            for (let i = 0; i < 3; i++) {
                const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
                const randomNumber = Math.floor(Math.random() * 10) + 1;
                const card = createCard(randomType, randomNumber);
                playerCards.push(card);
                playerCardsElement.appendChild(card);
            }

            continueUsed = true;
            checkAndHighlightPlayerCards();
            continueModal.style.display = 'none';
        });

        quitButton.addEventListener('click', () => {
            // Implementar ação de desistir
            playerLife = 0;
            cpuLife = 1;
            showWinnerModal();
            continueModal.style.display = 'none';
        });

    } else {
        playerLife = 0;
        cpuLife = 1;
        showWinnerModal();
    }
}




function showContinueDialogIfNeeded() {
    if (playerCardsElement.childElementCount === 0) {
        showContinueDialog();
    }
}

function drawCpuCards(count) {
    for (let i = 0; i < count; i++) {
        const cpuCard = createCpuCard(); // Cria uma carta com imagem "fundo.png" para o CPU
        cpuCardsElement.appendChild(cpuCard);
    }
}

function playRound(playerCard) {
    const cpuCardTypeRound = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const cpuCardNumber = Math.floor(Math.random() * 5) + 1;
    const cpuCard = createCard(cpuCardTypeRound, cpuCardNumber);

    middleSpaceElement.innerHTML = '';
    middleSpaceElement.appendChild(cpuCard);
    middleSpaceElement.appendChild(playerCard);
    playerCard.classList.remove('blue-border');

    const playerCardType = playerCard.getAttribute('data-type');
    const cpuCardType = cpuCard.getAttribute('data-type');
    const result = compareCards(playerCardType, cpuCardType);

    const isSpecialCard = playerCardType === 'Papel F' || playerCardType === 'Pedra F' || playerCardType === 'Tesoura F';

    if (result === 'player') {
        cpuLife -= isSpecialCard ? 4 : 2;
        playerScore += 5;
        playerCard.classList.add('winner-card');
    } else if (result === 'cpu') {
        playerLife--;
        cpuCard.classList.add('winner-card');
    } else {
        playerCard.classList.add('draw-card');
        cpuCard.classList.add('draw-card');
    }

    setTimeout(() => {
        middleSpaceElement.innerHTML = '';
    }, 2000);

    updatePlayerLife();
    updateCpuLife();
    updateHistory(playerCardType, cpuCardType);
    updatePlayerScore();

    const playerCardCount = playerCardsElement.childElementCount;
    const cpuCardCount = cpuCardsElement.childElementCount;

    if (playerLife <= 0 || cpuLife <= 0) {
        showWinnerModal();
    }

    if (playerCardCount === 0) {
        showContinueDialog();
        return;
    }

    if (cpuCardCount === 0) {
        drawCpuCards(3);
    }

    addPlayedCard(playerCardType, playerCard.getAttribute('data-number'));
    checkAndHighlightPlayerCards();
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

        if (playerScore > 0 && playerCardCount < 6 ) {
            const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            const playerCard = createCard(randomType, randomNumber);
            playerCards.push(playerCard);
            playerCardsElement.appendChild(playerCard);
            playerScore -= 5;
            updatePlayerScore();
            checkAndHighlightPlayerCards();

            // Mostrar notificação de compra bem-sucedida
            const notification = document.createElement('div');
            notification.textContent = 'Carta comprada com sucesso!';
            notification.classList.add('notification');
            document.body.appendChild(notification);

            // Remover a notificação após um curto período de tempo (opcional)
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 2000); // Remove a notificação após 2 segundos

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

function checkAndHighlightPlayerCards() {
    const playerCardElements = playerCardsElement.querySelectorAll('.card');
    const cardCounts = {}; // Um objeto para contar quantas cartas de cada tipo o jogador possui

    // Conta as cartas do jogador de cada tipo
    playerCardElements.forEach((card) => {
        const cardType = card.getAttribute('data-type');
        if (cardType in cardCounts) {
            cardCounts[cardType]++;
        } else {
            cardCounts[cardType] = 1;
        }
    });

    // Adiciona a classe CSS 'highlighted' às cartas do mesmo tipo que tenham 3 ou mais
    playerCardElements.forEach((card) => {
        const cardType = card.getAttribute('data-type');
        if (cardCounts[cardType] >= 3) {
            card.classList.add('blue-border');
        } else {
            card.classList.remove('blue-border');
        }
    });

    // Adiciona um ouvinte de evento de clique às cartas do jogador
    playerCardElements.forEach((card) => {
        card.addEventListener('click', () => {
            if (card.classList.contains('blue-border')) {
                // Remove a classe 'highlighted' das cartas do mesmo tipo
                playerCardElements.forEach((c) => {
                    if (c !== card && c.getAttribute('data-type') === card.getAttribute('data-type')) {
                        c.classList.remove('blue-border');
                    }
                });
            }
        });
    });

    const mergeButton = document.getElementById('merge-button');
    if (Object.values(cardCounts).some(count => count >= 3)) {
        mergeButton.style.display = 'block';
    } else {
        mergeButton.style.display = 'none';
    }
    
}



function initGame() {
    updatePlayerLife();
    updateCpuLife();
    updatePlayerScore();

    const maxSameTypeCardCount = 3; // Máximo de cartas do mesmo tipo
    const playerCardCounts = {}; // Um objeto para contar quantas cartas de cada tipo o jogador possui
    let totalPlayerCards = 0; // Contador para o número total de cartas do jogador


    for (let i = 0; i < 6; i++) {
        const card = createCpuCard();
        cpuCardsElement.appendChild(card);
    }

    while (totalPlayerCards < 6) {
        const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        const card = createCard(randomType, randomNumber);

        // Verifique se o jogador já tem o máximo permitido de cartas do mesmo tipo
        if (!(randomType in playerCardCounts) || playerCardCounts[randomType] < maxSameTypeCardCount) {
            playerCards.push(card);
            playerCardsElement.appendChild(card);

            // Atualize as contagens
            if (!(randomType in playerCardCounts)) {
                playerCardCounts[randomType] = 1;
            } else {
                playerCardCounts[randomType]++;
            }

            totalPlayerCards++;
        }
    }

    checkAndHighlightPlayerCards();
    createBuyButton();

    const mergeButton = document.getElementById('merge-button');
    const merge2Button = document.getElementById('merge2-button');
    const cancelButton = document.getElementById('cancel-button');
    const mergeModal = document.getElementById('merge-modal');
    const blueBorderCardsContainer = document.getElementById('blue-border-cards');

    mergeButton.addEventListener('click', () => {
        // Limpa o conteúdo do modal
        blueBorderCardsContainer.innerHTML = '';

        let blueBorderCardCount = 0;

        // Itera sobre as cartas do jogador para encontrar aquelas com borda azul
        playerCardsElement.querySelectorAll('.card').forEach((card) => {
            if (card.classList.contains('blue-border')) {
                if (blueBorderCardCount < 3) {
                    const cardCopy = card.cloneNode(true);
                    blueBorderCardsContainer.appendChild(cardCopy);
                    blueBorderCardCount++;
                } else {
                    return;
                }
            }
        });

        // Exibe o modal
        mergeModal.style.display = 'block';
    });

    cancelButton.addEventListener('click', () => {
        // Fecha o modal ao clicar em "Cancelar"
        mergeModal.style.display = 'none';
    });

    merge2Button.addEventListener('click', () => {
        const blueBorderCards = playerCardsElement.querySelectorAll('.card.blue-border');
        if (blueBorderCards.length >= 3) {
            // Remove apenas as três primeiras cartas com borda azul do jogador
            for (let i = 0; i < 3; i++) {
                const card = blueBorderCards[i];
                playerCardsElement.removeChild(card);
            }
    
            // Crie a carta especial correspondente à fusão (por exemplo, "Pedra F")
            const mergedCardType = `${blueBorderCards[0].getAttribute('data-type')} F`;
            const mergedCardNumber = 1; // Você pode ajustar o número conforme necessário
            const mergedCard = createCard(mergedCardType, mergedCardNumber);
    
            // Adicione a carta especial ao jogador
            playerCardsElement.appendChild(mergedCard);
    
            // Limpe o conteúdo do modal
            blueBorderCardsContainer.innerHTML = '';
            checkAndHighlightPlayerCards();
        }     
        mergeModal.style.display = 'none';

        const notification = document.createElement('div');
        notification.textContent = 'Fusão Concluída';
        notification.classList.add('notification2');
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000); // Remove a notificação após 2 segundos

    });

    const playAgainButton = document.getElementById('play-again-button');
    playAgainButton.addEventListener('click', () => {
        location.reload(); // Recarrega a página
    });

    const playExitButton = document.getElementById("exit");
    playExitButton.addEventListener('click', () => {
        window.location.href = "index.html";
    });

    //CLIQUE DO PLAYER NO DECK
    playerCardsElement.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.card');
        if (clickedCard && clickedCard.parentElement === playerCardsElement) {
            playRound(clickedCard);
            checkAndHighlightPlayerCards();
            const cpuCards = cpuCardsElement.querySelectorAll('.card');
            if (cpuCards.length > 0) {
                cpuCardsElement.removeChild(cpuCards[0]);
            }
        }
    });
}






initGame();

