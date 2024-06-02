import { Stack, Typography, Card, CardOverflow, Chip, AspectRatio, CardContent } from '@mui/joy';
import formatTimePassed from '../utils/formatTimePassed';

export default function NewsCard({article, onClick}) {

    const {id, title, category, source, dateTime, image} = article;

    return (
        <Card orientation="horizontal" variant="outlined" sx={{textDecoration: 0}} onClick={(e) => {onClick(id)}}>
            <CardOverflow>
                <AspectRatio flex objectFit="cover" minHeight={1} sx={{width: 80}}>
                    <img
                        src={image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Nk3fCmOkkI4IUtZvVCLEGxQ9o4SjDnlF6A&s'}
                        loading="lazy"
                        style={{width: "100%", height: "100%"}}
                        alt=""
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Nk3fCmOkkI4IUtZvVCLEGxQ9o4SjDnlF6A&s';
                        }}
                    />
                </AspectRatio>
            </CardOverflow>
            <CardContent>
                { category && 
                    <Chip size="sm" color="primary">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Chip>
                }
                <Typography level="title-md" sx={{textAlign: "start"}} lineHeight={1.2} fontWeight={500}>
                    {title}
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                    <Typography level="body-xs" sx={{textAlign: "start"}}>
                        {source}
                    </Typography>
                    <Typography level="body-xs" sx={{textAlign: "start"}}>
                        {formatTimePassed(dateTime)}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}
