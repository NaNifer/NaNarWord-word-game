// Event Listener for Level Selection
$("#level-div").on("click", "button", function(event) {
    let btnEl = event.target;
    let level = btnEl.data.level;
    console.log(`The level is ${level}`);
    // call word search function with level of word
})