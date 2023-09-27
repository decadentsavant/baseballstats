import ErrorHandler from "./errors/errorHandler.js";
import app from "./app/app.js";
import pool from "./db/pool.js";

let exitCode = 0; // default to success code

async function main() {
    console.log("Starting the baseball data scraping process...");
    await app();
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
