import { Box, Typography } from '@mui/joy';

export default function ChatMessage({owner, message}){

    const align = owner === "user" ? "end" : "start";
    const boxColor = owner === "user" ? "primary" : "neutral";
    const messageVariant = owner === "user" ? "solid" : "soft";

    return(
        <Box textAlign={align}>
            <Typography variant={messageVariant} color={boxColor} level="body-sm" borderRadius="lg"
            sx={{
            padding: 1,
            textAlign: "start",
            display: "inline-block",
            width: "90%",
            overflowWrap: "break-word",
            }}>
            {message}
            </Typography>
        </Box>
    );
}