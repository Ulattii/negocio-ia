const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL
        ? { rejectUnauthorized: false }
        : false
});

async function iniciarBanco() {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS leads (
            id SERIAL PRIMARY KEY,
            nome TEXT NOT NULL,
            whatsapp TEXT NOT NULL,
            interesse TEXT NOT NULL,
            modelo TEXT,
            ano TEXT,
            status TEXT NOT NULL,
            observacao TEXT,
            data TEXT NOT NULL
        )
    `);
    await pool.query(`
    ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS modelo TEXT
`);

await pool.query(`
    ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS ano TEXT
`);

    console.log("Banco PostgreSQL conectado!");
}

iniciarBanco().catch(function (erro) {
    console.error("Erro ao iniciar banco:", erro);
});

module.exports = pool;