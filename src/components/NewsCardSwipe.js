import { Stack, Typography, Card, CardCover, Chip, AspectRatio, CardContent } from '@mui/joy';
import formatTimePassed from '../utils/formatTimePassed';

import Newspaper from '@mui/icons-material/Newspaper';
import AccessTime from '@mui/icons-material/AccessTime';

export default function NewsCard({article, onClick}) {

    const {id, title, body, category, source, dateTime, image} = article;

    return (
        <Card sx={{ minHeight: '100%', width: '100%' }}>
        <CardCover>
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
        </CardCover>
        <CardCover
          sx={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
          }}
        />
        <CardContent sx={{ justifyContent: 'flex-end' }}>
            { category && 
                <Chip size="sm" color="primary" variant="solid">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </Chip>
            }
            <Typography level="title-lg" textColor="#fff">
                { title }
            </Typography>
            <Typography level="body-sm" textColor="#ffffff75">
                { body.slice(0, 100) + '...'}
            </Typography>
            <Stack direction="row" justifyContent="space-between" mt={2}>
                <Typography startDecorator={<Newspaper />} level="body-xs" textColor="neutral.300">
                  {source}
                </Typography>
                <Typography endDecorator={<AccessTime />} level="body-xs">
                  {formatTimePassed(dateTime)}
                </Typography>
            </Stack>
        </CardContent>
      </Card>
    );
}
