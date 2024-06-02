import { functions } from '../firebase/firebase';
import { httpsCallable } from 'firebase/functions';
import {
  Box, Stack, Typography, Card, IconButton, CardCover, CardContent, CircularProgress, Tabs, Tab, TabPanel, Input, Button, Sheet
} from '@mui/joy';
import { AccessTime, ArrowBack, AutoAwesome, Newspaper, Try } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import formatTimePassed from '../utils/formatTimePassed';
import { useAuth } from '../firebase/auth';
import TabListStyled from '../components/TabListStyled';
import ChatMessage from '../components/ChatMessage';

var questionAsked = false;

export default function ArticlePage({ articleId, onBack }) {
  const { authUser } = useAuth();
  const [article, setArticle] = useState({});
  const [summary, setSummary] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [answerLoading, setAnswerLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docSnap = await getDoc(doc(db, "news", articleId));
        if (docSnap.exists()) {
          const articleData = docSnap.data();
          setArticle(articleData);
          if (!articleData.summary) {
            const summaryResult = await httpsCallable(functions, 'getArticleSummary')({ articleId: docSnap.id, body: articleData.body });
            setSummary(summaryResult.data);
          } else {
            setSummary(articleData.summary);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    };

    fetchArticle();
  }, [articleId]);

  useEffect(() => {
    const updateUserReadArticles = async () => {
      try {
        const userRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userRef);
        const user = userDoc.data();
        const newsRead = user.newsRead || [];
        const categories = user.categories || {};

        if (!newsRead.includes(articleId) && article.category) {
          newsRead.push(articleId);
          categories[article.category] = Math.min((categories[article.category] || 0) + 0.02, 1);
          await setDoc(userRef, { newsRead, categories }, { merge: true });
        }
      } catch (error) {
        console.log("Error updating document:", error);
      }
    };

    const timer = setTimeout(updateUserReadArticles, 10000);
    return () => clearTimeout(timer);
  }, [articleId, article.category, authUser.uid]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput) return;

    const newMessage = { owner: "user", text: messageInput };
    setChatMessages(prevMessages => [...prevMessages, newMessage]);
    setMessageInput("");
    setAnswerLoading(true);

    try {
      const result = await httpsCallable(functions, 'getArticleAnswer')({ body: article.body, question: messageInput });
      const answerMessage = { owner: "bot", text: result.data };
      setChatMessages(prevMessages => [...prevMessages, answerMessage]);

      const userRef = doc(db, "users", authUser.uid);
      const userDoc = await getDoc(userRef);
      const user = userDoc.data();
      const categories = user.categories || {};
      if (!questionAsked && article.category && (categories[article.category] !== 1)) {
        categories[article.category] = Math.min((categories[article.category] || 0) + 0.01, 1);
        await setDoc(userRef, { categories }, { merge: true });
      }
      questionAsked = true;
    } catch (error) {
      console.log(error);
    } finally {
      setAnswerLoading(false);
    }
  };

  return (
    <Stack spacing={2} direction="column" sx={{ height: 1 }}>
      {article && (
        <>
          <Card sx={{ height: '180px', width: 1, borderRadius: 0, border: 0 }}>
            <Box>
              <IconButton sx={{ zIndex: 1000, borderRadius: 10000, opacity: 0.75 }}
                variant="solid"
                color="neutral"
                size="sm"
                onClick={onBack}
              >
                <ArrowBack />
              </IconButton>
            </Box>
            <CardCover>
              <img src={article.image} loading="lazy" alt="" />
            </CardCover>
            <CardCover sx={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
            }} />
            <CardContent sx={{ justifyContent: 'flex-end' }}>
              <Typography level="title-lg" textColor="#fff">
                {article.title}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography startDecorator={<Newspaper />} level="body-xs" textColor="neutral.300">
                  {article.source}
                </Typography>
                <Typography endDecorator={<AccessTime />} level="body-xs">
                  {formatTimePassed(article.dateTime)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          <Tabs sx={{ overflowY: "scroll", height: 1, marginTop: "0px!important" }}>
            <TabListStyled>
              <Tab><AutoAwesome fontSize="sm" /> Summary</Tab>
              <Tab><Newspaper fontSize="sm" /> Article</Tab>
              <Tab><Try fontSize="sm" /> Ask</Tab>
            </TabListStyled>
            <TabPanel keepMounted sx={{ overflowY: "scroll" }} value={0}>
              {summary ? (
                <Typography level="body-sm">{summary}</Typography>
              ) : (
                <Box textAlign="center">
                  <CircularProgress><AutoAwesome fontSize="lg" color="primary" /></CircularProgress>
                  <Typography level="body-sm">Generating AI summary...</Typography>
                </Box>
              )}
            </TabPanel>
            <TabPanel keepMounted sx={{ overflowY: "scroll" }} value={1}>
              {article.body && (
                <Typography level="body-sm">
                  {article.body.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </Typography>
              )}
            </TabPanel>
            <TabPanel keepMounted sx={{ overflowY: "scroll", height: 1, padding: 0 }} value={2}>
              <Stack direction="column" justifyContent="space-between" height={1}>
                <Stack direction="column" flexGrow={1} spacing={1} p={2} ref={chatContainerRef}>
                  {chatMessages.map((message, index) =>
                    <ChatMessage key={index} owner={message.owner} message={message.text} />
                  )}
                  {answerLoading && (
                    <Box textAlign="center">
                      <CircularProgress><AutoAwesome fontSize="lg" color="primary" /></CircularProgress>
                    </Box>
                  )}
                </Stack>
                <Sheet variant="soft" sx={{ p: 1.5, borderTop: 1, borderColor: "divider" }}>
                  <form onSubmit={handleSendMessage}>
                    <Stack direction="row" spacing={1}>
                      <Input value={messageInput} placeholder="Ask a question..." sx={{ flexGrow: 1 }} onChange={(e) => setMessageInput(e.target.value)} />
                      <Button color="primary" type="submit" disabled={answerLoading} loading={answerLoading}>Send</Button>
                    </Stack>
                  </form>
                </Sheet>
              </Stack>
            </TabPanel>
          </Tabs>
        </>
      )}
    </Stack>
  );
}
