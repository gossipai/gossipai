import { Stack, Typography, Card, CardOverflow, Chip, AspectRatio, CardContent } from '@mui/joy';
import { Link } from 'react-router-dom';

export default function NewsCard({article}){

    const {id, title, source, time, image} = article;

    return (
        <Link to={`/article/${id}`}>
            <Card orientation="horizontal" variant="outlined" sx={{textDecoration: 0}}>
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
        </Link>
    );
}
  