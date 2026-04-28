import katex from "katex";
import "katex/dist/katex.min.css";
import React from "react";

export default function MathView({ latex }: { latex: string }) {
  console.log("LATEX INPUT:", latex);

  if (!latex || typeof latex !== "string") return <div />;
  const match = latex.match(/\\boxed\{.*?\}/);

  const latexi = match ? match[0] : "";

  const html = katex.renderToString(latexi, {
    throwOnError: false,
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}