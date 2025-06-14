import { useState, useEffect } from "react";
import {
  loadUniversityData,
  calculateUniversitySummaries,
  getUniversityByName,
  loadSentimentAnalysisData,
  getSentimentAnalysisByName,
  type UniversitySummary,
  type SentimentAnalysis,
} from "../utils/utils";
import type { University } from "../types";

interface UseUniversityDataProps {
  universityName?: string;
}

interface UseUniversityDataResult {
  loading: boolean;
  error: string | null;
  university: University | null;
  universitySummary: UniversitySummary | null;
  sentimentData: SentimentAnalysis | null;
  allUniversities: University[];
  allSummaries: UniversitySummary[];
  allSentimentData: SentimentAnalysis[];
}

export const useUniversityData = ({ universityName }: UseUniversityDataProps = {}): UseUniversityDataResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [universitySummary, setUniversitySummary] = useState<UniversitySummary | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis | null>(null);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [allSummaries, setAllSummaries] = useState<UniversitySummary[]>([]);
  const [allSentimentData, setAllSentimentData] = useState<SentimentAnalysis[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadUniversityData();
        setAllUniversities(data);

        if (data.length > 0) {
          const summaries = calculateUniversitySummaries(data);
          setAllSummaries(summaries);

          const sentimentData = await loadSentimentAnalysisData();
          setAllSentimentData(sentimentData);

          if (universityName) {
            const foundUniversity = getUniversityByName(data, universityName);

            if (foundUniversity) {
              setUniversity(foundUniversity);

              const summary = summaries.find((s) => s.university_name === universityName);
              setUniversitySummary(summary || null);

              const universitySentiment = getSentimentAnalysisByName(sentimentData, universityName);
              setSentimentData(universitySentiment || null);
            } else {
              setError(`"${universityName}"という大学は見つかりませんでした`);
            }
          }
        } else {
          setError("データが見つかりませんでした");
        }
      } catch (error) {
        console.error("データ読み込みエラー:", error);
        setError("データの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [universityName]);

  return {
    loading,
    error,
    university,
    universitySummary,
    sentimentData,
    allUniversities,
    allSummaries,
    allSentimentData,
  };
};
