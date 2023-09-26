const ErrorHandler = require("./errorHandler");
const { fetchAndParseCSV } = require("./app/fetchAndParse");
const { pool } = require("./db/pool");
const { saveToDatabase } = require("./db/db");

let exitCode = 0; // default to success code

async function main() {
    console.log("Starting the baseball data scraping process...");
    const { players, stats } = await fetchAndParseCSV();
    await saveToDatabase(players, stats);
}

main()
    .then(() => {
        console.log(
            "Successfully completed the baseball data scraping process."
        );
    })
    .catch((err) => {
        ErrorHandler.handleError(err);
        exitCode = 1; // failure code
    })
    .finally(() => {
        pool.end().then(() => {
            process.exit(exitCode);
        });
    });
