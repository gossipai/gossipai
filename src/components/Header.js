import { Dropdown, IconButton, Menu, MenuButton, MenuItem, Stack, Typography } from "@mui/joy";
import Logo from "./Logo";
import { Person } from "@mui/icons-material";
import { useAuth } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Header() {

  const navigate = useNavigate();

  const { authUser } = useAuth();

  return (
    <Stack direction="row" p={1} borderBottom={1} borderColor="divider" justifyContent="space-between">
      <Logo/>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
        >
          <Person />
        </MenuButton>
        <Menu>
          <Typography
            level="body-xs"
            sx={{p:1}}
          >
            {authUser.email}
          </Typography>
          <MenuItem onClick={()=>navigate("/logout")}>Logout</MenuItem>
        </Menu>
      </Dropdown>
    </Stack>
  );
}