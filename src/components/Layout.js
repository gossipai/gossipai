import { Box, Stack, Typography, Sheet } from "@mui/joy";

import HomeRounded from "@mui/icons-material/HomeRounded";
import { NavLink } from "react-router-dom";

export default function Layout({children}) {
  return (
        <Box sx={{height: "100vh"}}>
            <Stack direction="column" height={1}>
                <Box sx={{height: 50, overflowY: "scroll"}} flexGrow={1}>
                    {children}
                </Box>
                <Box>
                    <Stack direction="row">
                        <Box sx={{flexGrow:1, textAlign: "center"}}>
                            <NavLink to="/">
                                {({ isActive }) => 
                                    <Sheet color="primary" variant={isActive?"solid":"soft"} invertedColors>
                                        <HomeRounded />
                                        <Typography>
                                            Home
                                        </Typography>
                                    </Sheet>
                                }
                            </NavLink>
                        </Box>
                    </Stack>
                </Box>
        </Stack>
    </Box>
  );
}