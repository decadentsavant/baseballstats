const csvScraper = require("./browser/csvScraper");
const parseCSVData = require("../csv/parseCSVData");
const { saveToDatabase } = require("./db/db");

async function run() {
    const rawCsvData = await csvScraper();
    const { players, stats } = await parseCSVData(rawCsvData);
    await saveToDatabase(players, stats);
}

module.exports = {
    run,
};
