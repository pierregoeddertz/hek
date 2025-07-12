import Hugger from '@/components/layout/hugger/Hugger';
import Zoomshow from '@/components/entities/zoomshow/Zoomshow';
import { NewsService } from '@/lib/services/news';
import Introducer from '@/components/entities/Introducer/Introducer';
import Dragger from '@/components/entities/Dragger/Dragger';

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

export default async function Home() {
  const slideshowData = await getSlideshowData();

  return (
    <>
      <Hugger>
        <Zoomshow slides={slideshowData} useDatabase={false} />
      </Hugger>

      <Hugger vluMax padding >
        <Introducer 
          title="Willkommen bei HEK"
          subtitle="Entdecken Sie unsere nachhaltigen Energielösungen"
          index="01"
          label="Über uns"
        />
      </Hugger>

      <Hugger vluMax >
        <Dragger centerFirst>
          <div style={{ width: '300px', height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Draggable Item 1</span>
          </div>
          <div style={{ width: '300px', height: '200px', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Draggable Item 2</span>
          </div>
          <div style={{ width: '300px', height: '200px', backgroundColor: '#d0d0d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Draggable Item 3</span>
          </div>
          <div style={{ width: '300px', height: '200px', backgroundColor: '#c0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Draggable Item 4</span>
          </div>
        </Dragger>
      </Hugger>
    </>
  );
}


