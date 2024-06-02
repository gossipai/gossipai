import { CircularProgress, Modal, ModalDialog, Stack, Button, Typography, Box, Avatar } from '@mui/joy';
import ArticlePage from './ArticlePage';
import NewsCardSwipe from '../components/NewsCardSwipe';
import Layout from '../components/Layout';
import { collection, getDocs, orderBy, query, where, limit, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../firebase/auth';
import { useEffect, useState } from 'react';
import { PsychologyAlt } from '@mui/icons-material';

export default function ForYouPage() {

  const { authUser } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
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
      limit(1)
    );

    try {
      const querySnapshot = await getDocs(q);
      const article = querySnapshot.docs[0]
      setArticle(
        {
          id: querySnapshot.docs[0].id,
          ...article.data()
        }
      );
    } catch (error) {
      console.log("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  const skipArticle = () => {
    setLoading(true);
    const articleRef = doc(db, "finalNews", article.id);
    updateDoc(articleRef, {recommendedUsers: [...article.recommendedUsers.filter(u => u !== authUser.uid)]})
    .then(async ()=> {
      const userRef = doc(db, "users", authUser.uid);
      const userDoc = await getDoc(userRef);
      const user = userDoc.data();
      const categories = user.categories || {};
      categories[article.category] = Math.max((categories[article.category] || 0) - 0.01, 0);
      await setDoc(userRef, { categories }, { merge: true });
      setArticle(null);
    })
    .catch((error) => {
      alert("Error updating document: ", error);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    if (article) {
      return;
    }
    fetchNews();
  }, [article]);

  return (
    <Layout>
      <Stack spacing={2} p={2} direction="column" height={1}>
        <Typography level="h4">Recommended For You</Typography>
        {loading && 
          <Box sx={{textAlign: "center"}}><CircularProgress /></Box>
        }
        {!article && !loading &&
        <Box sx={{textAlign: "center"}}>
          <Avatar size="lg" color="primary" sx={{mx: "auto", height:60, width:60}}>
            <PsychologyAlt sx={{fontSize: 40}}/>
          </Avatar>
          <Typography level="title-lg">
            No recent recommendations
          </Typography>
          <Typography level="body-sm">
            You can read more articles on Discover page, and check back later!
          </Typography>
        </Box>
        }
        { article && !loading &&
          <Box flexGrow={1}>
            <NewsCardSwipe key={article.id} article={article} onClick={handleArticleClick} />
          </Box>
        }
        { article && !loading &&
          <Stack direction="row" spacing={2}>
            <Button color="neutral" variant="soft" onClick={skipArticle} sx={{flexGrow:1}}>
              Skip
            </Button>
            <Button color="primary" variant="solid"
            onClick={()=>{
              setSelectedArticle(article.id);
              skipArticle();
            }}
            sx={{flexGrow:1}}>
              Read Article
            </Button>
          </Stack>
        }
      </Stack>
      <Modal open={selectedArticle !== null} onClose={() => setSelectedArticle(null)}>
        <ModalDialog layout="fullscreen" sx={{p:0, height: "100dvh"}}>
          <ArticlePage articleId={selectedArticle} onBack={() => setSelectedArticle(null)}/>
        </ModalDialog>
      </Modal>
    </Layout>
  );
}
