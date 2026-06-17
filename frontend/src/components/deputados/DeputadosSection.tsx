"use client";

import { useEffect, useState } from "react";

import {
  deputadosService
} from "@/src/services/deputadosService";

import {
  DeputadoResumo,
  DeputadoDetalhes
} from "@/src/types/deputados";

export default function Deputados() {
const [busca, setBusca] = useState("");

const [sortField, setSortField] =
  useState<keyof DeputadoResumo>("nome");

const [sortDirection, setSortDirection] =
  useState<"asc" | "desc">("asc");
  const [deputados, setDeputados] =
    useState<DeputadoResumo[]>([]);

  const [selecionado, setSelecionado] =
    useState<DeputadoDetalhes | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [loadingPerfil,
    setLoadingPerfil] =
    useState(false);

  useEffect(() => {

    deputadosService
      .getDeputados()
      .then(setDeputados)
      .finally(() =>
        setLoading(false)
      );

  }, []);

  async function abrirDeputado(
    deputadoId: number
  ) {

    setLoadingPerfil(true);

    try {

      const dados =
        await deputadosService
          .getDeputado(
            deputadoId
          );

      setSelecionado(dados);

    } finally {

      setLoadingPerfil(false);

    }
  }

  if (loading) {
    return (
      <p>
        Carregando deputados...
      </p>
    );
  }

  return (

    <div className="deputados-container">

      <div className="deputados-lista">

        <h1>Deputados</h1>

        <table>

          <thead>
            <tr>
              <th>Nome</th>
              <th>Partido</th>
              <th>UF</th>
            </tr>
          </thead>

          <tbody>

            {deputados.map(dep => (

              <tr
                key={dep.deputado_id}
                onClick={() =>
                  abrirDeputado(dep.deputado_id)
                }
                className="deputado-row"
              >

                <td>{dep.nome}</td>
                <td>{dep.siglapartido}</td>
                <td>{dep.siglauf}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="deputado-detalhes">

        {!selecionado && (
          <p>
            Selecione um deputado.
          </p>
        )}

        {loadingPerfil && (
          <p>Carregando perfil...</p>
        )}

        {selecionado && (

          <>

            <h2>
              {selecionado.nome}
            </h2>

            <p>
              <strong>Partido:</strong>
              {" "}
              {selecionado.partido}
            </p>

            <p>
              <strong>UF:</strong>
              {" "}
              {selecionado.uf}
            </p>

            <p>
              <strong>Sexo:</strong>
              {" "}
              {selecionado.sexo}
            </p>

            <p>
              <strong>Escolaridade:</strong>
              {" "}
              {selecionado.escolaridade}
            </p>

            <p>
              <strong>Situação:</strong>
              {" "}
              {selecionado.situacao}
            </p>

            <p>
              <strong>Total gasto:</strong>
              {" "}
              R$ {
                selecionado.total_gasto.toLocaleString(
                  "pt-BR",
                  {
                    minimumFractionDigits: 2
                  }
                )
              }
            </p>

          </>

        )}

      </div>

    </div>

  );
}