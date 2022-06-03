
// Nifer testing branch

// Nolan
// Event Listener for Level Selection
$("#level-div").on("click", "button", function(event) {
    let btnEl = event.target;
    let level = btnEl.data.level;
    console.log(`The level is ${level}`);
    // call word search function with level of word
    // figure what to hide and show
})

// Nolan
// Words API random fetch
function randomWordFetch(level) {
    fetch(`https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=4&lettersMax=7&frequencyMax=${level}/definitions`, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            merriamFetch(data.word);
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