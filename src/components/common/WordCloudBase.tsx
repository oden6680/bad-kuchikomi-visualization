import { useEffect, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { scaleLog } from "d3-scale";
import { select } from "d3-selection";
import cloud from "d3-cloud";
import type { Word } from "d3-cloud";
import type { SentimentAnalysis } from "../../utils/utils";
import { getSentimentColor } from "../../utils/formatUtils";

interface WordData {
  text: string;
  value: number;
  size?: number;
  rotate?: number;
  x?: number;
  y?: number;
  color?: string;
  sentiment?: "positive" | "negative" | "neutral";
  sentiment_score?: number;
}

interface WordCloudBaseProps {
  sentimentData: SentimentAnalysis | null;
  maxWords?: number;
  width?: number | string;
  height?: number | string;
  onWordCloudReady?: () => void;
}

const WordCloudBase = ({
  sentimentData,
  maxWords = 100,
  width = "100%",
  height = 300,
  onWordCloudReady,
}: WordCloudBaseProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!sentimentData || !sentimentData.word_info || !svgRef.current) return;
    select(svgRef.current).selectAll("*").remove();
    const svg = select(svgRef.current);
    const svgWidth = svgRef.current.clientWidth;
    const svgHeight = svgRef.current.clientHeight;

    const { word_info } = sentimentData;

    const words: WordData[] = Object.entries(word_info)
      .map(([text, info]) => ({
        text,
        value: info.count,
        sentiment: info.sentiment,
        sentiment_score: info.sentiment_score,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, maxWords);

    const maxValue = Math.max(...words.map((d) => d.value));
    const minValue = Math.min(...words.map((d) => d.value));

    const fontSize = scaleLog()
      .domain([Math.max(minValue, 1), Math.max(maxValue, 2)])
      .range([15, 50]);

    const layout = cloud()
      .size([svgWidth, svgHeight])
      .words(words.map((w) => ({ ...w })) as Word[])
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 2) * 90))
      .fontSize((d) => fontSize((d as unknown as WordData).value))
      .on("end", (cloudWords: Word[]) => {
        draw(
          cloudWords.map((w) => {
            const originalWord = words.find((original) => original.text === w.text);

            return {
              text: w.text || "",
              value: originalWord?.value || 0,
              size: w.size,
              rotate: w.rotate,
              x: w.x,
              y: w.y,
              sentiment: originalWord?.sentiment,
              sentiment_score: originalWord?.sentiment_score,
            };
          })
        );

        if (onWordCloudReady) {
          onWordCloudReady();
        }
      });

    const draw = (words: WordData[]) => {
      svg
        .append("g")
        .attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d: WordData) => `${d.size}px`)
        .style("font-family", "Impact")
        .style("fill", (d: WordData) => getSentimentColor(d.sentiment, d.sentiment_score))
        .attr("text-anchor", "middle")
        .attr("transform", (d: WordData) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text((d: WordData) => d.text)
        .on("mouseover", function (this: SVGTextElement) {
          select(this)
            .style("font-size", (d: unknown) => `${((d as WordData).size || 0) * 1.2}px`)
            .style("cursor", "pointer");
        })
        .on("mouseout", function (this: SVGTextElement) {
          select(this).style("font-size", (d: unknown) => `${(d as WordData).size}px`);
        })
        .append("title")
        .text((d: WordData) => {
          const sentimentText = d.sentiment
            ? `（感情: ${
                d.sentiment === "positive" ? "ポジティブ" : d.sentiment === "negative" ? "ネガティブ" : "中立"
              }）`
            : "";
          return `${d.text}: ${d.value}回 ${sentimentText}`;
        });
    };
    
    layout.start();
  }, [sentimentData, maxWords, onWordCloudReady]);

  if (!sentimentData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!sentimentData.word_info || Object.keys(sentimentData.word_info).length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width,
          height,
          backgroundColor: "#f9f9f9",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">単語データがありません</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width,
        height,
        backgroundColor: "#f9f9f9",
        borderRadius: 1,
        padding: 2,
        overflow: "hidden",
      }}
    >
      <svg ref={svgRef} width="100%" height="100%" style={{ display: "block" }} />
    </Box>
  );
};

export default WordCloudBase;
