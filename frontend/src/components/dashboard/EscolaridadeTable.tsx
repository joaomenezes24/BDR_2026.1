"use client";

import { useEffect, useState } from "react";

import {
  analyticsService
} from "@/src/services/analyticsService";

export default function EscolaridadeTable() {

  const [dados, setDados] =
    useState<any[]>([]);

  useEffect(() => {

    analyticsService
      .getEscolaridade()
      .then(setDados);

  }, []);

  return (

    <>
      <h2>Escolaridade</h2>

      <table>

        <thead>
          <tr>
            <th>Escolaridade</th>
            <th>Quantidade</th>
          </tr>
        </thead>

        <tbody>

          {dados.map(item => (

            <tr
              key={item.escolaridade}
            >
              <td>
                {item.escolaridade}
              </td>

              <td>
                {item.qtd_total}
              </td>
            </tr>

          ))}

        </tbody>

      </table>

    </>
  );
}