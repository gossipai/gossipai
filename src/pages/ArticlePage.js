import { Box, Stack, Typography, Card, IconButton, CardCover, CardContent } from '@mui/joy';
import { AccessTime, ArrowBack, Newspaper } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import formatTimePassed from '../utils/formatTimePassed'
import { useNavigate } from 'react-router-dom';

export default function ArticlePage({ articleId, onBack }) {

  const navigate = useNavigate();

  const [ article, setArticle ] = useState({});

  useEffect(() => {
    getDoc(doc(db, "news", articleId)).then((doc) => {
      if (doc.exists()) {
        setArticle(doc.data());
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    
  }, [articleId]);

  return (
    <Stack spacing={2} direction="column" sx={{height:1}}>
        <Card sx={{ height: '180px', width: 1, borderRadius: 0, border: 0}}>
          <Box>
            <IconButton sx={{zIndex: 1000, borderRadius: 10000, opacity: 0.75}} 
            variant="solid"
            color="neutral" 
            size="sm"
            onClick={onBack}
            >
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
          <CardContent sx={{ justifyContent: 'flex-end'}}>
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
                {formatTimePassed(article.dateTime)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
        <Stack spacing={1} direction="column" px={2} sx={{overflow:"scroll"}}>
          <Typography level="body-sm">
            {article.body}
          </Typography >
      </Stack>
    </Stack>
  );
}