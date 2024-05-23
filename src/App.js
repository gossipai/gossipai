import { AuthProvider } from './firebase/auth';
import logo from './logo.svg';
import './App.css';
import { Stack, Typography, Card, CardOverflow, Chip, AspectRatio, CardContent, TabPanel } from '@mui/joy';
import Layout from './Layout';
import ForYouPage from './ForYouPage';
import ArticlePage from './ArticlePage';

function App() {
  return (
    <>
      <TabPanel value="foryoupage" sx={{p:0}}>
        <ArticlePage />
      </TabPanel>
    </>
  );
}

export default App;
