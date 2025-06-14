import { Box, Typography, Paper } from "@mui/material";
import WordCloudBase from "./WordCloudBase";
import type { SentimentAnalysis } from "../../utils/utils";

interface WordCloudProps {
  sentimentData: SentimentAnalysis | null;
  title: string;
  maxWords?: number;
}

const WordCloud = ({ sentimentData, title, maxWords = 100 }: WordCloudProps) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          minHeight: 350,
          backgroundColor: "#f9f9f9",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <WordCloudBase sentimentData={sentimentData} maxWords={maxWords} height={300} />
      </Box>

      <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}>
        ※ 単語の大きさは出現頻度に比例しています。ホバーすると詳細が表示されます。
      </Typography>
    </Paper>
  );
};

export default WordCloud;
