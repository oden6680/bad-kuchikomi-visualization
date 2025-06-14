import { useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Container, Typography, Box, CircularProgress, Breadcrumbs, Link } from "@mui/material";
import Header from "../components/Header";
import UniversityDetailContent from "../components/university/UniversityDetailContent";
import UniversityComparisonDrawer from "../components/UniversityComparisonDrawer";
import { useUniversityData } from "../hooks/useUniversityData";
import type { UniversitySummary } from "../utils/utils";

const UniversityDetailPage = () => {
  const { universityName } = useParams<{ universityName: string }>();
  const decodedUniversityName = universityName ? decodeURIComponent(universityName) : "";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<UniversitySummary[] | null>(null);

  const { loading, error, university, universitySummary, sentimentData } = useUniversityData({
    universityName: decodedUniversityName,
  });

  const handleOpenComparisonDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCompare = (data: UniversitySummary[]) => {
    setComparisonData(data);
    setDrawerOpen(false);
  };

  return (
    <>
      <Header />
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" color="inherit">
            ホーム
          </Link>
          <Typography color="text.primary">{decodedUniversityName}</Typography>
        </Breadcrumbs>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : university ? (
          <>
            <UniversityDetailContent
              university={university}
              universitySummary={universitySummary}
              sentimentData={sentimentData}
              comparisonData={comparisonData}
              onOpenComparisonDrawer={handleOpenComparisonDrawer}
            />
            <UniversityComparisonDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              currentUniversity={university.university_name}
              onCompare={handleCompare}
            />
          </>
        ) : (
          <Typography>大学情報が見つかりませんでした</Typography>
        )}
      </Container>
    </>
  );
};

export default UniversityDetailPage;
