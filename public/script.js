const campoMensagem = document.getElementById("mensagem");
const botaoEnviar = document.getElementById("enviar");
const conversa = document.getElementById("conversa");

let etapa = "inicio";

let lead = {
    nome: "",
    whatsapp: "",
    interesse: ""
};

botaoEnviar.addEventListener("click", enviarMensagem);

campoMensagem.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        enviarMensagem();
    }
});

function enviarMensagem() {

    const mensagem = campoMensagem.value.trim();

    if (mensagem === "") {
        return;
    }

    adicionarMensagem("Você", mensagem);

    const texto = mensagem.toLowerCase();

    let resposta = "";

    // Cliente está informando qual serviço deseja
    if (etapa === "aguardando_servico") {

        lead.interesse = mensagem;

        etapa = "aguardando_nome";

        resposta =
            "Perfeito! Para preparar seu atendimento, qual é o seu nome?";

    }

    // Cliente está informando o nome
    else if (etapa === "aguardando_nome") {

        lead.nome = mensagem;

        etapa = "aguardando_whatsapp";

        resposta =
            "Prazer, " + lead.nome + "! Qual é o seu WhatsApp com DDD?";

    }

    // Cliente está informando o WhatsApp
    else if (etapa === "aguardando_whatsapp") {

        const numero = mensagem.replace(/\D/g, "");

        if (numero.length < 10) {

            resposta =
                "Esse número parece estar incompleto. Digite seu WhatsApp com DDD.";

        } else {

            lead.whatsapp = mensagem;

            salvarLead();

            resposta =
                "Perfeito, " + lead.nome +
                "! ✅ Seus dados foram registrados. Um atendente poderá entrar em contato com você.";

            etapa = "inicio";

            lead = {
                nome: "",
                whatsapp: "",
                interesse: ""
            };
        }

    }

    // Conversa normal
    else if (
        texto.includes("orçamento") ||
        texto.includes("orcamento")
    ) {

        etapa = "aguardando_servico";

        resposta =
    "Claro! 🚗 Qual serviço você precisa? Por exemplo: revisão, troca de óleo, freios, pneus ou outro problema.";

    }

    else if (
        texto.includes("preço") ||
        texto.includes("preco") ||
        texto.includes("valor")
    ) {

        resposta =
            "Os valores dependem do serviço. Se quiser, escreva 'orçamento' e eu posso registrar sua solicitação.";

    }

    else if (
        texto.includes("atendente") ||
        texto.includes("pessoa")
    ) {

        lead.interesse = "Falar com atendente";

        etapa = "aguardando_nome";

        resposta =
            "Claro! Vou registrar seus dados para um atendente. Qual é o seu nome?";

    }

    else if (
        texto.includes("oi") ||
        texto.includes("olá") ||
        texto.includes("ola")
    ) {

        resposta =
            "Olá! 👋 Posso ajudar com preços, orçamento ou encaminhar você para um atendente.";

    }

    else {

        resposta =
            "Entendi. Você pode escrever 'orçamento', 'preço' ou 'atendente' para eu ajudar melhor.";

    }

    adicionarMensagem("Assistente", resposta);

    campoMensagem.value = "";

    conversa.scrollTop = conversa.scrollHeight;
}

function adicionarMensagem(pessoa, mensagem) {

    conversa.innerHTML +=
        "<p><strong>" + pessoa + ":</strong> " + mensagem + "</p>";
}

function salvarLead() {

    fetch("/api/leads", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(lead)

    })
    .then(function (resposta) {

        return resposta.json();

    })
    .then(function (dados) {

        console.log("Lead salvo no servidor:", dados);

    })
    .catch(function (erro) {

        console.error("Erro ao salvar lead:", erro);

    });
}