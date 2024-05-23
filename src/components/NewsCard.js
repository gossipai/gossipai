import { Stack, Typography, Card, CardOverflow, Chip, AspectRatio, CardContent } from '@mui/joy';

export default function NewsCard({article}){

    const {title, source, time, image} = article;

    return (
        <Card orientation="horizontal" variant="outlined">
            <CardOverflow>
                <AspectRatio flex objectFit="cover" minHeight={1} sx={{width: 80}}>
                <img
                    src={image}
                    loading="lazy"
                    style={{width: "100%", height: "100%"}}
                    alt=""
                />
                </AspectRatio>
            </CardOverflow>
            <CardContent>
                <Chip size="sm" color="primary">
                Business
                </Chip>
                <Typography level="title-md" sx={{textAlign: "start"}} lineHeight={1.2} fontWeight={500}>
                {title}
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                <Typography level="body-xs" sx={{textAlign: "start"}}>
                    {source}
                </Typography>
                <Typography level="body-xs" sx={{textAlign: "start"}}>
                    {time}
                </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}
  