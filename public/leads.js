
const botaoSair = document.getElementById("sair");
const listaLeads = document.getElementById("lista-leads");
const botaoLimpar = document.getElementById("limpar");
const totalNovos = document.getElementById("total-novos");
const totalAtendimento = document.getElementById("total-atendimento");
const totalVendas = document.getElementById("total-vendas");
const totalPerdidos = document.getElementById("total-perdidos");
const botoesFiltro = document.querySelectorAll(".filtro");
const campoBusca = document.getElementById("campo-busca");

let textoBusca = "";

let filtroAtual = "Todos";

function carregarLeads() {

    fetch("/api/leads")

    .then(function (resposta) {

        if (resposta.status === 401) {
            window.location.href = "/login.html";
            throw new Error("Não autorizado");
        }

        return resposta.json();
    })

        .then(function (leads) {

            listaLeads.innerHTML = "";
            let novos = 0;
let emAtendimento = 0;
let vendasFechadas = 0;
let perdidos = 0;

            if (leads.length === 0) {

                listaLeads.innerHTML = `
                    <tr>
                        <td colspan="5">
                            Nenhum lead registrado.
                        </td>
                    </tr>
                `;

                return;
            }
const leadsFiltrados = leads.filter(function (lead) {

    const passaFiltroStatus =
        filtroAtual === "Todos" ||
        lead.status === filtroAtual;

    const texto = textoBusca.toLowerCase();

    const passaBusca =
        lead.nome.toLowerCase().includes(texto) ||
        lead.whatsapp.toLowerCase().includes(texto) ||
        lead.interesse.toLowerCase().includes(texto);

    return passaFiltroStatus && passaBusca;
});
            leadsFiltrados.forEach(function (lead) {
if (lead.status === "Novo") {
    novos++;
}

else if (lead.status === "Em atendimento") {
    emAtendimento++;
}

else if (lead.status === "Venda fechada") {
    vendasFechadas++;
}

else if (lead.status === "Perdido") {
    perdidos++;
}
                const numeroLimpo =
                    lead.whatsapp.replace(/\D/g, "");

                let numeroWhatsApp = numeroLimpo;

                if (
                    numeroLimpo.length === 10 ||
                    numeroLimpo.length === 11
                ) {
                    numeroWhatsApp = "55" + numeroLimpo;
                }

                const data = lead.data
                    ? new Date(lead.data).toLocaleString("pt-BR")
                    : "Sem data";

                    const mensagemWhatsApp =
    `Olá, ${lead.nome}! Vi que você pediu orçamento para ${lead.interesse}` +
    `${lead.modelo ? " no " + lead.modelo : ""}` +
    `${lead.ano ? " " + lead.ano : ""}. Como posso te ajudar?`;

const mensagemCodificada = encodeURIComponent(mensagemWhatsApp);

                listaLeads.innerHTML += `
    <tr>
        <td>${lead.nome}</td>

        <td>${lead.whatsapp}</td>

        <td>${lead.interesse}</td>

        <td>${lead.modelo || "-"}</td>

        <td>${lead.ano || "-"}</td>

        <td>${data}</td>

        <td>
            <select
                class="status"
                data-id="${lead.id}"
            >
                <option value="Novo" ${lead.status === "Novo" ? "selected" : ""}>
                    Novo
                </option>

                <option value="Em atendimento" ${lead.status === "Em atendimento" ? "selected" : ""}>
                    Em atendimento
                </option>

                <option value="Venda fechada" ${lead.status === "Venda fechada" ? "selected" : ""}>
                    Venda fechada
                </option>

                <option value="Perdido" ${lead.status === "Perdido" ? "selected" : ""}>
                    Perdido
                </option>
            </select>
        </td>
<td>
    <input
        type="text"
        class="observacao"
        data-id="${lead.id}"
        value="${lead.observacao || ""}"
        placeholder="Adicionar observação..."
    >
</td>
        <td>
            <a
                class="whatsapp"
                href="https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}"
                target="_blank"
            >
                Chamar no WhatsApp
            </a>
        </td>
    </tr>
`;
            });
            totalNovos.textContent = novos;
totalAtendimento.textContent = emAtendimento;
totalVendas.textContent = vendasFechadas;
totalPerdidos.textContent = perdidos;
            const seletoresStatus = document.querySelectorAll(".status");

seletoresStatus.forEach(function (seletor) {

    seletor.addEventListener("change", function () {

        const id = seletor.dataset.id;
        const status = seletor.value;

        fetch("/api/leads/" + id + "/status", {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })

        })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {
            console.log("Status atualizado:", dados);
            carregarLeads();
        })
        .catch(function (erro) {
            console.error("Erro ao atualizar status:", erro);
        });

    });

});
const camposObservacao = document.querySelectorAll(".observacao");

camposObservacao.forEach(function (campo) {

    campo.addEventListener("change", function () {

        const id = campo.dataset.id;
        const observacao = campo.value;

        fetch("/api/leads/" + id + "/observacao", {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                observacao: observacao
            })

        })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {

    console.log("Observação salva:", dados);

    campo.classList.add("salvo");

    setTimeout(function () {
        campo.classList.remove("salvo");
    }, 1500);

})
        .catch(function (erro) {
            console.error("Erro ao salvar observação:", erro);
        });

    });

});
        })

        .catch(function (erro) {

            console.error(
                "Erro ao carregar leads:",
                erro
            );

        });
}

botaoLimpar.addEventListener("click", function () {

    const confirmar = confirm(
        "Tem certeza que deseja apagar todos os leads?"
    );

    if (!confirmar) {
        return;
    }

    fetch("/api/leads", {
        method: "DELETE"
    })

    .then(function () {
        carregarLeads();
    })

    .catch(function (erro) {

        console.error(
            "Erro ao apagar leads:",
            erro
        );

    });
});
botoesFiltro.forEach(function (botao) {

    botao.addEventListener("click", function () {

        filtroAtual = botao.dataset.status;

        botoesFiltro.forEach(function (item) {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        carregarLeads();
    });

});
campoBusca.addEventListener("input", function () {

    textoBusca = campoBusca.value;

    carregarLeads();
});
botaoSair.addEventListener("click", function () {

    fetch("/api/logout", {
        method: "POST"
    })
    .then(function () {
        window.location.href = "/login.html";
    });

});
carregarLeads();