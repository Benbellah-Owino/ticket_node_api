const db = require("../../db/connectdb");

const query = `
DEFINE TABLE user SCHEMAFULL;
DEFINE FIELD username ON TABLE user TYPE string;
DEFINE FIELD email ON TABLE user TYPE string
     VALUE string::lowercase($value)
    ASSERT string::is::email($value);
DEFINE FIELD password ON TABLE user TYPE string VALUE crypto::bcrypt::generate($value);
DEFINE FIELD wallet_address ON TABLE user TYPE string;
DEFINE INDEX userEmailName ON TABLE user COLUMNS username, email UNIQUE;
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