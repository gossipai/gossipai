import { Stack } from '@mui/joy';
import NewsCard from '../components/NewsCard';
import Layout from '../components/Layout';

const news = [
  { "id": 123241521,
    "title": "Hornets forward Grant Williams on Luka Doncic, TV rights, and helping Hornets win again",
    "source": "ArcaMax",
    "time": "5m ago",
    "image": "https://resources.arcamax.com/newspics/289/28994/2899440.gif",
    "category": "business"
  },
  { "id": 54324523,
    "title": "Negative Govt Policies Causing Nigerians Pains -Catholic Archbishop",
    "source": "New Telegraph",
    "time": "14m ago",
    "image": "https://newtelegraphng.com/wp-content/uploads/2024/05/Alfred-Adewale-Martins.jpg",
    "category": "business"
  }
]

export default function ForYouPage() {
  return (
    <Layout>
      <Stack spacing={2} p={2} direction="column">
          {news.map(article => 
            <NewsCard article={article} />
          )}
      </Stack>
    </Layout>
  );
}