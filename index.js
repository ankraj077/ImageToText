const _ = require("lodash");
const tesseract = require("node-tesseract-ocr");
const fs = require("fs");

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}

function generateFileNames() {
    return fs.readdirSync("images");
}

async function processPages(array) {
    fs.writeFileSync("result.txt", "");
    let i = 1;
    for (const page of array) {
        await processEachPage(page, i);
        i++;
    }
    console.log("- Completed -");
}

function processEachPage(pageName, num) {
    return new Promise((resolve, reject) => {
        console.log("Processing - Page", num);
        tesseract.recognize(`images/${pageName}`, config)
            .then(text => {
                fs.appendFileSync("result.txt", `Page ${num} - ${pageName}\n`);
                fs.appendFileSync("result.txt", "--------\n\n");
                fs.appendFileSync("result.txt", text);
                fs.appendFileSync("result.txt", "\n\n");
                resolve();
            })
            .catch(error => {
                console.log(error.message)
            });
    });
}

function run() {
    processPages(generateFileNames());
}

run();