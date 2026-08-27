const leadsDemo = [
    {
        id: 1,
        nome: "Carlos",
        whatsapp: "51999998888",
        interesse: "Troca de óleo",
        modelo: "Onix",
        ano: "2020",
        status: "Novo",
        observacao: "",
        data: new Date().toISOString()
    },
    {
        id: 2,
        nome: "Mariana",
        whatsapp: "51988887777",
        interesse: "Revisão",
        modelo: "T-Cross",
        ano: "2021",
        status: "Em atendimento",
        observacao: "Cliente pediu retorno à tarde",
        data: new Date().toISOString()
    },
    {
        id: 3,
        nome: "João",
        whatsapp: "51977776666",
        interesse: "Freios",
        modelo: "Gol",
        ano: "2018",
        status: "Venda fechada",
        observacao: "Serviço agendado",
        data: new Date().toISOString()
    }
];

let filtroAtual = "Todos";
let textoBusca = "";

const listaLeads = document.getElementById("lista-leads");
const botoesFiltro = document.querySelectorAll(".filtro");
const campoBusca = document.getElementById("campo-busca");

function carregarLeads() {

    const leadsFiltrados = leadsDemo.filter(function (lead) {

        const passaStatus =
            filtroAtual === "Todos" ||
            lead.status === filtroAtual;

        const texto = textoBusca.toLowerCase();

        const passaBusca =
            lead.nome.toLowerCase().includes(texto) ||
            lead.whatsapp.includes(texto) ||
            lead.interesse.toLowerCase().includes(texto) ||
            lead.modelo.toLowerCase().includes(texto);

        return passaStatus && passaBusca;
    });

    listaLeads.innerHTML = "";

    leadsFiltrados.forEach(function (lead) {

        const numeroWhatsApp = "55" + lead.whatsapp;

        const mensagemWhatsApp =
            `Olá, ${lead.nome}! Vi que você pediu orçamento para ${lead.interesse} no ${lead.modelo} ${lead.ano}. Como posso te ajudar?`;

        const mensagemCodificada =
            encodeURIComponent(mensagemWhatsApp);

        listaLeads.innerHTML += `
            <tr>
                <td>${lead.nome}</td>
                <td>${lead.whatsapp}</td>
                <td>${lead.interesse}</td>
                <td>${lead.modelo}</td>
                <td>${lead.ano}</td>
                <td>${new Date(lead.data).toLocaleString("pt-BR")}</td>

                <td>
                    <select class="status-demo" data-id="${lead.id}">
                        <option ${lead.status === "Novo" ? "selected" : ""}>Novo</option>
                        <option ${lead.status === "Em atendimento" ? "selected" : ""}>Em atendimento</option>
                        <option ${lead.status === "Venda fechada" ? "selected" : ""}>Venda fechada</option>
                        <option ${lead.status === "Perdido" ? "selected" : ""}>Perdido</option>
                    </select>
                </td>

                <td>
                    <input
                        class="observacao"
                        value="${lead.observacao}"
                        data-id="${lead.id}"
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

    atualizarContadores();
    ativarEventos();
}

function atualizarContadores() {

    document.getElementById("total-novos").textContent =
        leadsDemo.filter(l => l.status === "Novo").length;

    document.getElementById("total-atendimento").textContent =
        leadsDemo.filter(l => l.status === "Em atendimento").length;

    document.getElementById("total-vendas").textContent =
        leadsDemo.filter(l => l.status === "Venda fechada").length;

    document.getElementById("total-perdidos").textContent =
        leadsDemo.filter(l => l.status === "Perdido").length;
}

function ativarEventos() {

    document.querySelectorAll(".status-demo").forEach(function (campo) {

        campo.addEventListener("change", function () {

            const lead = leadsDemo.find(
                item => item.id == campo.dataset.id
            );

            lead.status = campo.value;

            carregarLeads();
        });
    });

    document.querySelectorAll(".observacao").forEach(function (campo) {

        campo.addEventListener("change", function () {

            const lead = leadsDemo.find(
                item => item.id == campo.dataset.id
            );

            lead.observacao = campo.value;
        });
    });
}

botoesFiltro.forEach(function (botao) {

    botao.addEventListener("click", function () {

        filtroAtual = botao.dataset.status;

        botoesFiltro.forEach(item =>
            item.classList.remove("ativo")
        );

        botao.classList.add("ativo");

        carregarLeads();
    });
});

campoBusca.addEventListener("input", function () {
    textoBusca = campoBusca.value;
    carregarLeads();
});

carregarLeads();