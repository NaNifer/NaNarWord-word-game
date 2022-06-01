const API_KEY = "dzRUlVy8AmnIrMfFmPikr7L2vL8qqV97";

function getApi(query) {
    var requestUrl = `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(query)}&api_key=${encodeURIComponent(API_KEY)}`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}
console.log(hello);
getApi("tgif");