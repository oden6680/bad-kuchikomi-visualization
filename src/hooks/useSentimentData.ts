import { useState, useEffect } from "react";
import { loadSentimentAnalysisData, type SentimentAnalysis } from "../utils/utils";

interface UseSentimentDataResult {
  loading: boolean;
  error: string | null;
  sentimentData: SentimentAnalysis[];
  rankings: { university_name: string; score: number }[];
}

export const useSentimentData = (): UseSentimentDataResult => {
  const [loading, setLoading] = useState(true);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [rankings, setRankings] = useState<{ university_name: string; score: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        setLoading(true);
        const data = await loadSentimentAnalysisData();

        if (data.length > 0) {
          setSentimentData(data);

          const sortedData = data
            .map((item) => ({
              university_name: item.university_name,
              score: item.negative_score,
            }))
            .sort((a, b) => b.score - a.score);

          setRankings(sortedData);
        } else {
          setError("感情分析データが見つかりませんでした");
        }
      } catch (err) {
        console.error("感情分析データ読み込みエラー:", err);
        setError("感情分析データの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, []);

  return {
    loading,
    error,
    sentimentData,
    rankings,
  };
};
