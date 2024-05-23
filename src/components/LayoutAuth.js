import { Box, Sheet, Stack } from "@mui/joy";

export default function LayoutAuth({children}) {
  return (
    <Sheet sx={{height: "100vh"}} variant="solid" color="primary" invertedColors>
        <Stack direction="column" height={1}>
            <Box sx={{height: 50, overflowY: "scroll"}} flexGrow={1}>
                {children}
            </Box>
        </Stack>
    </Sheet>
  );
}