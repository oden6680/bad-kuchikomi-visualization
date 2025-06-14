import type { University, UniversityReviews } from "../types";

export interface WordInfo {
  count: number;
  sentiment_score: number;
  sentiment: "positive" | "negative" | "neutral";
}

export interface SentimentAnalysis {
  university_name: string;
  negative_score: number;
  word_info: Record<string, WordInfo>;
}

export type SentimentAnalysisData = SentimentAnalysis[];

export type RatingCategory =
  | "overall_rating"
  | "lecture"
  | "laboratory_seminar"
  | "career"
  | "access_location"
  | "facilities"
  | "friendship_romance"
  | "student_life";

export interface RatingCount {
  category: string;
  良い: number;
  普通: number;
  悪い: number;
  total: number;
}

export interface UniversitySummary {
  university_name: string;
  reviewCount: number;
  averageRatings: Record<RatingCategory, RatingCount>;
}

export const loadUniversityData = async (): Promise<UniversityReviews> => {
  try {
    const response = await fetch("/data/kuchikomi_data.json");
    if (!response.ok) {
      throw new Error("データの読み込みに失敗しました");
    }
    return await response.json();
  } catch (error) {
    console.error("データ読み込みエラー:", error);
    return [];
  }
};

export const loadSentimentAnalysisData = async (): Promise<SentimentAnalysisData> => {
  try {
    const response = await fetch("/data/university_sentiment_analysis.json");
    if (!response.ok) {
      throw new Error("感情分析データの読み込みに失敗しました");
    }
    return await response.json();
  } catch (error) {
    console.error("感情分析データ読み込みエラー:", error);
    return [];
  }
};

export const getSentimentAnalysisByName = (
  data: SentimentAnalysisData,
  name: string
): SentimentAnalysis | undefined => {
  return data.find((item) => item.university_name === name);
};

export const calculateUniversitySummaries = (universities: UniversityReviews): UniversitySummary[] => {
  return universities.map((university) => {
    const reviewCount = university.reviews.length;

    const ratingCategories: RatingCategory[] = [
      "overall_rating",
      "lecture",
      "laboratory_seminar",
      "career",
      "access_location",
      "facilities",
      "friendship_romance",
      "student_life",
    ];

    const averageRatings: Record<RatingCategory, RatingCount> = {} as Record<RatingCategory, RatingCount>;

    ratingCategories.forEach((category) => {
      const counts = {
        category: category,
        良い: 0,
        普通: 0,
        悪い: 0,
        total: 0,
      };

      university.reviews.forEach((review) => {
        const rating = review[category as keyof typeof review] as string | undefined;
        if (rating && (rating === "良い" || rating === "普通" || rating === "悪い")) {
          counts[rating] += 1;
          counts.total += 1;
        }
      });

      averageRatings[category] = counts;
    });

    return {
      university_name: university.university_name,
      reviewCount,
      averageRatings,
    };
  });
};

export const getUniversityNames = (universities: UniversityReviews): string[] => {
  return universities.map((uni) => uni.university_name);
};

export const getUniversityByName = (universities: UniversityReviews, name: string): University | undefined => {
  return universities.find((uni) => uni.university_name === name);
};
