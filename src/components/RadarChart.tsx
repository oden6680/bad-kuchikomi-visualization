import { useState } from "react";
import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton } from "@mui/material";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { RatingCount } from "../utils/utils";
import { categoryNames } from "../constants/categories";

interface RadarChartProps {
  ratingData: RatingCount[];
  title: string;
}

type RatingType = "良い" | "普通" | "悪い";

const transformDataForRadarChart = (data: RatingCount[], ratingType: RatingType) => {
  return data.map((item) => {
    const total = item.良い + item.普通 + item.悪い;
    const percentage = total > 0 ? Math.round((item[ratingType] / total) * 100) : 0;

    return {
      subject: categoryNames[item.category] || item.category,
      評価スコア: percentage,
      fullMark: 100,
    };
  });
};

const RadarChart = ({ ratingData, title }: RadarChartProps) => {
  const [ratingType, setRatingType] = useState<RatingType>("良い");
  
  const handleRatingTypeChange = (_event: React.MouseEvent<HTMLElement>, newType: RatingType | null) => {
    if (newType !== null) {
      setRatingType(newType);
    }
  };

  const chartData = transformDataForRadarChart(ratingData, ratingType);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" component="h2">
          {title.replace("良い", ratingType)}
        </Typography>

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
      </Box>

      <Box sx={{ width: "100%", height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#333", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#666" }} />
            <Radar
              name={`${ratingType}評価の割合`}
              dataKey="評価スコア"
              stroke="#1976d2"
              fill="#1976d2"
              fillOpacity={0.6}
            />
            <Tooltip formatter={(value) => `${value}%`} labelFormatter={(label) => `カテゴリ: ${label}`} />
            <Legend />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </Box>

      <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}>
        ※ グラフは各カテゴリにおける「{ratingType}」評価の割合（%）を示しています
      </Typography>
    </Paper>
  );
};

export default RadarChart;
