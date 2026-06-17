"use client";

import { useEffect, useState } from "react";

import { gastosService } from "@/src/services/gastosServices";

export default function Gastos() {

  const [ranking, setRanking] =
    useState<any[]>([]);

  const [despesas, setDespesas] =
    useState<any[]>([]);

  const [deputadoSelecionado,
    setDeputadoSelecionado] =
    useState<string>("");

  useEffect(() => {

    gastosService
      .getRanking()
      .then(setRanking);

  }, []);

  async function selecionarDeputado(
    deputado: any
  ) {

    setDeputadoSelecionado(
      deputado.deputado
    );

    const dados =
      await gastosService
        .getDespesasDeputado(
          deputado.deputado_id
        );

    setDespesas(dados);
  }

  return (

    <div>

      <h1>Ranking de Gastos</h1>

      <table>

        <thead>
          <tr>
            <th>Deputado</th>
            <th>Partido</th>
            <th>UF</th>
            <th>Total Gasto</th>
          </tr>
        </thead>

        <tbody>

          {ranking.map(dep => (

            <tr
              key={dep.deputado_id}
              onClick={() =>
                selecionarDeputado(dep)
              }
              style={{
                cursor: "pointer"
              }}
            >

              <td>{dep.deputado}</td>

              <td>{dep.partido}</td>

              <td>{dep.uf}</td>

              <td>
                R$ {
                  Number(
                    dep.total_gasto
                  ).toLocaleString(
                    "pt-BR",
                    {
                      minimumFractionDigits: 2
                    }
                  )
                }
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {despesas.length > 0 && (

        <div
          style={{
            marginTop: "2rem"
          }}
        >

          <h2>
            Despesas de {
              deputadoSelecionado
            }
          </h2>

          <table>

            <thead>
              <tr>
                <th>Categoria</th>
                <th>Valor Total</th>
                <th>Quantidade</th>
              </tr>
            </thead>

            <tbody>

              {despesas.map(
                (despesa, index) => (

                <tr key={index}>

                  <td>
                    {despesa.categoria}
                  </td>

                  <td>
                    R$ {
                      Number(
                        despesa.valor_total
                      ).toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2
                        }
                      )
                    }
                  </td>

                  <td>
                    {despesa.quantidade}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}