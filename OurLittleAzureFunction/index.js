const fs = require('fs');
const path = require('path');
const Markov = require('markov-strings')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    //const sarasa = require('index');

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            headers: {
                "Content-Type": "text/html"
            },
            // status: 200, /* Defaults to 200 */
            body: "<h1>Hello " + (req.query.name || req.body.name) + "</h1>"
        };
    }
    else if (req.query.filepath || (req.body && req.body.filepath)) {

        const options = {
            maxLength: 140,
            minWords: 10,
            minScore: 25
        };
        let html = "";

        let filepath = "sarasa.txt";

        let base_text = fs.readFileSync(path.resolve(__dirname, filepath), 'utf8').split('\n');

        const markov = new Markov(base_text, options);

        try {
            markov.buildCorpus()
                .then(() => {
                    markov.generateSentence({
                        maxLength: 140
                    })
                        .then(phrase => {
                            this.html = phrase.string;
                        });
                });
        }
        catch (err) {
            this.html = err.message;
        }

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: "<h3>" + this.html + "</h3>"
        };
    }
};