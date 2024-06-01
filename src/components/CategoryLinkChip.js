import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';

export default function CategoryLinkChip({ category, selected, onClick }) {
  return (
    <Box
    mr={0.5}
    sx={{
      display: 'inline',
    }}
    >
      <Chip
      color="primary"
      variant={selected ? 'solid' : 'soft'}
      size="lg"
      name={category}
      onClick={onClick}
      >
          {category.charAt(0).toUpperCase() + category.slice(1)}
      </Chip>
    </Box>
  );
}