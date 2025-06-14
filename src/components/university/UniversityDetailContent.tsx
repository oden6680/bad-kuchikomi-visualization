import { Box, Typography, Paper, Link, CircularProgress, Tooltip, Fab } from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import RatingChart from "../RatingChart";
import RadarChart from "../RadarChart";
import CorrelationHeatmap from "../CorrelationHeatmap";
import ReviewsList from "../ReviewsList";
import WordCloud from "../common/WordCloud";
import UniversityComparisonChart from "../UniversityComparisonChart";
import type { University } from "../../types";
import type { UniversitySummary, SentimentAnalysis } from "../../utils/utils";
import { getRatingDataArray } from "../../utils/formatUtils";
import { ratingCategories } from "../../constants/categories";

interface UniversityDetailContentProps {
  university: University;
  universitySummary: UniversitySummary | null;
  sentimentData: SentimentAnalysis | null;
  comparisonData: UniversitySummary[] | null;
  onOpenComparisonDrawer: () => void;
}

const UniversityDetailContent = ({
  university,
  universitySummary,
  sentimentData,
  comparisonData,
  onOpenComparisonDrawer,
}: UniversityDetailContentProps) => {

  return (
    <>
      <Tooltip title="他大学と比較" placement="left">
        <Fab
          color="primary"
          aria-label="compare"
          onClick={onOpenComparisonDrawer}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <CompareArrowsIcon />
        </Fab>
      </Tooltip>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {university.university_name}
        </Typography>
        <Typography variant="body1" paragraph>
          <Link href={university.review_url} target="_blank" rel="noopener noreferrer">
            口コミページ
          </Link>
        </Typography>
      </Paper>

      {universitySummary ? (
        <>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
            口コミデータの可視化
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {university.university_name}の口コミ評価を様々な視点から分析した結果です。
          </Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mb: { xs: 8, md: 8 } }}>
            <Box sx={{ flex: 1, mb: { xs: 4, md: 0 } }}>
              <Box sx={{ height: 450 }}>
                <RatingChart ratingData={getRatingDataArray(universitySummary, ratingCategories)} title={`評価分布（カテゴリ別）`} />
              </Box>
            </Box>
            <Box sx={{ flex: 1, mb: { xs: 4, md: 0 } }}>
              <Box sx={{ height: 450 }}>
                <RadarChart ratingData={getRatingDataArray(universitySummary, ratingCategories)} title={`評価の割合（%）`} />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mb: 6 }}>
            <Box sx={{ flex: 1, mb: { xs: 4, md: 0 } }}>
              <Box sx={{ height: 450 }}>
                <CorrelationHeatmap
                  ratingData={getRatingDataArray(universitySummary, ratingCategories)}
                  title={`評価カテゴリ間の相関関係`}
                />
              </Box>
            </Box>
            <Box sx={{ flex: 1, mb: { xs: 4, md: 0 } }}>
              <Box sx={{ height: 450 }}>
                <WordCloud
                  sentimentData={sentimentData}
                  title={`${university.university_name}の口コミに含まれる単語`}
                  maxWords={100}
                />
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {comparisonData && comparisonData.length > 1 && (
        <Box sx={{ mb: 6 }}>
          <UniversityComparisonChart universities={comparisonData} />
        </Box>
      )}

      <ReviewsList reviews={university.reviews} title={`${university.university_name}の口コミ一覧`} />
    </>
  );
};

export default UniversityDetailContent;
