// Accesses score board from local storage, if it exists
let wordList = JSON.parse(localStorage.getItem("wordList")) || [];
let buttonData;

// Nifer
// Stores word and frequency into local storage, and sorts it with highest frequency first
function storeWord(word, frequency) {
    let userWordInfo = {
        wordSaved: word,
        level: frequency,
    };
    wordList.push(userWordInfo);
    wordList.sort((a, b) => a.level - b.level);
    localStorage.setItem("wordList", JSON.stringify(wordList));
    renderWordBoard(wordList);
}

// Nifer
// Create onclick, render the wordBoard
function renderWordBoard(wordList) {
    let wordBoardEl = document.getElementById("top-10");
    let wordListDiv = document.createElement("div");
    wordListDiv.classList.add("wordButtonContainer");
    wordListDiv.innerHTML = "";
    for (let i = 0; i <= 10 && i < wordList.length; i++) {
        buttonData = `
        <a href="#modal-word-bank" class="modal-trigger">
        <button id="wordbutton" type="button" data-target="modal-word-bank" class="btn modal-trigger" data-word=${wordList[i].wordSaved}>
         ${wordList[i].wordSaved}  
        </button>
        </a>
        `
        wordListDiv.innerHTML += buttonData;
        wordBoardEl.appendChild(wordListDiv);
        wordListDiv.addEventListener("click", function (event) {
            let buttonEl = event.target
            retrieveDefinition(buttonEl, wordList);
        });
    }
}

// Nifer
// Calls on definition and displays modal
function retrieveDefinition(buttonEl, wordList) {
    let appendDefEl = document.getElementById("append-definition");
    console.log(appendDefEl);
    // Empties div here
    if (appendDefEl.hasChildNodes()) {
        appendDefEl.innerHTML = "";
    }
    let recallWord = buttonEl.dataset.word;
    console.log(recallWord);
    let defArray = grabWordDef(recallWord);
    appendDefEl.append(defArray[0], defArray[1], defArray[2], "Rarity Rating: " + Math.ceil(wordList[i].level / 10) * 10);
}

// Angie & Ivy
// Loads the modal on page load and connects the elems to the modal instance.
document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('#modal-word-bank');
    let instances = M.Modal.init(elems, {});
});

