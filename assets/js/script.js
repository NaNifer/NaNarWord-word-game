
// Global Variables
// Nolan
let word;
let guessCount = 0;
let frequency;
let giphyDataArray;
let WordDefData;

// Nolan
// audio for webpage
// Sound for user input letter guesses
let audioPop = new Audio("./assets/sound/pop.mp3");
audioPop.volume = 0.6;
// Sound for wrong user input letter guesses
let audioBuzzer = new Audio("./assets/sound/buzzer.wav");
audioBuzzer.volume = 0.3;
// Sound for winning game
let audioSuccess = new Audio("./assets/sound/success.wav");
audioSuccess.volume = .45;
// Sound for losing game
let audioFailure = new Audio("./assets/sound/failure.wav");
audioFailure.volume = .6;


// // start button event listener
// Nifer
// start button event listener
var startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", startGame);

function startGame() {
    $("#start").hide();
    $("#level-div").show();
    //   possible add/remove class instead
}

// Nolan
// restart button event listener
$("#restart-btn").on("click", function() {
    // Hide game div and button div and aside
    // Empty the game div and guess div
    $("#guesses").empty();
    $("#game-div").empty();
    $("#game-div").hide();
    $("#btn-div").hide();
    $("#aside").hide();
    // Show the level selection to start new game
    $("#level-div").show();
})

// Nolan
// Event Listener for Level Selection
$("#level-div").on("click", "button", function (event) {
    let btnEl = event.target;
    let level = $(btnEl).data("level");
    console.log("User level: " + level);
    // call word search function with level of word
    randomWordFetch(level);
    // Hide the level div
    $("#level-div").hide();
    // show rules button
    $("#rules-btn").show();
})

// Nolan
// Initialization for materialize modal
$(document).ready(function () {
    $('.modal').modal();
});

// Nolan
// Wordnik API random fetch
function randomWordFetch(level) {
    // Handle level settings
    let corpus;
    if (level === 2) {
        corpus = `minCorpusCount=10&maxCorpusCount=400`;
    }
    else if (level === 4) {
        corpus = `minCorpusCount=401&maxCorpusCount=9999`;
    }
    else {
        corpus = `minCorpusCount=10000`;
    }
    const apiKey = 'hhienm8ei1xnj2ctbftdhka6dgygqlxs3kta6w8x3j1umngci';
    fetch(`https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&${corpus}&minLength=4&maxLength=7&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            word = data.word;
            console.log(word);
            // don't allow proper nouns or words with special characters
            if (word.charAt(0) === word.charAt(0).toUpperCase() || /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]/.test(word)) {
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
            console.log("The frequency is: " + frequency);
        })
        .catch(err => console.error(err));
}

// Nolan
// Wordnik API defintition fetch for website URL
function wordnikFetch(word) {
    return new Promise(function (resolve, reject) {
        const apiKey = 'hhienm8ei1xnj2ctbftdhka6dgygqlxs3kta6w8x3j1umngci';
        fetch(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=${apiKey}`)

            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                resolve(data);
            }).catch(function (error) {
                reject(error);
            });
    });
};


// Nifer
// !!NOTE!!  This is a working rewrite of merriamFetch. :)
function merriamFetch(word) {
    return new Promise(function (resolve, reject) {
        fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=654815a3-9693-4044-8b6a-47115bdf7017`)
            .then(function (response) {
                return response.json();
            })
            .then(async function (data) {
                console.log(data, "129");
                // Check to make sure data returned is full object not array of strings
                if (typeof data[0] === 'object') {
                    let goodFetch = true;
                    let merriamArray = [data, goodFetch]
                    resolve(merriamArray);
                }
                if (typeof data[0] === 'string') {
                    let wordnikData = await wordnikFetch(word.toLowerCase());
                    let goodFetch = false;
                    let merriamArray = [wordnikData, goodFetch];
                    resolve(merriamArray);
                }
            }).catch(async function (error) {
                console.log("error in catch for merriam" + error);
                let wordnikData = await wordnikFetch(word.toLowerCase());
                let goodFetch = false;
                let merriamArray = [wordnikData, goodFetch];
                reject(merriamArray);
            });
    });
}

// Nolan
// Uses the data structure that is Fetched in merriamFetch()
// Returns the audio src URL to add to an audio tag
// Returns if the audio URL doesn't exist
function merriamSound(data) {
    console.log(data);
    // check if audio exists
    if ("prs" in data[0].hwi) {
        let audio = data[0].hwi.prs[0].sound.audio;
        // if audio doesn't exist then return
        if (!audio) {
            return;
        }
        // Define the subdirectory parameter using Merriam's API documentation instructions
        let subDir;
        if ((/\d/g).test(audio.charAt(0))) {
            subDir = 'number';
        }
        if (audio.charAt(0) === 'g' && audio.charAt(1) === 'g') {
            subDir = 'gg';
        }
        if (audio.charAt(0) === 'b' && audio.charAt(1) === 'i' && audio.charAt(2) === 'x') {
            subDir = 'bix'
        }
        else {
            subDir = audio[0];
        }
        // Return the url for the src attribute of an audio element
        let audioUrl = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subDir}/${audio}.mp3`
        let audioMerriam = document.createElement("audio");
        audioMerriam.src = audioUrl;
        audioMerriam.controls = true;
        return audioMerriam;
    }
    else {
        let audioMerriam = document.createElement("p");
        audioMerriam.textContent = "There is no audio file from Merriam Webster API for this word."
        return audioMerriam;
    }
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
    // Show game div, button div, and aside
    $("#btn-div").show();
    $("#aside").show();
    $("#game-div").show();
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
    // Call guessCheck to check guess
    guessCheck(guess);
    // Update guess count on HTML
    $(".guess-count").text("Guesses Remaining: " + guessCount);
});

// Nolan
// Guess Event Listener
// Event Listener for keyboard input
addEventListener("keydown", function (event) {
    // store guess as uppercase letter
    let guess = event.key.toUpperCase();
    // don't allow any non-letter characters
    if (guess.charCodeAt(0) > 90 || guess.charCodeAt(0) < 65 || guess.length > 1) {
        return;
    }
    // return if the user is not currently in gameplay (avoid errors in console)
    if (guessCount === 0) {
        return;
    }
    // Target specific button that has guess as data-attribute
    let btnEl = $(`button[data-letter="${guess}"]`);
    // If the key hasn't been pressed continue
    if ($(btnEl).attr("class").includes("key-el")) {
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
        // Change class of corresponding letter guess button for correct input
        $(`#key-div > [data-letter=${guess}]`).addClass("key-correct");
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
            // Play the success sound!
            audioSuccess.play();
            // set a timeout function to allow user to briefly view finished word
            setTimeout(() => {
                // set guesscount to 0 so that keyboard event listener will be returned when not in gameplay
                guessCount = 0;
                // empty the guess count container
                $("#guesses").empty();
                console.log("User won");
                endGame(true, frequency);
            }, 2000)
        }
    }
    // Incorrect Guess case
    else {
        audioBuzzer.pause();
        audioBuzzer.currentTime = 0;
        audioBuzzer.play();
        // subtract from guess count
        guessCount--;
        // Change class of corresponding letter guess button for correct input
        $(`#key-div > [data-letter=${guess}]`).addClass("key-wrong");
    }
    // lose if out of guesses
    if (guessCount === 0) {
        // Play the failure sound!
        audioFailure.play();
        // empty the guess count container
        $("#guesses").empty();
        console.log("User lost");
        endGame(false, frequency);
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
// make async so that it wait for the definition fetch
async function grabWordDef(word) {
    let revealWordEl = document.createElement("p");
    let figSpeechEl = document.createElement("p");
    let wordDefinition = document.createElement("p");
    let wordnikLink = document.createElement("a");
    let wordnikHeader = document.createElement("p");
    wordnikHeader.innerText = "Merriam Webster doesn't have a definition, check out Wordnik API's web entry:";
    revealWordEl.classList.add("revealWord");
    figSpeechEl.classList.add("figure-speech");
    wordDefinition.classList.add("revealDef");
    revealWordEl.innerText = word;
    // create a definition array to return
    let defArr;

    await merriamFetch(word).then(function (WordDefData) {
        // Check created conditional to see if Merriam Webster source is returned
        if (WordDefData[1]) {
            console.log(WordDefData);
            // Get Audio URL from merriamSound()
            let audioMerriam = merriamSound(WordDefData[0]);
            wordDefinition.innerText = WordDefData[0][0].shortdef[0];
            figSpeechEl.innerText = WordDefData[0][0].fl;
            defArr = [WordDefData[1], revealWordEl, figSpeechEl, wordDefinition, audioMerriam];
        }
        // wordnik Data case
        else {
            wordnikLink.href = WordDefData[0][0].wordnikUrl;
            wordnikLink.target = "_blank";
            wordnikLink.textContent = "Wordnik Word Entry";
            defArr = [WordDefData[1], revealWordEl, wordnikHeader, wordnikLink];
        }
    });
    return defArr;
}

// Nifer
//  Creates message & word def divs, depending on win/lose
// Async to wait for the grabWordDef() function before appending
async function endGame(win) {
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
    let defArray = await grabWordDef(word);
    console.log(defArray);
    // if it is the Merriam Webster definition
    if (defArray[0] === true) {
        if (win) {
            document.getElementById("game-div").append(giphyEl, winMessage, defArray[1], defArray[2], defArray[3], defArray[4]);
        }
        else {
            document.getElementById("game-div").append(giphyEl, sorryMessage, defArray[1], defArray[2], defArray[3], defArray[4]);
        }
    }
    // if it is the Wordnik Source URL
    else {
        if (win) {
            document.getElementById("game-div").append(giphyEl, winMessage, defArray[1], defArray[2], defArray[3]);
        }
        else {
            document.getElementById("game-div").append(giphyEl, sorryMessage, defArray[1], defArray[2], defArray[3]);
        }
    }
    storeWord(word, frequency);
}

// Nifer TODO:
// Restart button , hide game div, show level div
// reinitialize the guess count and hide guess count -- ID=#guesses  .empty()