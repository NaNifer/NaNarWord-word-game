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
    let wordListDiv = document.getElementById("word-list-div");
    wordListDiv.classList.add("wordButtonContainer");
    wordListDiv.innerHTML = "";
    for (let i = 0; i < 10 && i < wordList.length; i++) {
        buttonData = `
        <a href="#modal-word-bank" class="modal-trigger">
        <button id="wordbutton" type="button" data-target="modal-word-bank" class="btn modal-trigger" data-word=${wordList[i].wordSaved} data-frequency=${wordList[i].level}>
         ${wordList[i].wordSaved}  
        </button>
        </a>
        `
        wordListDiv.innerHTML += buttonData;
    }
}

// Nifer
// Sets event listener
$("#word-list-div").on("click", "button", function (event) {
    let buttonEl = event.target
    retrieveDefinition(buttonEl, wordList);
});


// Nifer
// Calls on definition and displays modal
async function retrieveDefinition(buttonEl, wordList) {
    let appendDefEl = document.getElementById("append-definition");
    // Empties div here
    if (appendDefEl.hasChildNodes()) {
        appendDefEl.innerHTML = "";
    }
    let recallFreqEl = document.createElement("p");
    let recallWord = buttonEl.dataset.word;
    recallFreqEl.innerText = `Corpus Frequency: ${buttonEl.dataset.frequency}`;
    let defArray = await grabWordDef(recallWord);
    // Merriam
    if (defArray[0] === true) {
        appendDefEl.append(
            defArray[1],
            defArray[2],
            defArray[3],
            defArray[4],
            recallFreqEl,
            defArray[6],
            defArray[7]
        );

    }
    // If it is the Wordnik Source URL
    else {
        appendDefEl.append(
            defArray[1],
            defArray[2],
            defArray[3],
            recallFreqEl,
            defArray[5]
        );
    }

}

// Angie & Ivy
// Loads the modal on page load and connects the elems to the modal instance.
document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('#modal-word-bank');
    let instances = M.Modal.init(elems, {});
});

