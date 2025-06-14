import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  TextField,
  InputAdornment,
  Checkbox,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import type { University } from "../types";
import type { UniversitySummary } from "../utils/utils";
import { loadUniversityData, calculateUniversitySummaries } from "../utils/utils";

interface UniversityComparisonDrawerProps {
  open: boolean;
  onClose: () => void;
  currentUniversity: string;
  onCompare: (universities: UniversitySummary[]) => void;
}

const UniversityComparisonDrawer = ({
  open,
  onClose,
  currentUniversity,
  onCompare,
}: UniversityComparisonDrawerProps) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadUniversityData();
        if (data.length > 0) {
          const filteredData = data.filter((uni) => uni.university_name !== currentUniversity);
          setUniversities(filteredData);
          setFilteredUniversities(filteredData);
        } else {
          setError("データが見つかりませんでした");
        }
      } catch (error) {
        console.error("データ読み込みエラー:", error);
        setError("データの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, currentUniversity]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter((uni) =>
        uni.university_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  }, [searchTerm, universities]);

  const handleToggleUniversity = (universityName: string) => {
    setSelectedUniversities((prev) => {
      if (prev.includes(universityName)) {
        return prev.filter((name) => name !== universityName);
      } else {
        if (prev.length < 3) {
          return [...prev, universityName];
        }
        return prev;
      }
    });
  };

  const handleRemoveUniversity = (universityName: string) => {
    setSelectedUniversities((prev) => prev.filter((name) => name !== universityName));
  };

  const handleCompare = async () => {
    try {
      setLoading(true);
      const data = await loadUniversityData();
      const summaries = calculateUniversitySummaries(data);
      const currentUniSummary = summaries.find((s) => s.university_name === currentUniversity);

      const selectedUniSummaries = selectedUniversities
        .map((name) => summaries.find((s) => s.university_name === name))
        .filter((s): s is UniversitySummary => s !== undefined);

      if (currentUniSummary) {
        const comparisonData = [currentUniSummary, ...selectedUniSummaries];
        onCompare(comparisonData);
        onClose();
      } else {
        setError("現在の大学のデータが見つかりませんでした");
      }
    } catch (error) {
      console.error("比較データ取得エラー:", error);
      setError("比較データの取得中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 400 },
          boxSizing: "border-box",
          p: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">大学比較</Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ mb: 2 }}>
        比較したい大学を最大3つまで選択してください。
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        <Chip label={`${currentUniversity} (現在)`} color="primary" sx={{ fontWeight: "bold" }} />
        {selectedUniversities.map((uni) => (
          <Chip key={uni} label={uni} onDelete={() => handleRemoveUniversity(uni)} color="primary" variant="outlined" />
        ))}
      </Box>

      <TextField
        fullWidth
        placeholder="大学名で検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List sx={{ overflow: "auto", flexGrow: 1, maxHeight: "calc(100vh - 300px)" }}>
          {filteredUniversities.length === 0 ? (
            <Typography sx={{ p: 2 }}>該当する大学がありません</Typography>
          ) : (
            filteredUniversities.map((uni) => (
              <ListItem key={uni.university_name} disablePadding>
                <ListItemButton onClick={() => handleToggleUniversity(uni.university_name)} dense>
                  <Checkbox
                    edge="start"
                    checked={selectedUniversities.includes(uni.university_name)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={uni.university_name} />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      )}

      <Box sx={{ mt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<CompareArrowsIcon />}
          onClick={handleCompare}
          disabled={selectedUniversities.length === 0 || loading}
        >
          {loading ? "読み込み中..." : "比較する"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default UniversityComparisonDrawer;
