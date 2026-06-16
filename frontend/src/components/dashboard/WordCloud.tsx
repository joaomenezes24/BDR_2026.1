"use client";

import { useEffect, useState } from "react";

import {
  analyticsService
} from "@/src/services/analyticsService";

export default function WordCloud() {

  const [words, setWords] =
    useState<any[]>([]);

  useEffect(() => {

    analyticsService
      .getWordCloud()
      .then(setWords);

  }, []);

  return (

    <>
      <h2>Nuvem de Palavras</h2>

      <div>

        {words.map(word => (

          <span
            key={word.text}
            style={{
              fontSize:
                `${12 + word.value / 300}px`,
              marginRight: "10px"
            }}
          >
            {word.text}
          </span>

        ))}

      </div>

    </>
  );
}