import csvScraper from "../browser/csvScraper.js";
import parseCSVData from "../csv/parseCSVData.js";
import saveToDatabase from "../db/db.js";

export default async function app() {
    const rawCsvData = await csvScraper();
    const { players, stats } = await parseCSVData(rawCsvData);
    await saveToDatabase(players, stats);
}
