const db = require("../../db/connectdb");

const query = `
DEFINE TABLE event SCHEMAFULL;
DEFINE FIELD name ON TABLE event TYPE string;
DEFINE FIELD price ON TABLE event TYPE decimal;
DEFINE FIELD opening ON TABLE event TYPE datetime;
DEFINE FIELD closing ON TABLE event TYPE datetime;
DEFINE FIELD hour_range ON TABLE event FLEXIBLE TYPE object;
DEFINE FIELD tickets_quantity ON TABLE event TYPE int;
DEFINE FIELD tickets_sold ON TABLE event TYPE int;
DEFINE FIELD description ON TABLE event TYPE string;
DEFINE FIELD organizer ON TABLE event TYPE record;
DEFINE FIELD status.* ON TABLE event TYPE string ASSERT $value INSIDE ["AVAILABLE", "SOLDOUT", "CLOSED", "CANCELLED"] DEFAULT "AVAILABLE"
`
/**
 * creates the organizer schema
 */
const create_model = async()=>{
    try {
        await db.query(query)
    } catch (error) {
        console.error(`[${Date.now()}] models/organizer/mod.js/create_model:-> ${error}`);
    }
}

module.exports = create_model;