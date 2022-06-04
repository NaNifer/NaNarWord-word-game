
// Global Variables
// Nolan
var word;



// // start button event listener
// Nifer
// start button event listener

var startBtn = document.getElementById("start");
startBtn.addEventListener("click", startGame);

function startGame() {
  document.getElementById("start").style.display = "none";
  document.getElementById("level").style.display = "block";
//   possible add/remove class instead
}


// Nolan
// Event Listener for Level Selection
$("#level-div").on("click", "button", function(event) {
    let btnEl = event.target;
    let level = $(btnEl).data("level");
    console.log(`The level is ${level}`);
    // call word search function with level of word
    randomWordFetch(level);
    // figure what to hide and show
})

// Nolan
// Words API random fetch
function randomWordFetch(level) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
            'X-RapidAPI-Key': '4d97b98fbamshd06a775c8ed3df9p1429d2jsnbf625cf74463'
        }
    };
    fetch(`https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=4&lettersMax=7&frequencyMax=${level}/definitions`, options)
        .then(response => response.json())
        .then(data => {
            word = data.word.toUpperCase();
            gameScreen()
        })
        .catch(err => console.error(err));
}

// Nolan
// Function to get the dictionary definition for the word
function merriamFetch(word) {
    // fetch the definition
    fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=654815a3-9693-4044-8b6a-47115bdf7017`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}


// Nolan
// Function to print gameplay Screen
function gameScreen() {
    // Create a div element to hold the guessing letters
    let guessDiv = $('<div id="guess-div"></div>');
    // Loop to create Empty word elements to guess
    for (i=0; i<word.length; i++) {
        let guess = $("<h2>")
            .addClass("guess-el")
            .data("letter", word[i])
            .css({"border-bottom": "8px solid black", "display": "inline-block", "width": "75px", "margin": "0 10px"});
        guessDiv.append(guess);
    }
    // Create array of uppercased letters
    let keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    keys.split('');
    // create a key div with id=key-div
    let keyDiv = $('<div id="key-div"></div>');
    // Loop to create key div elements for keyboard
    for (i=0; i<keys.length; i++) {
        let keyEl = $("<button>")
            .addClass("key-el")
            .data("letter", keys[i])
            .text(keys[i]);
        keyDiv.append(keyEl);
    }
    // Append to the game container div
    $("#game-div").append(guessDiv, keyDiv)
}

// Nolan
// Event handlers for the generated keyboard
$("#game-div").on("click", "button", function(event) {
    let btnEl = event.target;
    // Store buttons data-letter as guess
    let guess = $(btnEl).data("letter");
    // Check if letter clicked is in the word string
    if (word.includes(guess)) {
        // loop to fill in the correct letter spaces
        for (i=0; i<word.length; i++) {
            let slotEl = $("#guess-div").child(i).data("letter");
            if (guess === slotEl) {
                slotEl.text(guess);
            }
        }
    }
});

// Nifer
// Looks up giphy with input of WIN OR LOOSE, 
// if win == search awesome, if loose == search bummer
// then calls on displayGiphy()
function getGiphy(query) {
    const API_KEY = "dzRUlVy8AmnIrMfFmPikr7L2vL8qqV97";
    let requestUrl = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=1`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayGiphy(data);
        });
}
// Nifer
// Displays giphy in div
// TODO: replace "gif" with ID for html element
function displayGiphy(data) {
    document.getElementById("gif").src= data.data[0].images.downsized.url;
}


