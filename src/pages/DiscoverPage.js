import { Stack, Button, CircularProgress, Modal, ModalDialog } from '@mui/joy';
import NewsCard from '../components/NewsCard';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import ArticlePage from './ArticlePage';

export default function DiscoverPage() {

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
      collection(db, "news"),
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
        {news.map((article, index) => 
          <NewsCard key={article.id} article={article} onClick={handleArticleClick} />
        )}
        {loading && <CircularProgress />}
        {!loading && hasMore && (
          <Button onClick={fetchNews}>
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