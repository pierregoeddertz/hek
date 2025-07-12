import Hugger from '../../components/layout/hugger/Hugger';
import styles from './Product.module.css';
import Zoomshow from '@/components/entities/zoomshow/Zoomshow';
import { NewsService } from '@/lib/services/news';

interface ProductProps {
  productName: string;
  description: string;
  features: string[];
}

// Server-side data fetching
async function getSlideshowData() {
  try {
    const newsArticles = await NewsService.getSlideshowContent();
    return newsArticles.map((article: any, index: number) => ({
      id: article.id,
      image: article.image_url || '',
      title: article.title,
      subtitle: article.subtitle,
      index: String(index + 1).padStart(2, '0'),
      label: article.title,
    }));
  } catch (error) {
    console.error('Error fetching slideshow data:', error);
    return [];
  }
}

export default async function Product({ productName, description, features }: ProductProps) {
  const slideshowData = await getSlideshowData();

  return (
    <>
      <Hugger>
        <Zoomshow slides={slideshowData} useDatabase={false} />
      </Hugger>
    </>
  );
}
