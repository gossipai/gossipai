import { Box, Stack, Typography, Card, IconButton, CardCover, CardOverflow, Chip, AspectRatio, CardContent } from '@mui/joy';

import { AccessTime, ArrowBack, ArrowLeft, Newspaper } from '@mui/icons-material';

const article = 
  {
    "title": "Hornets forward Grant Williams on Luka Doncic, TV rights, and helping Hornets win again",
    "source": "ArcaMax",
    "time": "5m ago",
    "image": "https://resources.arcamax.com/newspics/289/28994/2899440.gif",
    "body": `Grant Williams just wants to win.
    The new Charlotte Hornets forward grew up here and was an all-state high school basketball player at Providence Day. In 2016, he helped lead the Chargers to a state championship win over Miami Heat forward Bam Adebayo’s powerhouse prep team.
    Williams, 25, spoke with The Observer last week about his partnership with Quest Nutrition, an alleged dust-up with Mavericks’ star Luka Doncic during practice and the Hornets’ future. The interview is edited for brevity and clarity.`,
    "category": "business"
  }

export default function ArticlePage() {
  return (
    <Stack spacing={2} direction="column">
      <Card sx={{ height: '180px', width: 1, borderRadius: 0, border: 0}}>
        <Box>
          <IconButton sx={{zIndex: 1000, borderRadius: 10000, opacity: 0.75}} variant="solid" color="neutral" size="sm">
            <ArrowBack />
          </IconButton>
        </Box>
        <CardCover>
          <img
            src={article.image}
            loading="lazy"
            alt=""
          />
        </CardCover>
        <CardCover
          sx={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
          }}
        />
        <CardContent sx={{ justifyContent: 'flex-end' }}>
          <Typography level="title-lg" textColor="#fff">
            {article.title}
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            <Typography
              startDecorator={<Newspaper />}
              level="body-xs"
              textColor="neutral.300"
            >
              {article.source}
            </Typography>
            <Typography
              endDecorator={<AccessTime />}
              level="body-xs"
            >
              {article.time}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Stack spacing={1} direction="column" px={2}>
        <Typography level="body-sm">
          {article.body}
        </Typography >
    </Stack>
    </Stack>
  );
}