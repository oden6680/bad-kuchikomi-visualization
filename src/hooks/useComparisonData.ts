import { useState, useEffect } from "react";
import { loadSentimentAnalysisData, type SentimentAnalysis } from "../utils/utils";

interface UseComparisonDataResult {
  loading: boolean;
  error: string | null;
  sentimentData: SentimentAnalysis[];
  getSentimentDataByName: (name: string) => SentimentAnalysis | undefined;
  normalizeScore: (score: number) => number;
}

export const useComparisonData = (): UseComparisonDataResult => {
  const [loading, setLoading] = useState(true);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        setLoading(true);
        const data = await loadSentimentAnalysisData();
        setSentimentData(data);
      } catch (err) {
        console.error("感情分析データ読み込みエラー:", err);
        setError("感情分析データの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, []);

  const getSentimentDataByName = (name: string): SentimentAnalysis | undefined => {
    return sentimentData.find((item) => item.university_name === name);
  };

  const normalizeScore = (score: number): number => {
    if (sentimentData.length === 0) return 0;

    const maxScore = Math.max(...sentimentData.map((r) => r.negative_score));
    const minScore = Math.min(...sentimentData.map((r) => r.negative_score));

    if (maxScore === minScore) return 50;

    const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;

    if (isNaN(normalizedScore)) {
      console.warn("正規化スコアがNaNです:", { score, minScore, maxScore });
      return 0;
    }

    return Math.round(normalizedScore);
  };

  return {
    loading,
    error,
    sentimentData,
    getSentimentDataByName,
    normalizeScore,
  };
};
