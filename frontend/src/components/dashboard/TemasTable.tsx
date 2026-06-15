"use client";

import { useEffect, useState } from "react";

import {
  analyticsService
} from "@/src/services/analyticsService";

export default function TemasTable() {

  const [temas, setTemas] =
    useState<any[]>([]);

  useEffect(() => {

    analyticsService
      .getTemas()
      .then(setTemas);

  }, []);

  return (

    <>
      <h2>Temas</h2>

      <table>

        <thead>
          <tr>
            <th>Tema</th>
            <th>Quantidade</th>
          </tr>
        </thead>

        <tbody>

          {temas.map(tema => (

            <tr key={tema.tema}>
              <td>{tema.tema}</td>
              <td>{tema.qtd_total}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </>
  );
}