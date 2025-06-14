import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress,
  Tooltip,
  LinearProgress,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useSentimentData } from "../../hooks/useSentimentData";

interface NegativeRankingProps {
  withLinks?: boolean;
}

const NegativeRanking = ({ withLinks = false }: NegativeRankingProps) => {
  const { loading, error, rankings } = useSentimentData();

  const normalizeScore = (score: number): number => {
    if (rankings.length === 0) return 0;

    const maxScore = Math.max(...rankings.map((r) => r.score));
    const minScore = Math.min(...rankings.map((r) => r.score));

    if (maxScore === minScore) return 50;

    const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;

    if (isNaN(normalizedScore)) {
      console.warn("正規化スコアがNaNです:", { score, minScore, maxScore });
      return 0;
    }

    return Math.round(normalizedScore);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : rankings.length === 0 ? (
        <Typography>ランキングデータがありません</Typography>
      ) : (
        <List>
          {rankings.map((item, index) => (
            <Box key={item.university_name}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {withLinks ? (
                        <Link
                          component={RouterLink}
                          to={`/university/${encodeURIComponent(item.university_name)}`}
                          sx={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ "&:hover": { textDecoration: "underline", color: "primary.main" } }}
                          >
                            {index + 1}. {item.university_name}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography variant="body1">
                          {index + 1}. {item.university_name}
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", alignItems: "center", width: "50%" }}>
                        <Typography variant="body2" sx={{ mr: 1, minWidth: 120 }}>
                          ネガティブ度: {normalizeScore(item.score)}
                        </Typography>
                        <Tooltip title={`生スコア: ${item.score.toFixed(6)}`}>
                          <Box sx={{ width: "100%", mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={normalizeScore(item.score)}
                              color={
                                normalizeScore(item.score) >= 70
                                  ? "error"
                                  : normalizeScore(item.score) >= 40
                                  ? "warning"
                                  : "success"
                              }
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                        </Tooltip>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < rankings.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default NegativeRanking;
