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
    let wordListBtn = document.createElement("button");
    wordListBtn.classList.add("btn");

    for (let i = 0; i <= 10 && wordList.length; i++) {
        let buttonData = `
        <button class="btn" id="wordbutton" type="button">
            ${wordList[i].wordSaved}
            <span>${wordList[i].level}</span>
        </button>
        `
        wordListBtn.innerHTML += buttonData;
        wordBoardEl.appendChild(wordListBtn);
        // Add link for definition of words  (function??)
    }
}
