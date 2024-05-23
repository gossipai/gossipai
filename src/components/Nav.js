import { Box, Stack, Typography, Sheet } from "@mui/joy";

import { NavLink } from "react-router-dom";
import { Newspaper, Public } from "@mui/icons-material";

export default function Nav() {
  return (
    <Stack direction="row">
      <Box sx={{flexGrow:1, textAlign: "center"}}>
          <NavLink to="/">
              {({ isActive }) => 
                <Sheet sx={{p:0.5}} color="primary" variant={isActive?"solid":"soft"} invertedColors>
                    <Newspaper sx={{mb: -1}}/>
                    <Typography level="body-xs">
                        For You
                    </Typography>
                </Sheet>
              }
          </NavLink>
      </Box>
      <Box sx={{flexGrow:1, textAlign: "center"}}>
          <NavLink to="/discover">
              {({ isActive }) => 
                <Sheet sx={{p:0.5}} color="primary" variant={isActive?"solid":"soft"} invertedColors>
                    <Public sx={{mb: -1}}/>
                    <Typography level="body-xs">
                        Discover
                    </Typography>
                </Sheet>
              }
          </NavLink>
      </Box>
  </Stack>
  );
}