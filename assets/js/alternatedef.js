function wordnikCatch(word) {
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
            })
    })
}


