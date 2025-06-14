import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import type { UniversitySummary, RatingCategory } from "../utils/utils";
import UniversityWordCloud from "./common/UniversityWordCloud";
import { useComparisonData } from "../hooks/useComparisonData";
import { shortCategoryNames, universityColors } from "../constants/categories";

interface UniversityComparisonChartProps {
  universities: UniversitySummary[];
}

type ChartType = "info" | "bar" | "radar" | "words";
type RatingType = "良い" | "普通" | "悪い";

const UniversityComparisonChart = ({ universities }: UniversityComparisonChartProps) => {
  const [chartType, setChartType] = useState<ChartType>("info");
  const [ratingType, setRatingType] = useState<RatingType>("良い");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { getSentimentDataByName, normalizeScore } = useComparisonData();

  const handleChartTypeChange = (_event: React.MouseEvent<HTMLElement>, newType: ChartType | null) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleRatingTypeChange = (_event: React.MouseEvent<HTMLElement>, newType: RatingType | null) => {
    if (newType !== null) {
      setRatingType(newType);
    }
  };

  const transformDataForBarChart = () => {
    const categories: RatingCategory[] = [
      "overall_rating",
      "lecture",
      "laboratory_seminar",
      "career",
      "access_location",
      "facilities",
      "friendship_romance",
      "student_life",
    ];

    return categories.map((category) => {
      const result: Record<string, string | number> = {
        category: shortCategoryNames[category] || category,
      };

      universities.forEach((uni) => {
        const ratingCount = uni.averageRatings[category];
        const total = ratingCount.total;
        const percentage = total > 0 ? Math.round((ratingCount[ratingType] / total) * 100) : 0;
        result[uni.university_name] = percentage;
      });

      return result;
    });
  };

  const radarDomain = [0, 100];

  const barData = transformDataForBarChart();

  const categories: RatingCategory[] = [
    "overall_rating",
    "lecture",
    "laboratory_seminar",
    "career",
    "access_location",
    "facilities",
    "friendship_romance",
    "student_life",
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          大学評価比較
        </Typography>

        <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, mt: 2 }}>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="チャートタイプ"
            size="small"
          >
            <ToggleButton value="info" aria-label="基本情報">
              基本情報
            </ToggleButton>
            <ToggleButton value="bar" aria-label="棒グラフ">
              棒グラフ
            </ToggleButton>
            <ToggleButton value="radar" aria-label="レーダーチャート">
              レーダーチャート
            </ToggleButton>
            <ToggleButton value="words" aria-label="単語情報">
              単語情報
            </ToggleButton>
          </ToggleButtonGroup>

          {chartType !== "info" && chartType !== "words" && (
            <ToggleButtonGroup
              value={ratingType}
              exclusive
              onChange={handleRatingTypeChange}
              aria-label="評価タイプ"
              size="small"
            >
              <ToggleButton value="良い" aria-label="良い評価">
                良い
              </ToggleButton>
              <ToggleButton value="普通" aria-label="普通評価">
                普通
              </ToggleButton>
              <ToggleButton value="悪い" aria-label="悪い評価">
                悪い
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: "auto", minHeight: 500 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "info" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                overflowY: "auto",
                p: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                大学基本情報比較
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                  gap: 3,
                  "& > .MuiPaper-root": {
                    height: 300,
                  },
                }}
              >
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    ネガティブスコアランキング
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {universities
                      .map((uni) => ({
                        university: uni,
                        sentimentData: getSentimentDataByName(uni.university_name),
                      }))
                      .filter((item) => item.sentimentData)
                      .sort((a, b) => (b.sentimentData?.negative_score || 0) - (a.sentimentData?.negative_score || 0))
                      .map((item, index) => {
                        const uni = item.university;
                        const sentimentData = item.sentimentData;
                        const negativeScore = sentimentData?.negative_score || 0;
                        const normalizedScore = normalizeScore(negativeScore);

                        return (
                          <Box key={uni.university_name} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="body2" sx={{ minWidth: 20 }}>
                                {index + 1}.
                              </Typography>
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  bgcolor:
                                    universityColors[
                                      universities.findIndex((u) => u.university_name === uni.university_name) %
                                        universityColors.length
                                    ],
                                  borderRadius: "50%",
                                }}
                              />
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {uni.university_name}
                                {universities[0].university_name === uni.university_name ? " (現在)" : ""}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {normalizedScore}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
                              <Tooltip title={`生スコア: ${negativeScore.toFixed(6)}`}>
                                <Box sx={{ width: "100%", mr: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={normalizedScore}
                                    color={
                                      normalizedScore >= 70 ? "error" : normalizedScore >= 40 ? "warning" : "success"
                                    }
                                    sx={{ height: 8, borderRadius: 1 }}
                                  />
                                </Box>
                              </Tooltip>
                            </Box>
                          </Box>
                        );
                      })}
                  </Box>
                  <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
                    ※ ネガティブスコアは口コミ全体のネガティブな感情の強さを表します。
                    値が大きいほどネガティブな感情が強いことを示します。 スコアは0-100の範囲に正規化されています。
                  </Typography>
                </Paper>

                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    総合評価
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {universities.map((uni, index) => {
                      const overallRating = uni.averageRatings.overall_rating;
                      const total = overallRating.total;
                      const goodPercentage = total > 0 ? Math.round((overallRating.良い / total) * 100) : 0;
                      const normalPercentage = total > 0 ? Math.round((overallRating.普通 / total) * 100) : 0;
                      const badPercentage = total > 0 ? Math.round((overallRating.悪い / total) * 100) : 0;

                      return (
                        <Box key={uni.university_name} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                bgcolor: universityColors[index % universityColors.length],
                                borderRadius: "50%",
                              }}
                            />
                            <Typography variant="body2">
                              {uni.university_name}
                              {index === 0 ? " (現在)" : ""}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
                            <Box
                              sx={{
                                display: "flex",
                                width: "100%",
                                height: 16,
                                borderRadius: 1,
                                overflow: "hidden",
                              }}
                            >
                              <Box sx={{ width: `${goodPercentage}%`, bgcolor: "#4caf50" }} />
                              <Box sx={{ width: `${normalPercentage}%`, bgcolor: "#ff9800" }} />
                              <Box sx={{ width: `${badPercentage}%`, bgcolor: "#f44336" }} />
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", ml: 3, mt: 0.5 }}>
                            <Typography variant="caption" color="success.main">
                              良い: {goodPercentage}%
                            </Typography>
                            <Typography variant="caption" color="warning.main">
                              普通: {normalPercentage}%
                            </Typography>
                            <Typography variant="caption" color="error.main">
                              悪い: {badPercentage}%
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>

                <Paper elevation={2} sx={{ p: 2, gridColumn: { xs: "1", md: "span 2" } }}>
                  <Typography variant="subtitle1" gutterBottom>
                    カテゴリ別の良い評価率
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                      gap: 2,
                      mt: 1,
                    }}
                  >
                    {categories
                      .filter((cat) => cat !== "overall_rating")
                      .map((category) => (
                        <Box key={category} sx={{ border: "1px solid #eee", borderRadius: 1, p: 1 }}>
                          <Typography variant="body2" fontWeight="bold" gutterBottom>
                            {shortCategoryNames[category] || category}
                          </Typography>
                          {universities.map((uni, index) => {
                            const ratingCount = uni.averageRatings[category];
                            const total = ratingCount.total;
                            const goodPercentage = total > 0 ? Math.round((ratingCount.良い / total) * 100) : 0;

                            return (
                              <Box
                                key={uni.university_name}
                                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
                              >
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    bgcolor: universityColors[index % universityColors.length],
                                    borderRadius: "50%",
                                  }}
                                />
                                <Typography variant="caption" sx={{ flex: 1 }}>
                                  {uni.university_name}
                                  {index === 0 ? " (現在)" : ""}
                                </Typography>
                                <Box
                                  sx={{
                                    width: 100,
                                    height: 8,
                                    bgcolor: "#f5f5f5",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: `${goodPercentage}%`,
                                      height: "100%",
                                      bgcolor: universityColors[index % universityColors.length],
                                    }}
                                  />
                                </Box>
                                <Typography variant="caption" width={30} textAlign="right">
                                  {goodPercentage}%
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      ))}
                  </Box>
                </Paper>
              </Box>
            </Box>
          ) : chartType === "bar" ? (
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
              <YAxis
                label={{
                  value: `${ratingType}評価の割合 (%)`,
                  angle: -90,
                  position: "insideLeft",
                }}
                domain={[0, 100]}
              />
              <RechartsTooltip formatter={(value: number) => `${value}%`} />
              <Legend />
              {universities.map((uni, index) => (
                <Bar
                  key={uni.university_name}
                  dataKey={uni.university_name}
                  name={`${uni.university_name}${index === 0 ? " (現在)" : ""}`}
                  fill={universityColors[index % universityColors.length]}
                />
              ))}
            </BarChart>
          ) : chartType === "words" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                overflowY: "auto",
                p: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                口コミに含まれる単語情報
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" paragraph>
                  各大学の口コミに含まれる単語の感情分析結果を表示しています。 単語の大きさは出現頻度に比例しています。
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{ display: "inline-block", width: 16, height: 16, bgcolor: "red", mr: 1 }}
                    />
                    <Typography variant="body2">ポジティブな単語</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{ display: "inline-block", width: 16, height: 16, bgcolor: "blue", mr: 1 }}
                    />
                    <Typography variant="body2">ネガティブな単語</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{ display: "inline-block", width: 16, height: 16, bgcolor: "green", mr: 1 }}
                    />
                    <Typography variant="body2">中立的な単語</Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                  gap: 3,
                  "& > .MuiPaper-root": {
                    height: 350,
                  },
                }}
              >
                {universities.map((uni, index) => {
                  const uniSentimentData = getSentimentDataByName(uni.university_name);

                  if (!uniSentimentData || !uniSentimentData.word_info) {
                    return (
                      <Paper key={uni.university_name} elevation={2} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {uni.university_name}
                          {index === 0 ? " (現在)" : ""}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: 250,
                            backgroundColor: "#f9f9f9",
                            borderRadius: 1,
                          }}
                        >
                          {!uniSentimentData ? (
                            <CircularProgress size={40} />
                          ) : (
                            <Typography color="text.secondary">単語データがありません</Typography>
                          )}
                        </Box>
                      </Paper>
                    );
                  }

                  return (
                    <UniversityWordCloud
                      key={uni.university_name}
                      universityName={uni.university_name}
                      sentimentData={uniSentimentData}
                      isCurrentUniversity={index === 0}
                      maxWords={50}
                    />
                  );
                })}
              </Box>

              <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
                ※ ホバーすると単語の詳細情報が表示されます
              </Typography>
            </Box>
          ) : (
            <RadarChart
              outerRadius="80%"
              data={categories.map((category) => {
                const result: Record<string, string | number> = {
                  category: category,
                };

                universities.forEach((uni) => {
                  const ratingCount = uni.averageRatings[category];
                  const total = ratingCount.total;
                  const percentage = total > 0 ? Math.round((ratingCount[ratingType] / total) * 100) : 0;
                  result[`${uni.university_name}_value`] = percentage;
                });

                return result;
              })}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tickFormatter={(value) => shortCategoryNames[value as string] || value} />
              <PolarRadiusAxis domain={radarDomain} />

              {universities.map((uni, index) => (
                <Radar
                  key={uni.university_name}
                  name={`${uni.university_name}${index === 0 ? " (現在)" : ""}`}
                  dataKey={`${uni.university_name}_value`}
                  stroke={universityColors[index % universityColors.length]}
                  fill={universityColors[index % universityColors.length]}
                  fillOpacity={0.3}
                />
              ))}

              <RechartsTooltip formatter={(value: number) => `${value}%`} />
              <Legend />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </Box>

      {chartType !== "info" && chartType !== "words" && (
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}>
          ※ グラフは各カテゴリにおける「{ratingType}」評価の割合（%）を示しています
        </Typography>
      )}
    </Paper>
  );
};

export default UniversityComparisonChart;
