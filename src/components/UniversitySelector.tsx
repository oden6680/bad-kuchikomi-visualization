import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface UniversitySelectorProps {
  universities: string[];
  selectedUniversity: string;
  onUniversityChange: (university: string) => void;
}

const UniversitySelector = ({
  universities,
  selectedUniversity,
  onUniversityChange
}: UniversitySelectorProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onUniversityChange(event.target.value);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <FormControl fullWidth>
        <InputLabel id="university-select-label">大学を選択</InputLabel>
        <Select
          labelId="university-select-label"
          id="university-select"
          value={selectedUniversity}
          label="大学を選択"
          onChange={handleChange}
        >
          {universities.map((university) => (
            <MenuItem key={university} value={university}>
              {university}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default UniversitySelector;
