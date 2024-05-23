import { Stack, Typography, Card, CardOverflow, Chip, AspectRatio, CardContent } from '@mui/joy';
import NewsCard from './components/NewsCard';

const news = [
  {
    "title": "Hornets forward Grant Williams on Luka Doncic, TV rights, and helping Hornets win again",
    "source": "ArcaMax",
    "time": "5m ago",
    "image": "https://resources.arcamax.com/newspics/289/28994/2899440.gif",
    "category": "business"
  },
  {
    "title": "Negative Govt Policies Causing Nigerians Pains -Catholic Archbishop",
    "source": "New Telegraph",
    "time": "14m ago",
    "image": "https://newtelegraphng.com/wp-content/uploads/2024/05/Alfred-Adewale-Martins.jpg",
    "category": "business"
  },
  {
    "title": "Sri Lanka questions UN rights report on enforced disappearances | Law-Order",
    "source": "Devdiscourse",
    "time": "20m ago",
    "image": "https://www.devdiscourse.com/remote.axd?https://devdiscourse.blob.core.windows.net/imagegallery/27_05_2019_11_52_07_9391333.jpg?width=920&format=jpeg",
    "category": "business"
  },
  {
    "title": "Hornets forward Grant Williams on Luka Doncic, TV rights, and helping Hornets win again",
    "source": "ArcaMax",
    "time": "5m ago",
    "image": "https://resources.arcamax.com/newspics/289/28994/2899440.gif",
    "category": "business"
  },
  {
    "title": "Negative Govt Policies Causing Nigerians Pains -Catholic Archbishop",
    "source": "New Telegraph",
    "time": "14m ago",
    "image": "https://newtelegraphng.com/wp-content/uploads/2024/05/Alfred-Adewale-Martins.jpg",
    "category": "business"
  },
  {
    "title": "Sri Lanka questions UN rights report on enforced disappearances | Law-Order",
    "source": "Devdiscourse",
    "time": "20m ago",
    "image": "https://www.devdiscourse.com/remote.axd?https://devdiscourse.blob.core.windows.net/imagegallery/27_05_2019_11_52_07_9391333.jpg?width=920&format=jpeg",
    "category": "business"
  },
  {
    "title": "Hornets forward Grant Williams on Luka Doncic, TV rights, and helping Hornets win again",
    "source": "ArcaMax",
    "time": "5m ago",
    "image": "https://resources.arcamax.com/newspics/289/28994/2899440.gif",
    "category": "business"
  },
  {
    "title": "Negative Govt Policies Causing Nigerians Pains -Catholic Archbishop",
    "source": "New Telegraph",
    "time": "14m ago",
    "image": "https://newtelegraphng.com/wp-content/uploads/2024/05/Alfred-Adewale-Martins.jpg",
    "category": "business"
  },
  {
    "title": "Sri Lanka questions UN rights report on enforced disappearances | Law-Order",
    "source": "Devdiscourse",
    "time": "20m ago",
    "image": "https://www.devdiscourse.com/remote.axd?https://devdiscourse.blob.core.windows.net/imagegallery/27_05_2019_11_52_07_9391333.jpg?width=920&format=jpeg",
    "category": "business"
  },
]

export default function ForYouPage() {
  return (
    <Stack spacing={2} p={2} direction="column">
        {news.map(article => 
            <NewsCard article={article} />
        )}
    </Stack>
  );
}