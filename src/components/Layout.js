import { Box, Stack } from "@mui/joy";
import Nav from "./Nav";
import Header from "./Header";

export default function Layout({children}) {
  return (
    <Box sx={{height: "100dvh"}}>
        <Stack direction="column" height={1}>
            <Box>
                <Header />
            </Box>
            <Box sx={{height: 50, overflowY: "scroll"}} flexGrow={1}>
                {children}
            </Box>
            <Box>
                <Nav />
            </Box>
        </Stack>
    </Box>
  );
}