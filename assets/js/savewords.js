// Accesses score board from local storage, if it exists
let wordList = JSON.parse(localStorage.getItem("wordList")) || [];

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


// Creagte onclick, render the wordBoard
function renderWordBoard(wordList) {

    let wordBoardEl = document.getElementById("top-10");
    let wordListBtn = document.createElement("div");
    wordListBtn.classList.add("wordButtonContainer");

    for (let i = 0; i <= 10 && i < wordList.length; i++) {
        let buttonData = `
        <button class="btn" id="wordbutton" type="button">
        <span id="rarity-rating">Rarity Rating: ${Math.ceil(wordList[i].level / 10) * 10}</span>
         ${wordList[i].wordSaved}  
        </button>
        `
        wordListBtn.innerHTML += buttonData;
        wordBoardEl.appendChild(wordListBtn);
        // Add link for definition of words  (function??)
    }
}
