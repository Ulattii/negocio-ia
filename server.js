const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const arquivoLeads = path.join(__dirname, "leads.json");

// Permite receber dados em formato JSON
app.use(express.json());

// Entrega os arquivos do nosso site
app.use(express.static(path.join(__dirname, "public")));

function lerLeads() {

    const dados = fs.readFileSync(arquivoLeads, "utf8");

    return JSON.parse(dados);
}

function salvarLeads(leads) {

    fs.writeFileSync(
        arquivoLeads,
        JSON.stringify(leads, null, 2)
    );
}

// Retorna todos os leads
app.get("/api/leads", function (req, res) {

    const leads = lerLeads();

    res.json(leads);
});

// Recebe um novo lead
app.post("/api/leads", function (req, res) {

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

    const leads = lerLeads();

    novoLead.id = Date.now();
    novoLead.data = new Date().toISOString();
    novoLead.status = "Novo";

    leads.push(novoLead);

    salvarLeads(leads);

    res.status(201).json(novoLead);
});

// Apaga todos os leads
app.delete("/api/leads", function (req, res) {

    salvarLeads([]);

    res.json({
        mensagem: "Leads apagados"
    });
});
app.put("/api/leads/:id/status", function (req, res) {

    const id = Number(req.params.id);
    const novoStatus = req.body.status;

    const leads = lerLeads();

    const lead = leads.find(function (item) {
        return item.id === id;
    });

    if (!lead) {
        return res.status(404).json({
            erro: "Lead não encontrado"
        });
    }

    lead.status = novoStatus;

    salvarLeads(leads);

    res.json(lead);
});app.put("/api/leads/:id/observacao", function (req, res) {

    const id = Number(req.params.id);
    const novaObservacao = req.body.observacao;

    const leads = lerLeads();

    const lead = leads.find(function (item) {
        return item.id === id;
    });

    if (!lead) {
        return res.status(404).json({
            erro: "Lead não encontrado"
        });
    }

    lead.observacao = novaObservacao;

    salvarLeads(leads);

    res.json(lead);
});
app.listen(PORT, function () {

    console.log("Servidor funcionando!");
    console.log("Abra: http://localhost:" + PORT);
});