import { Stack, Typography } from "@mui/joy";

export default function LogoBlue() {
    return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
            <img src="/logo_blue.png" alt="logo" width="50" height="50" />
            <Typography level="h4">GossipAI</Typography>
        </Stack>
    );
}