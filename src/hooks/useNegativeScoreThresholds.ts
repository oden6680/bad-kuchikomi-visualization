import { useState, useEffect } from "react";
import { loadUniversityData } from "../utils/utils";
import type { Review } from "../types";

interface NegativeScoreThresholds {
  low: number;
  medium: number;
}

export const useNegativeScoreThresholds = (): {
  thresholds: NegativeScoreThresholds | null;
  loading: boolean;
  error: string | null;
} => {
  const [thresholds, setThresholds] = useState<NegativeScoreThresholds | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateThresholds = async () => {
      try {
        setLoading(true);
        
        const universities = await loadUniversityData();
        
        if (universities.length === 0) {
          setError("大学データが見つかりませんでした");
          return;
        }
        
        const allScores: number[] = [];
        
        universities.forEach(university => {
          university.reviews.forEach((review: Review) => {
            if (review.negative_score !== undefined) {
              allScores.push(review.negative_score);
            }
          });
        });
        
        if (allScores.length === 0) {
          setError("negative_scoreが見つかりませんでした");
          return;
        }
        
        allScores.sort((a, b) => a - b);
        
        const lowIndex = Math.floor(allScores.length * 0.33);
        const mediumIndex = Math.floor(allScores.length * 0.66);
        
        const lowThreshold = allScores[lowIndex];
        const mediumThreshold = allScores[mediumIndex];
        
        setThresholds({ low: lowThreshold, medium: mediumThreshold });
        
      } catch (err) {
        console.error("閾値計算エラー:", err);
        setError("閾値の計算中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };
    
    calculateThresholds();
  }, []);
  
  return { thresholds, loading, error };
};
