const db = require("../../db/connectdb");

const query = `
DEFINE TABLE organizer SCHEMAFULL;
DEFINE FIELD username ON TABLE organizer TYPE string;
DEFINE FIELD email ON TABLE organizer TYPE string
    VALUE string::lowercase($value)
    ASSERT string::is::email($value);
DEFINE FIELD password ON TABLE organizer TYPE string VALUE crypto::bcrypt::generate($value);
DEFINE FIELD wallet_address ON TABLE organizer TYPE string;
DEFINE FIELD phone.* ON TABLE organizer type string;
DEFINE FIELD socials ON TABLE organizer type object;
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