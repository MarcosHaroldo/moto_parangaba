
const formulario = document.getElementById("formFrete");

const campoCep = document.getElementById("cep");

const carregando = document.getElementById("carregando");

const resultado = document.getElementById("resultado");

const erro = document.getElementById("erro");


// Valor ilustrativo por quilômetro para a simulação
const valorPorKm = 2.50;


// Coordenadas aproximadas da UNINASSAU Parangaba, Fortaleza.
const origem = {
    latitude: -3.77709,
    longitude: -38.56201
};


// Formata o CEP
campoCep.addEventListener("input", function () {

    let cep = campoCep.value.replace(/\D/g, "");

    if (cep.length > 5) {

        cep =
            cep.substring(0, 5) +
            "-" +
            cep.substring(5, 8);

    }

    campoCep.value = cep;

});


// Quando o formulário for enviado
formulario.addEventListener("submit", async function (event) {

    event.preventDefault();


    const cep = campoCep.value.replace(/\D/g, "");


    // Verifica se o CEP possui 8 números
    if (cep.length !== 8) {

        mostrarErro("Digite um CEP válido.");

        return;
    }


    esconderMensagens();

    carregando.style.display = "block";


    try {

        // CONSULTA O VIACEP
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );


        if (!resposta.ok) {

            throw new Error("Erro ao consultar o CEP.");

        }


        const endereco = await resposta.json();


        // Verifica se o CEP existe
        if (endereco.erro) {

            throw new Error("CEP não encontrado.");

        }


        // Mostra o endereço
        document.getElementById("resultadoCep").textContent =
            endereco.cep;

        document.getElementById("resultadoRua").textContent =
            endereco.logradouro || "Não informado";

        document.getElementById("resultadoBairro").textContent =
            endereco.bairro || "Não informado";

        document.getElementById("resultadoCidade").textContent =
            endereco.localidade;

        document.getElementById("resultadoEstado").textContent =
            endereco.uf;


        /*
            Para calcular a distância real seria necessário
            transformar o endereço em coordenadas.

            Neste exemplo utilizamos uma estimativa baseada
            na cidade/CEP para manter o projeto simples.

            A função abaixo gera uma distância aproximada
            para demonstração acadêmica.
        */

        const distancia = calcularDistanciaEstimada(
            cep,
            endereco
        );


        const frete = distancia * valorPorKm;


        document.getElementById("distancia").textContent =
            distancia.toFixed(1) + " km";


        document.getElementById("valorKm").textContent =
            formatarMoeda(valorPorKm);


        document.getElementById("valorFrete").textContent =
            formatarMoeda(frete);


        resultado.style.display = "block";


    } catch (error) {

        mostrarErro(error.message);

    } finally {

        carregando.style.display = "none";

    }

});


// Calcula uma distância estimada
function calcularDistanciaEstimada(cep, endereco) {

    /*
        Valor demonstrativo para o projeto.

        Para utilizar distância real, substitua essa função
        por uma chamada ao OpenRouteService.

        O OpenRouteService possui serviços de geocodificação
        e cálculo de distância/rota.
    */

    const primeirosNumeros = parseInt(
        cep.substring(0, 3)
    );


    let distancia;


    if (endereco.localidade.toLowerCase() === "fortaleza") {

        distancia =
            2 + (primeirosNumeros % 30);

    } else {

        distancia =
            20 + (primeirosNumeros % 80);

    }


    return distancia;

}


// Formata valores em reais
function formatarMoeda(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// Mostra mensagem de erro
function mostrarErro(mensagem) {

    erro.textContent = mensagem;

    erro.style.display = "block";

    resultado.style.display = "none";

}


// Esconde mensagens
function esconderMensagens() {

    erro.style.display = "none";

    resultado.style.display = "none";

}
