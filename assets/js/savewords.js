// Accesses score board from local storage, if it exists
let wordList = JSON.parse(localStorage.getItem("wordList")) || [];
let buttonData;

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
    let wordListDiv = document.createElement("div");
    wordListDiv.classList.add("wordButtonContainer");

    for (let i = 0; i <= 10 && i < wordList.length; i++) {
        buttonData = `
        <button class="btn" id="wordbutton" type="button">
        <span id="rarity-rating">Rarity Rating: ${Math.ceil(wordList[i].level / 10) * 10}</span>
         ${wordList[i].wordSaved}  
        </button>
        `
        wordListDiv.innerHTML += buttonData;
        wordBoardEl.appendChild(wordListDiv);
    }
}


// Click listener for Word Borad buttons
$("#wordbutton").on("click", function (event) {
    console.log(event)
})



// Calls on definition and displays modal
function retrieveDefinition() {
    let recallWord = getElementById("#wordbutton").innerHTML;
    let defArray = grabWordDef(recallWord);
    let DefinitionModal = `<div id="modal2" class="modal">
    <div class="modal-content">
        <h4 id="chosen-button-word">${defArray[0]}</h4>
        <p id="chosen-button-speech">${defArray[1]}</p>
        <p id="chosen-button-definition">${defArray[2]}</p>
    </div>
    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Thanks!</a>
    </div>
</div>
`
}

$(document).ready(function () {
    $('#modal2').modal();
});

