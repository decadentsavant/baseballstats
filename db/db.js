import AppError from "../errors/AppError.js";
import pool from "./pool.js";

export default async function saveToDatabase(players, stats) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        for (let player of players) {
            await client.query(
                "INSERT INTO players(player_id, name) VALUES($1, $2) ON CONFLICT (player_id) DO NOTHING",
                [player.id, player.name]
            );
        }

        for (let stat of stats) {
            await client.query(
                `INSERT INTO stats(player_id, team, level, age, pa, bb_pct, k_pct, bb_k, avg, obp, slg, ops, iso, spd, babip, wsb, wrc, wraa, woba, wrc_plus, date_fetched) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP) ON CONFLICT (player_id, date_fetched) DO NOTHING`,
                [
                    stat.player_id,
                    stat.team,
                    stat.level,
                    stat.age,
                    stat.pa,
                    stat.bb_pct,
                    stat.k_pct,
                    stat.bb_k,
                    stat.avg,
                    stat.obp,
                    stat.slg,
                    stat.ops,
                    stat.iso,
                    stat.spd,
                    stat.babip,
                    stat.wsb,
                    stat.wrc,
                    stat.wraa,
                    stat.woba,
                    stat.wrc_plus,
                ]
            );
        }

        await client.query("COMMIT");
    } catch (err) {
        try {
            console.error("Initiating rollback due to error.");
            await client.query("ROLLBACK");
        } catch (rollbackErr) {
            console.error("Failed to rollback transaction: ", rollbackErr);
        }
        throw new AppError("Database operation failed", 500, err);
    } finally {
        client.release();
    }
}
