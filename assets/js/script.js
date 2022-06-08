
// Global Variables
// Nolan
let word;
let guessCount;
let frequency;
let giphyDataArray;
let WordDefData;

// Nolan
// audio for webpage
// Sound for user input letter guesses
let audioPop = document.createElement("AUDIO");
document.body.appendChild(audioPop);
audioPop.src = "./assets/sound/pop.mp3";
audioPop.volume = 0.6;
// Sound for wrong user input letter guesses
let audioBuzzer = document.createElement("AUDIO");
document.body.appendChild(audioBuzzer);
audioBuzzer.src = "./assets/sound/buzzer.wav";
audioBuzzer.volume = 0.3;


// // start button event listener
// Nifer
// start button event listener
var startBtn = document.getElementById("start");
startBtn.addEventListener("click", startGame);

function startGame() {
    $("#start").hide();
    $("#level-div").show();
    //   possible add/remove class instead
}


// Nolan
// Event Listener for Level Selection
$("#level-div").on("click", "button", function (event) {
    let btnEl = event.target;
    let level = $(btnEl).data("level");
    // call word search function with level of word
    randomWordFetch(level);
    // Hide the level div
    $("#level-div").hide();
})

// Nolan
// Initialization for materialize modal
$(document).ready(function(){
    $('.modal').modal();
  });

// Nolan
// Wordnik API random fetch
function randomWordFetch(level) {
    // Handle level settings
    let corpus;
    if (level === 2) {
        corpus = `minCorpusCount=10&maxCorpus=300`;
    }
    else if (level === 4) {
        corpus = `minCorpusCount=301&maxCorpus=1000`;
    }
    else {
        corpus = `minCorpusCount=10000`;
    }
    const apiKey = 'hhienm8ei1xnj2ctbftdhka6dgygqlxs3kta6w8x3j1umngci';
    fetch(`https://api.wordnik.com/v4/words.json/randomWord?excludePartOfSpeech=proper-noun&${corpus}&minLength=4&maxLength=7&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            word = data.word;
            console.log(word);
            // don't allow proper nouns
            if (word.charAt(0) === word.charAt(0).toUpperCase() || /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(word)) {
                randomWordFetch(level);
            }
            else {
                frequencyWordFetch(word);
                // Capitolize the word for game play
                word = word.toUpperCase();
                gameScreen();
            }
        })
        .catch(err => console.error(err));
}

// Nolan
// Wordnik API frequency fetch
function frequencyWordFetch(word) {
    const apiKey = 'hhienm8ei1xnj2ctbftdhka6dgygqlxs3kta6w8x3j1umngci';
    fetch(`https://api.wordnik.com/v4/word.json/${word}/frequency?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Defines global variable for corpus frequency for current played word
            frequency = data.totalCount;
        })
        .catch(err => console.error(err));
}


// Nifer
// !!NOTE!!  This is a working rewrite of merriamFetch. :)
function merriamFetch(word) {
    return new Promise(function (resolve, reject) {
        fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=654815a3-9693-4044-8b6a-47115bdf7017`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                resolve(data);
            }).catch(function (error) {
                reject(error);
            });
    });
}

// Nolan
// Function to print gameplay Screen and Guess Count in Header
function gameScreen() {
    // Empty the game div
    $("#game-div").empty();
    // Create a div element to hold the guessing letters
    let guessDiv = $('<div id="guess-div"></div>');
    // Loop to create Empty word elements to guess
    for (i = 0; i < word.length; i++) {
        let guess = $("<h2>")
            .addClass("guess-el")
            .data("letter", word[i])
            .css({ "border-bottom": "8px solid black", "display": "inline-block", "width": "75px", "margin": "0 10px" });
        guessDiv.append(guess);
    }
    // Create array of uppercased letters
    let keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    keys.split('');
    // create a key div with id=key-div
    let keyDiv = $('<div id="key-div"></div>');
    // Loop to create key button elements for keyboard
    for (i = 0; i < keys.length; i++) {
        // New data attr adding syntax
        let keyEl = $("<button>")
            .addClass("key-el")
            .attr("data-letter", keys[i])
            .text(keys[i]);
        keyDiv.append(keyEl);
    }
    // Append to the game container div
    $("#game-div").append(guessDiv, keyDiv)
    // initialize the guess count
    guessCount = 10;
    // Add Guess Count to header
    let guessEl = $("<p>")
        .addClass("guess-count")
        .text("Guesses Remaining: " + guessCount);
    $("#guesses").append(guessEl);
}

// Nolan
// Guess Event Listener
// Event handler for the generated keyboard
$("#game-div").on("click", ".key-el", function (event) {
    // Change btnEl class so it can't be click again and style is changed
    let btnEl = event.target;
    $(btnEl).removeClass("key-el").addClass("key-pressed");
    // Store buttons data-letter as guess
    let guess = $(btnEl).data("letter");
    // Subtract from Guess Count, if equal to zero call end game
    guessCount--;
    // Call guessCheck to check guess
    guessCheck(guess);
    // Update guess count on HTML
    $(".guess-count").text("Guesses Remaining: " + guessCount);
});

// Nolan
// Event Listener for keyboard input
addEventListener("keydown", function (event) {
    // store guess as uppercase letter
    let guess = event.key.toUpperCase();
    // Target specific button that has guess as data-attribute
    let btnEl = $(`button[data-letter="${guess}"]`);
    // If the key hasn't been pressed continue
    if ($(btnEl).attr("class").includes("key-el")) {
        // Subtract from Guess Count
        guessCount--;
        // Call guessCheck to check guess
        guessCheck(guess);
    }
    else {
        return;
    }
    // // Change class of corresponding letter guess button
    $(`#key-div > [data-letter=${guess}]`)
        .removeClass("key-el")
        .addClass("key-pressed");
    // Update guess count on HTML
    $(".guess-count").text("Guesses Remaining: " + guessCount);
});

// Nolan
// Function to check guess from user input
// Plays a corresponding sound for correct and incorrect input
// Calls endgame when word is guessed or user guesses run out
function guessCheck(guess) {
    // Check if letter clicked is in the word string
    if (word.includes(guess)) {
        // play audio for correct guess
        audioPop.pause();
        audioPop.currentTime = 0;
        audioPop.play();
        // loop to fill in the correct letter spaces on HTML
        let slotEl = $("#guess-div").children();
        let check = '';
        for (i = 0; i < word.length; i++) {
            if (guess === $(slotEl[i]).data("letter")) {
                $(slotEl[i]).text(guess);
            }
            // create check word string
            check = check + $(slotEl[i]).text();
        }
        // If the whole word is guessed, then win.  If out of guesses, lose
        if (check === word) {
            console.log("User lost");
            endGame(true, frequency);
        }
        else if (guessCount === 0) {
            console.log("User won");
            endGame(false, frequency);
        }
    }
    // Play buzzer for wrong guess
    else {
        audioBuzzer.pause();
        audioBuzzer.currentTime = 0;
        audioBuzzer.play();
    }
}

// Nifer
// Looks up giphy with input of WIN OR LOOSE, 
// if win == search awesome, if loose == search bummer
// then calls on endGame()
function getGiphy(query) {
    const API_KEY = "dzRUlVy8AmnIrMfFmPikr7L2vL8qqV97";
    let requestUrl = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=1`;

    return new Promise(function (resolve, reject) {
        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                resolve(data);
            }).catch(function (error) {
                reject(error);
            });
    });
}

// Nifer
// Checks for win/lose and prints a giphy
function printGiphy(win) {

    let giphyEl = document.createElement("img");
    giphyEl.classList.add("giphyImg");
    if (win) {
        // QUESTION: Do I need to change giphyData (below) to giphyDataArray?? Scott had me change the global variable name at the top.
        getGiphy("awesome").then(function (giphyData) {
            giphyEl.src = giphyData.data[0].images.downsized.url;
        })
    }
    else {
        getGiphy("bummer").then(function (giphyData) {
            console.log(giphyData);
            giphyEl.src = giphyData.data[0].images.downsized.url;
        })
    }
    return giphyEl;
}

// Nifer
function grabWordDef(word) {
    let revealWordEl = document.createElement("p");
    let figSpeechEl = document.createElement("p");
    let wordDefinition = document.createElement("p");
    revealWordEl.classList.add("revealWord");
    figSpeechEl.classList.add("figure-speech")
    wordDefinition.classList.add("revealDef")
    revealWordEl.innerText = word;

    merriamFetch(word).then(function (WordDefData) {
        wordDefinition.innerText = WordDefData[0].shortdef[0];
        figSpeechEl.innerText = WordDefData[0].fl;
    })
    return [revealWordEl, figSpeechEl, wordDefinition];
}

// Nifer
//  Creates message & word def divs, depending on win/lose
function endGame(win) {
    $("#game-div").empty();
    $("#rules-btn").hide();
    $("#restart-btn").show();

    let sorryMessage = document.createElement("p");
    let winMessage = document.createElement("p");
    sorryMessage.classList.add("sorryMsg");
    winMessage.classList.add("winMsg")
    sorryMessage.innerText = "Bummer.  Click / tap the button below to try again!"
    winMessage.innerText = "Winning!  You got it.  Your solved word has been saved.  Play again to solve another word."

    // Prints gif
    let giphyEl = printGiphy(win);
    // Grabs the word definition and article of speech
    let defArray = grabWordDef(word);

    if (win) {
        document.getElementById("game-div").append(giphyEl, winMessage, defArray[0], defArray[1], defArray[2]);
    }
    else {
        document.getElementById("game-div").append(giphyEl, sorryMessage, defArray[0], defArray[1], defArray[2])
    }
    storeWord(word, frequency);
}

// Nifer TODO:
// Restart button , hide game div, show level div
// reinitialize the guess count and hide guess count -- ID=#guesses  .empty()


// Nifer
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
}

// Nifer
// Is there a random gif query selector?