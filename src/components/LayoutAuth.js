import { Box, Divider, Grid, Sheet, Stack } from "@mui/joy";
import LogoWhite from "./LogoWhite";

export default function LayoutAuth({children}) {
  return (
    <Sheet sx={{height: "100vh"}} variant="solid" color="primary" invertedColors>
        <Stack direction="column" height={1}>
            <Box sx={{height: 50, overflowY: "scroll"}} flexGrow={1}>
              <Grid container justifyContent="center" alignItems="center" p={3}>
                <Grid xs={12} md={8} lg={4}>
                  <Box sx={{mb:4}}>
                    <LogoWhite/>
                  </Box>
                  {children}
                </Grid>
              </Grid>
            </Box>
        </Stack>
    </Sheet>
  );
}