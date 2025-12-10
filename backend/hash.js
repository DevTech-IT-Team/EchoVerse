const bcrypt = require("bcryptjs");

async function generateHash() {
    const password = "Mark123";
    const hash = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hash);
}

generateHash();
