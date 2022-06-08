// Accesses score board from local storage, if it exists
let wordList = JSON.parse(localStorage.getItem("wordList")) || [];

function storeWord(test, frequency) {
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
    let wordBoardEl = document.getElementById("wordBoard");
    let wordListBtn = document.createElement("button");
    wordListBtn.classList.add("btn");

    while (wordBoardEl.lastChild) {
        wordBoardEl.removeChild(wordBoardEl.lastChild);
    }
    for (let i = 0; i < 10 && wordList.length; i++) {

        console.log(wordList[i].word);

        let buttonData = `
        <button class="btn" id="wordbutton" type="button">
            ${wordList[i].word}
            <span>${wordList[i].frequency}</span>
        </button>
        `
        wordListBtn.innerHTML += buttonData;
        wordBoardEl.appendChild(wordListBtn);
        // Add link for definition of words  (function??)
    }
}
