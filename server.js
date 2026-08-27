const express = require("express");
const path = require("path");
const db = require("./database");
const session = require("express-session");

const app = express();

const PORT = process.env.PORT || 3000;



// Permite receber dados em formato JSON
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "segredo-local",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 8
    }
}));

// Entrega os arquivos do nosso site
app.use(express.static(path.join(__dirname, "public")));


// Retorna todos os leads
function exigirLogin(req, res, next) {

    if (req.session.logado) {
        return next();
    }

    res.status(401).json({
        erro: "Não autorizado"
    });
}
app.get("/api/leads", exigirLogin, async function (req, res) {

    try {

        const resultado = await db.query(
            "SELECT * FROM leads ORDER BY id DESC"
        );

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar leads"
        });
    }

});

// Recebe um novo lead
app.post("/api/leads", async function (req, res) {

    const novoLead = req.body;

    if (
        !novoLead.nome ||
        !novoLead.whatsapp ||
        !novoLead.interesse
    ) {
        return res.status(400).json({
            erro: "Dados incompletos"
        });
    }

    const status = "Novo";
    const observacao = "";
    const data = new Date().toISOString();

    try {

        const resultado = await db.query(
            `
            INSERT INTO leads
            (nome, whatsapp, interesse, status, observacao, data)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                novoLead.nome,
                novoLead.whatsapp,
                novoLead.interesse,
                status,
                observacao,
                data
            ]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao salvar lead"
        });
    }

});

// Apaga todos os leads
app.delete("/api/leads", exigirLogin, async function (req, res) {

    try {

        await db.query("DELETE FROM leads");

        res.json({
            mensagem: "Leads apagados"
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao apagar leads"
        });
    }

});
app.put("/api/leads/:id/status", exigirLogin, async function (req, res) {

    const id = Number(req.params.id);
    const novoStatus = req.body.status;

    try {

        const resultado = await db.query(
            `
            UPDATE leads
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
            [novoStatus, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Lead não encontrado"
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao atualizar status"
        });
    }

});
app.put("/api/leads/:id/observacao", exigirLogin, async function (req, res) {

    const id = Number(req.params.id);
    const novaObservacao = req.body.observacao;

    try {

        const resultado = await db.query(
            `
            UPDATE leads
            SET observacao = $1
            WHERE id = $2
            RETURNING *
            `,
            [novaObservacao, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Lead não encontrado"
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao atualizar observação"
        });
    }

});
app.post("/api/login", function (req, res) {

    const senha = req.body.senha;

    if (senha === process.env.PAINEL_SENHA) {

        req.session.logado = true;

        return res.json({
            sucesso: true
        });
    }

    res.status(401).json({
        erro: "Senha incorreta"
    });

});
app.post("/api/logout", function (req, res) {

    req.session.destroy(function () {

        res.json({
            sucesso: true
        });

    });

});
app.listen(PORT, function () {

    console.log("Servidor funcionando!");
    console.log("Abra: http://localhost:" + PORT);
});