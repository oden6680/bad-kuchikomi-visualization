import { Container, Typography } from "@mui/material";
import Header from "../components/Header";
import NegativeRanking from "../components/ranking/NegativeRanking";

const HomePage = () => {
  return (
    <>
      <Header />
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ネガティブ口コミランキング
        </Typography>
        <Typography variant="body1" paragraph>
          このページでは、口コミデータを自然言語処理して算出した「ネガティブ度」に基づいて大学をランキング表示しています。
          各大学名をクリックすると、詳細な分析ページに移動します。
        </Typography>

        <NegativeRanking withLinks={true} />
      </Container>
    </>
  );
};

export default HomePage;
