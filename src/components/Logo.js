import { Newspaper } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

export default function Logo({level="h4", color="primary"}) {
    return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
            <Newspaper color={color}/>
            <Typography level={level}>GossipAI</Typography>
        </Stack>
    );
}