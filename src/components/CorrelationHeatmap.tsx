import { Box, Typography, Paper } from '@mui/material';
import { useState } from 'react';
import type { RatingCount } from '../utils/utils';
import { shortCategoryNames } from '../constants/categories';

interface CorrelationHeatmapProps {
  ratingData: RatingCount[];
  title: string;
}

const calculateCorrelation = (data: RatingCount[]): { value: number; xCategory: string; yCategory: string }[][] => {
  const categories = data.map(item => item.category);
  const result: { value: number; xCategory: string; yCategory: string }[][] = [];
  
  for (let i = 0; i < categories.length; i++) {
    const row: { value: number; xCategory: string; yCategory: string }[] = [];
    
    for (let j = 0; j < categories.length; j++) {
      const category1 = data[i];
      const category2 = data[j];
      
      const total1 = category1.良い + category1.普通 + category1.悪い;
      const total2 = category2.良い + category2.普通 + category2.悪い;
      
      const goodRatio1 = total1 > 0 ? category1.良い / total1 : 0;
      const goodRatio2 = total2 > 0 ? category2.良い / total2 : 0;
      
      const correlationValue = i === j ? 1 : Math.abs(goodRatio1 - goodRatio2);
      const normalizedValue = 1 - correlationValue;
      
      row.push({
        value: normalizedValue,
        xCategory: categories[j],
        yCategory: categories[i]
      });
    }
    
    result.push(row);
  }
  
  return result;
};

const getColor = (value: number): string => {
  const intensity = Math.round(value * 255);
  const reversedIntensity = 255 - intensity;
  return `rgb(0, ${reversedIntensity}, ${Math.min(255, reversedIntensity + 50)})`;
};

const CorrelationHeatmap = ({ ratingData, title }: CorrelationHeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  
  const correlationData = calculateCorrelation(ratingData);
  const categories = ratingData.map(item => item.category);
  const displayCategoryNames = categories.map(cat => shortCategoryNames[cat] || cat);
  
  const cellSize = 40;
  const cellGap = 0;
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" paragraph>
        このヒートマップは各評価カテゴリ間の相関関係を示しています。色が濃い青ほど相関が高いことを表します。
      </Typography>
      
      <Box sx={{ 
        width: '100%', 
        overflowX: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: `auto repeat(${categories.length}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${categories.length + 1}, ${cellSize}px)`,
          gap: cellGap,
          position: 'relative'
        }}>
          <Box sx={{ gridColumn: 1, gridRow: 1 }}></Box>
          {displayCategoryNames.map((category, index) => (
            <Box 
              key={`x-${index}`} 
              sx={{ 
                gridColumn: index + 2, 
                gridRow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4px',
                height: cellSize,
                fontSize: '11px',
                color: '#666',
                whiteSpace: 'nowrap',
                textAlign: 'center'
              }}
            >
              {category}
            </Box>
          ))}
          
          {displayCategoryNames.map((category, index) => (
            <Box 
              key={`y-${index}`} 
              sx={{ 
                gridColumn: 1, 
                gridRow: index + 2,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '4px',
                width: 80,
                fontSize: '11px',
                color: '#666'
              }}
            >
              {category}
            </Box>
          ))}
          {correlationData.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const isHovered = hoveredCell?.x === colIndex && hoveredCell?.y === rowIndex;
              
              return (
                <Box 
                  key={`cell-${rowIndex}-${colIndex}`}
                  sx={{ 
                    gridColumn: colIndex + 2, 
                    gridRow: rowIndex + 2,
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getColor(cell.value),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                      outline: '2px solid #333'
                    }
                  }}
                  onMouseEnter={() => setHoveredCell({ x: colIndex, y: rowIndex })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {isHovered && (
                    <Box sx={{ 
                      position: 'absolute',
                      top: '-40px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      zIndex: 10,
                      whiteSpace: 'nowrap'
                    }}>
                      {`${shortCategoryNames[cell.yCategory]} vs ${shortCategoryNames[cell.xCategory]}`}
                      <br />
                      {`相関度: ${(cell.value * 100).toFixed(0)}%`}
                    </Box>
                  )}
                </Box>
              );
            })
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default CorrelationHeatmap;
