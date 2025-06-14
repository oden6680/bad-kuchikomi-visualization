import { Box, Typography, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { RatingCount } from "../utils/utils";
import { categoryNames } from "../constants/categories";

interface RatingChartProps {
  ratingData: RatingCount[];
  title: string;
}

const transformDataForChart = (data: RatingCount[]) => {
  return data.map((item) => ({
    name: categoryNames[item.category] || item.category,
    良い: item.良い,
    普通: item.普通,
    悪い: item.悪い,
  }));
};

const RatingChart = ({ ratingData, title }: RatingChartProps) => {
  const chartData = transformDataForChart(ratingData);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="良い" fill="#4caf50" stackId="stack" />
            <Bar dataKey="普通" fill="#ff9800" stackId="stack" />
            <Bar dataKey="悪い" fill="#f44336" stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default RatingChart;
