const csvParser = require("csv-parser");
const streamifier = require("streamifier");
const AppError = require("../errors/AppError");

async function parseCSVData(csvData) {
    try {
        const csvStream = streamifier.createReadStream(csvData);
        const players = [];
        const stats = [];
        return new Promise((resolve, reject) => {
            csvStream
                .pipe(csvParser())
                .on("data", (row) => {
                    const playerId = row["PlayerId"];
                    const name = row["Name"];
                    const team = row["Team"];

                    players.push({
                        id: playerId,
                        name: name,
                    });

                    stats.push({
                        player_id: playerId,
                        team: team,
                        level: row["Level"],
                        age: row["Age"],
                        pa: row["PA"],
                        bb_pct: row["BB%"],
                        k_pct: row["K%"],
                        bb_k: row["BB/K"],
                        avg: row["AVG"],
                        obp: row["OBP"],
                        slg: row["SLG"],
                        ops: row["OPS"],
                        iso: row["ISO"],
                        spd: row["Spd"],
                        babip: row["BABIP"],
                        wsb: row["wSB"],
                        wrc: row["wRC"],
                        wraa: row["wRAA"],
                        woba: row["wOBA"],
                        wrc_plus: row["wRC+"],
                    });
                })
                .on("end", () => resolve({ players, stats }))
                .on("error", reject);
        });
    } catch (err) {
        throw new AppError("Failed to parse CSV data", 500, err);
    }
}

module.exports = {
    parseCSVData,
};
