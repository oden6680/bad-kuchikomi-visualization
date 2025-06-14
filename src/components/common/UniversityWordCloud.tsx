import { Paper, Typography, Box } from "@mui/material";
import WordCloudBase from "./WordCloudBase";
import type { SentimentAnalysis } from "../../utils/utils";

interface UniversityWordCloudProps {
  universityName: string;
  sentimentData: SentimentAnalysis;
  isCurrentUniversity?: boolean;
  maxWords?: number;
}

const UniversityWordCloud = ({
  universityName,
  sentimentData,
  isCurrentUniversity = false,
  maxWords = 50,
}: UniversityWordCloudProps) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {universityName}
        {isCurrentUniversity ? " (現在)" : ""}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 250,
          overflow: "hidden",
        }}
      >
        <WordCloudBase sentimentData={sentimentData} maxWords={maxWords} height="100%" />
      </Box>
    </Paper>
  );
};

export default UniversityWordCloud;
