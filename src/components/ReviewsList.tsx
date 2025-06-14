import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useState } from "react";
import type { Review } from "../types";
import type { SelectChangeEvent } from "@mui/material";
import { getRatingColor } from "../utils/formatUtils";
import { categoryNames } from "../constants/categories";

interface ReviewsListProps {
  reviews: Review[];
  title: string;
}

const DISPLAY_OPTIONS = [10, 20, 30, 50, 100];

const ReviewsList = ({ reviews, title }: ReviewsListProps) => {
  const [displayCount, setDisplayCount] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ratingFilter, setRatingFilter] = useState<string>("全て");

  const handleDisplayCountChange = (event: SelectChangeEvent<number>) => {
    setDisplayCount(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleRatingFilterChange = (event: SelectChangeEvent<string>) => {
    setRatingFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const filteredReviews = reviews.filter((review) => ratingFilter === "全て" || review.overall_rating === ratingFilter);

  const totalPages = Math.ceil(filteredReviews.length / displayCount);
  const startIndex = (currentPage - 1) * displayCount;
  const displayedReviews = filteredReviews.slice(startIndex, startIndex + displayCount);
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" component="h2">
          {title} ({filteredReviews.length}/{reviews.length}件)
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="rating-filter-label">総合評価</InputLabel>
            <Select
              labelId="rating-filter-label"
              id="rating-filter"
              value={ratingFilter}
              label="総合評価"
              onChange={handleRatingFilterChange}
            >
              <MenuItem value="全て">全て</MenuItem>
              <MenuItem value="良い">良い</MenuItem>
              <MenuItem value="普通">普通</MenuItem>
              <MenuItem value="悪い">悪い</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="display-count-label">表示件数</InputLabel>
            <Select
              labelId="display-count-label"
              id="display-count"
              value={displayCount}
              label="表示件数"
              onChange={handleDisplayCountChange}
            >
              {DISPLAY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}件
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {reviews.length === 0 ? (
        <Typography>口コミはありません</Typography>
      ) : (
        <>
          {displayedReviews.map((review) => (
            <Accordion key={review.review_id} sx={{ mb: 2 }}>
              <AccordionSummary>
                <Box sx={{ width: "100%" }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      label={`総合評価: ${review.overall_rating}`}
                      color={getRatingColor(review.overall_rating)}
                      variant="outlined"
                    />
                    <Typography>{review.review_content.substring(0, 100)}...</Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    {review.review_content}
                  </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}>
                  {Object.entries(review).map(([key, value]) => {
                    if (
                      key.includes("_detail") ||
                      key === "review_id" ||
                      key === "review_content" ||
                      key === "overall_rating" ||
                      key === "overall_rating_detail"
                    ) {
                      return null;
                    }

                    if (!value) {
                      return null;
                    }

                    const keyMapping: Record<string, string> = {
                      ...categoryNames,
                      department_curriculum: "学部・カリキュラム",
                      gender_ratio: "男女比",
                      motivation: "志望動機",
                      career_path: "進路",
                    };

                    const displayKey = keyMapping[key] || key;

                    return (
                      <Box
                        key={key}
                        sx={{
                          gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" },
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle2">{displayKey}:</Typography>
                        <Chip label={value} color={getRatingColor(value as string)} size="small" sx={{ mr: 1 }} />
                        {review[`${key}_detail` as keyof Review] && (
                          <Typography variant="body2">{review[`${key}_detail` as keyof Review] as string}</Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default ReviewsList;
