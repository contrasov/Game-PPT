const playStartButton = document.getElementById("start");
    playStartButton.addEventListener('click', () => {
        window.location.href = "cardgame.html";
    });

const playTutorialButton = document.getElementById("tutorial");
    playTutorialButton.addEventListener('click', () => {
        window.open("https://tan-albacore-f98.notion.site/Tutorial-PPT-bb9e0ab88cf04bc8884e6d8417bf36bb?pvs=4")
    });

// Suponha que você tenha um objeto com as informações das atualizações
const patchNotes = [
    {
        version: "2.3.1",
        changes: ["Espaço das cartas no meio.", "Preço compra de cartas => 3 Pontos.", "Background Atualizado.","Home atualizada."]
    },
    {
        version: "2.3.0",   
        changes: ["Barra de vida.", "Cartas Especiais.", "Bordas Azuis cartas mesmo tipo."]
    }
];

// Função para criar a lista de notas de atualização
// Função para criar a lista de notas de atualização
function createPatchNoteList() {
    const patchNoteElement = document.getElementById("patch-note");

    // Verifique se o elemento existe
    if (patchNoteElement) {
        const ul = document.createElement("ul");

        patchNotes.forEach(note => {
            const li = document.createElement("li");

            // Crie um elemento <strong> para o campo "version" e aplique cor personalizada
            const versionElement = document.createElement("strong");
            versionElement.textContent = `Versão ${note.version}: `;
            versionElement.style.color = "#d0a85c"; // Define a cor personalizada
            li.appendChild(versionElement);

            const innerUl = document.createElement("ul");
            note.changes.forEach(change => {
                const innerLi = document.createElement("li");
                innerLi.textContent = change;
                innerUl.appendChild(innerLi);
            });

            li.appendChild(innerUl);
            ul.appendChild(li);
        });

        patchNoteElement.appendChild(ul);
    }
}

// Chame a função para criar a lista de patch notes quando a página for carregada
window.addEventListener("load", createPatchNoteList);


// Chame a função para criar a lista de patch notes quando a página for carregada
window.addEventListener("load", createPatchNoteList);
