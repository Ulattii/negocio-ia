const campoSenha = document.getElementById("senha");
const botaoEntrar = document.getElementById("entrar");
const mensagemErro = document.getElementById("erro");

botaoEntrar.addEventListener("click", fazerLogin);

campoSenha.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        fazerLogin();
    }

});

function fazerLogin() {

    const senha = campoSenha.value;

    fetch("/api/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            senha: senha
        })

    })
    .then(function (resposta) {

        if (!resposta.ok) {
            throw new Error("Senha incorreta");
        }

        return resposta.json();

    })
    .then(function () {

        localStorage.setItem("logado", "sim");

        window.location.href = "/leads.html";

    })
    .catch(function () {

        mensagemErro.textContent =
            "Senha incorreta.";

    });
}