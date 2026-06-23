# PROEZA - de Olho na Câmara

Aplicação web de análise de dados da Câmara dos Deputados desenvolvida para a disciplina de Banco de Dados Relacionais, 2026.1.

O projeto utiliza um banco SQLite previamente gerado a partir dos dados públicos da Câmara dos Deputados e disponibiliza consultas analíticas por meio de uma API REST desenvolvida com FastAPI, consumida por uma interface web em Next.js.

## Pré-requisitos

* Python 3.11+
* Node.js 20+
* npm
* SQLite (opcional, apenas para inspeção do banco)

## Configuração do Banco

O arquivo `camara.db` não é versionado no GitHub.

Ele deve estar disponível localmente na pasta:

```text
dados/camara.db
```

## Executando o Backend

Entre na pasta do backend:

```bash
cd backend
```

Crie um ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual:

### Linux/macOS

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

em caso de erro, considere:

```bash
python -m pip install -r requirements.txt
```

```bash
python -m pip install requests
```

Execute a API:

```bash
uvicorn app.main:app --reload
```

A API ficará disponível em:

```text
http://localhost:8000
```

Documentação automática:

```text
http://localhost:8000/docs
```

## Executando o Frontend

Abra outro terminal e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:3000
```

## Endpoints Disponíveis

### Analytics

```http
GET /analytics/overview
GET /analytics/temas
GET /analytics/escolaridade
GET /analytics/escolaridade-gastos
GET /analytics/wordcloud
```

### Gastos

```http
GET /gastos/ranking
GET /gastos/categorias
```

### Deputados

```http
GET /deputados
GET /deputados/{id}
GET /deputados/{id}/despesas
```

## Funcionalidades

* Dashboard geral da base de dados
* Ranking de deputados por gastos
* Gastos agrupados por categoria
* Temas mais frequentes das proposições
* Nuvem de palavras dos temas
* Distribuição da escolaridade dos deputados
* Relação entre escolaridade e média de gastos
* Perfil individual de deputados
* Detalhamento de gastos por deputado

## Tecnologias Utilizadas

### Backend

* FastAPI
* SQLite
* Pydantic
* Uvicorn

### Frontend

* Next.js
* React
* TypeScript

## Equipe

Projeto desenvolvido para a disciplina de Banco de Dados Relacionais.
