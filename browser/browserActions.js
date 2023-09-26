const puppeteer = require("puppeteer");
const AppError = require("./errors/AppError");

const TIMEOUT = 5 * 60 * 1000;
const WAIT_CLOSE_BUTTON = 500;

async function launchBrowserAndNavigate(url) {
    let browser, page;
    try {
        // headless boolean deprecated
        browser = await puppeteer.launch({ headless: "new" });
        page = await browser.newPage();
        await page.goto(url, { timeout: TIMEOUT });
    } catch (err) {
        if (browser) await browser.close();
        throw new AppError("Failed to launch browser or navigate", 500, err);
    }
    return { browser, page };
}

// Handles occasional popup
async function handleExtraElements(page) {
    try {
        const closeButton = await page.$('[data-testid="CloseIcon"]');
        if (closeButton) {
            await closeButton.click();
            await new Promise((r) => setTimeout(r, WAIT_CLOSE_BUTTON));
        }
    } catch (err) {
        throw new AppError("Failed to handle extra elements", 500, err);
    }
}

async function fetchCSVData(page) {
    try {
        // Find export button...
        const exportButton = await page.$(".data-export");
        if (!exportButton) {
            throw new AppError("Failed to find the export button", 500);
        }
        // Get href data...
        const csvDataUri = await page.evaluate(
            (element) => element.href,
            exportButton
        );
        // CSV data is embedded in href data as URI, so decode it...
        return decodeURIComponent(csvDataUri.split(",")[1]);
    } catch (err) {
        throw new AppError("Failed to fetch CSV data", 500, err);
    }
}

module.exports = {
    launchBrowserAndNavigate,
    handleExtraElements,
    fetchCSVData,
};