const ErrorHandler = require("./errorHandler");
const app = require("./app");
const { pool } = require("./db/pool");

let exitCode = 0; // default to success code

async function main() {
    console.log("Starting the baseball data scraping process...");
    await app.run();
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
