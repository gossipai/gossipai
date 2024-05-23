import { CircularProgress, Modal, ModalDialog, Stack, Button, Typography, Box, Avatar } from '@mui/joy';
import ArticlePage from './ArticlePage';
import NewsCard from '../components/NewsCard';
import Layout from '../components/Layout';
import { collection, getDocs, orderBy, query, where, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../firebase/auth';
import { useEffect, useState } from 'react';
import { PsychologyAlt } from '@mui/icons-material';

export default function ForYouPage() {

  const { authUser } = useAuth();

  const [news, setNews] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleArticleClick = (id) => {
    setSelectedArticle(id);
  }

  const fetchNews = async () => {
    setLoading(true);
    let q = query(
      collection(db, "finalNews"), 
      where("recommendedUsers", "array-contains", authUser.uid), 
      orderBy("dateTime", "desc"),
      limit(10)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    try {
      const querySnapshot = await getDocs(q);
      const newsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      setNews(prevNews => [...prevNews, ...newsArray]);
      setLastDoc(lastVisible);
      setHasMore(querySnapshot.docs.length === 10);
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <Layout>
      <Stack spacing={2} p={2} direction="column">
        {news && news.length == 0 &&
        <Box sx={{textAlign: "center"}}>
          <Avatar size="lg" color="primary" sx={{mx: "auto", height:60, width:60}}>
            <PsychologyAlt sx={{fontSize: 40}}/>
          </Avatar>
          <Typography>
            No recommended news available for you yet.
          </Typography>
          <Typography>
            Please browse more articles on the Discover page and help us to get to know you better!
          </Typography>
        </Box>
        }
        {news && news.length>0 && news.map((article) => 
          <NewsCard key={article.id} article={article} onClick={handleArticleClick} />
        )}
        {hasMore && (
          <Button loading={loading} color="primary" onClick={fetchNews}>
            Load More
          </Button>
        )}
      </Stack>
      <Modal open={selectedArticle !== null} onClose={() => setSelectedArticle(null)}>
        <ModalDialog layout="fullscreen" sx={{p:0, height: "100vh"}}>
          <ArticlePage articleId={selectedArticle} onBack={() => setSelectedArticle(null)}/>
        </ModalDialog>
      </Modal>
    </Layout>
  );
}
