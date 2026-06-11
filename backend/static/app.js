const API = "";

async function carregarOverview(){

    const response =
        await fetch("/analytics/overview");

    const data =
        await response.json();

    document.getElementById("totalDeputados")
        .textContent = data.total_deputados;

    document.getElementById("totalDespesas")
        .textContent = data.total_despesas;

    document.getElementById("totalProposicoes")
        .textContent = data.total_proposicoes;

    document.getElementById("totalVotacoes")
        .textContent = data.total_votacoes;
}

async function carregarTemas(){

    const response =
        await fetch("/analytics/temas");

    const temas =
        await response.json();

    const tbody =
        document.getElementById("temasBody");

    temas.slice(0,20).forEach(tema => {

        tbody.innerHTML += `
            <tr>
                <td>${tema.tema}</td>
                <td>${tema.qtd_total}</td>
            </tr>
        `;
    });
}

async function carregarWordCloud(){

    const response =
        await fetch("/analytics/wordcloud");

    const dados =
        await response.json();

    const container =
        document.getElementById("wordcloud");

    dados.forEach(item => {

        const span =
            document.createElement("span");

        span.className = "word";

        span.style.fontSize =
            `${10 + item.value / 50}px`;

        span.textContent =
            item.text;

        container.appendChild(span);
    });
}

async function carregarEscolaridade(){

    const response =
        await fetch("/analytics/escolaridade");

    const dados =
        await response.json();

    const tbody =
        document.getElementById("escolaridadeBody");

    dados.forEach(item => {

        tbody.innerHTML += `
            <tr>
                <td>${item.escolaridade}</td>
                <td>${item.qtd_total}</td>
            </tr>
        `;
    });
}

async function carregarCategorias(){

    const response =
        await fetch("/gastos/categorias");

    const dados =
        await response.json();

    const tbody =
        document.getElementById("categoriasBody");

    dados.slice(0,20).forEach(item => {

        tbody.innerHTML += `
            <tr>
                <td>${item.categoria}</td>
                <td>R$ ${item.valor_total_gasto.toLocaleString()}</td>
                <td>${item.qtd_total}</td>
            </tr>
        `;
    });
}

async function carregarDeputados(){

    const response =
        await fetch("/deputados");

    const deputados =
        await response.json();

    const tbody =
        document.getElementById("deputadosBody");

    deputados.slice(0,50).forEach(dep => {

        tbody.innerHTML += `
            <tr>
                <td>${dep.nome}</td>
                <td>${dep.siglapartido}</td>
                <td>${dep.siglauf}</td>
                <td>${dep.sexo}</td>
            </tr>
        `;
    });
}

carregarOverview();
carregarTemas();
carregarWordCloud();
carregarEscolaridade();
carregarCategorias();
carregarDeputados();