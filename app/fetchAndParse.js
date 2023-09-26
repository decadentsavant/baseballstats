const AppError = require("./errors/AppError");
const {
    launchBrowserAndNavigate,
    handleExtraElements,
    fetchCSVData,
} = require("./browser/browserActions");
const { parseCSVData } = require("./csv/csvParser");

async function fetchAndParseCSV() {
    let browser;
    try {
        const { browser: newBrowser, page } = await launchBrowserAndNavigate(
            "https://www.fangraphs.com/leaders/minor-league?pos=all&level=0&lg=2,4,5,6,7,8,9,10,11,14,12,13,15,16,17,18,30,32,33&stats=bat&qual=y&type=1&team=all&season=2023&seasonEnd=2023&org=all&ind=0&splitTeam=false&players=&sort=19,1"
        );
        browser = newBrowser;
        await handleExtraElements(page);
        const csvData = await fetchCSVData(page);
        await browser.close();
        return await parseCSVData(csvData);
    } catch (err) {
        if (browser) {
            await browser.close();
        }
        throw new AppError("Failed in fetchAndParseCSV", 500, err);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = {
    fetchAndParseCSV,
};
