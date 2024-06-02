import { functions } from '../firebase/firebase';
import { httpsCallable } from 'firebase/functions';
import { Box, Stack, Typography, Card, IconButton, CardCover, CardContent, CircularProgress, Tabs, Tab, TabPanel, Input, Button, Sheet } from '@mui/joy';
import { AccessTime, ArrowBack, AutoAwesome, Newspaper, Try } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import formatTimePassed from '../utils/formatTimePassed';
import { useAuth } from '../firebase/auth';
import TabListStyled from '../components/TabListStyled';
import ChatMessage from '../components/ChatMessage';

export default function ArticlePage({ articleId, onBack }) {
  const { authUser } = useAuth();
  const [article, setArticle] = useState({});
  const [summary, setSummary] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [answerLoading, setAnswerLoading] = useState(false);
  
  const isQuestionAsked = false;
  const userRef = doc(db, "users", authUser.uid);
  const userDoc = getDoc(userRef).data();

  const chatContainerRef = useRef(null);

  const handleMessageInput = (e) => {
    setMessageInput(e.target.value);
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage();
  }

  const sendMessage = async () => {
    if (messageInput) {
      const newMessage = {
        owner: "user",
        text: messageInput
      };
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      setMessageInput("");
      setAnswerLoading(true);
      httpsCallable(functions, 'getArticleAnswer')({ body: article.body, question: messageInput })
      .then((result) => {
        const answerMessage = {
          owner: "bot",
          text: result.data
        };
        setChatMessages(prevMessages => [...prevMessages, answerMessage]);
        setAnswerLoading(false);
        const articleCategory = article.category;
        const categories = userDoc.categories;
        if (!isQuestionAsked && articleCategory && categories[articleCategory] !== 1){
          categories[articleCategory] += 0.01;
          setDoc(userRef, { categories }, { merge: true });
        }
        isQuestionAsked = true;
      })
      .catch((error) => {
        console.log(error);
        setAnswerLoading(false);
      });
    }
  }

  useEffect(() => {
    let isMounted = true;

    getDoc(doc(db, "news", articleId)).then((doc) => {
      if (isMounted) {
        if (doc.exists()) {
          let articleData = doc.data();
          if (!articleData.summary){
            httpsCallable(functions, 'getArticleSummary')({ articleId: doc.id, body: articleData.body })
            .then((result) => {
              setSummary(result.data);
            })
            .catch((error) => {
              console.log(error);
            });
          } else {
            setSummary(articleData.summary);
          }
          setArticle(articleData);
        } else {
          console.log("No such document!");
        }
      }
    }).catch((error) => {
      if (isMounted) {
        console.log("Error getting document:", error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  useEffect(() => {
    let isMounted = true;
    if(!article.category){
      return;
    }
    const timer = setTimeout(() => {
      const updateUserReadArticles = async () => {
        if (isMounted) {
          const user = userDoc;
          const newsRead = user.newsRead || [];
          const categories = user.categories;
          if (!newsRead.includes(articleId)) {
            newsRead.push(articleId);
            const articleCategory = article.category;
            if (articleCategory) {
              if (categories[articleCategory] && categories[articleCategory] <= 0.98) {
                categories[articleCategory] += 0.02;
              }
            }
          }
          await setDoc(userRef, { newsRead, categories }, { merge: true });
        } else if (isMounted) {
          console.log("No such document!");
        }
      };

      updateUserReadArticles().catch((error) => {
        if (isMounted) {
          console.log("Error updating document:", error);
        }
      });
    }, 10000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [article.category, articleId, authUser.uid]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <>
      { article &&
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
          <Tabs sx={{overflowY: "scroll", height:1, marginTop: "0px!important"}}>
            <TabListStyled>
              <Tab>
                <AutoAwesome fontSize="sm" />
                Summary
              </Tab>
              <Tab>
                <Newspaper fontSize="sm" />
                Article
              </Tab>
              <Tab>
                <Try fontSize="sm" />
                Ask
              </Tab>
            </TabListStyled>
            <TabPanel keepMounted sx={{overflowY:"scroll"}} value={0}>
              {
                article && summary && (
                  <Typography level="body-sm">
                    {summary}
                  </Typography>
                )
              }{
                article && !summary && (
                  <Box textAlign="center">
                    <CircularProgress>
                      <AutoAwesome fontSize="lg" color="primary" />
                    </CircularProgress>
                    <Typography level="body-sm">
                      Generating AI summary...
                    </Typography>
                  </Box>
                )
              }
            </TabPanel>
            <TabPanel keepMounted sx={{overflowY:"scroll"}} value={1}>
              {
                article && (
                  <Typography level="body-sm">
                    {article.body && article.body.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </Typography>
                )
              }
            </TabPanel>
            <TabPanel keepMounted sx={{overflowY:"scroll", height:1, padding:0}} value={2}>
              <Stack direction="column" justifyContent="space-between" height={1}>
                <Stack direction="column" flexGrow={1} spacing={1} p={2} overflow="auto" overflowY="scroll" ref={chatContainerRef}>
                  {
                    chatMessages.map((message, index) => 
                      <ChatMessage key={index} owner={message.owner} message={message.text}/>
                    )
                  }
                  {
                    answerLoading && (
                      <Box textAlign="center">
                        <CircularProgress>
                          <AutoAwesome fontSize="lg" color="primary" />
                        </CircularProgress>
                      </Box>
                    )
                  }
                </Stack>
                <Sheet variant="soft" sx={{p:1.5, borderTop:1, borderColor:"divider"}}>
                  <form onSubmit={handleSendMessage}>
                    <Stack direction="row" spacing={1}>
                      <Input value={messageInput} placeholder="Ask a question..." sx={{flexGrow:1}} onChange={handleMessageInput}/>
                      <Button color="primary" type="submit" disabled={answerLoading} loading={answerLoading}>
                        Send
                      </Button>
                    </Stack>
                  </form>
                </Sheet>
              </Stack>
            </TabPanel>
          </Tabs>
        </Stack>
      }
    </>
  );
}
