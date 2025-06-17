import type { RatingCount } from "./utils";

export const getNegativeScoreColor = (
  score: number, 
  thresholds?: { low: number; medium: number }
): "success" | "warning" | "error" | "default" => {
  const lowThreshold = thresholds?.low ?? 0.3;
  const mediumThreshold = thresholds?.medium ?? 0.6;
  
  if (score <= lowThreshold) return "success";
  if (score <= mediumThreshold) return "warning";
  return "error";
};

export const getNegativeScoreLabel = (
  score: number, 
  thresholds?: { low: number; medium: number }
): string => {
  const lowThreshold = thresholds?.low ?? 0.3;
  const mediumThreshold = thresholds?.medium ?? 0.6;
  
  if (score <= lowThreshold) return "低";
  if (score <= mediumThreshold) return "中";
  return "高";
};

export const getRatingColor = (rating: string): "success" | "warning" | "error" | "default" => {
  switch (rating) {
    case "良い":
      return "success";
    case "普通":
      return "warning";
    case "悪い":
      return "error";
    default:
      return "default";
  }
};

export const normalizeScore = (score: number, maxScore: number, minScore: number): number => {
  if (maxScore === minScore) return 50;
  
  const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
  
  if (isNaN(normalizedScore)) {
    console.warn('正規化スコアがNaNです:', { score, minScore, maxScore });
    return 0;
  }
  
  return Math.round(normalizedScore);
};

export const getSentimentColor = (sentiment: string | undefined, score?: number): string => {
  if (!sentiment || score === undefined) {
    return "#9e9e9e";
  }
  
  const amplifiedScore = Math.min(1, Math.abs(score) * 2);
  
  if (sentiment === "negative") {
    const intensity = Math.max(100, Math.min(255, Math.round(amplifiedScore * 255)));
    return `rgb(0, ${Math.round(intensity/3)}, ${intensity})`;
  } else if (sentiment === "positive") {
    const intensity = Math.max(100, Math.min(255, Math.round(amplifiedScore * 255)));
    return `rgb(${intensity}, ${Math.round(intensity/5)}, 0)`;
  } else {
    return `rgb(0, 150, 0)`;
  }
};

export const getRatingDataArray = (
  summary: { averageRatings: Record<string, RatingCount> } | null, 
  categories: readonly string[]
): RatingCount[] => {
  if (!summary) return [];
  return categories.map((category) => summary.averageRatings[category]);
};
