'use client';

import Dragger from "@/components/Dragger/Dragger";
import Card from "@/components/Card/Card";

type Article = {
  title: string;
  time: string;
  date: string;
  image: string;
  ratio: '1:1' | '4:5' | '9:16' | '16:9';
};

const baseSeed = 'ratio';
const ratioPattern: Article['ratio'][] = ['1:1', '4:5', '16:9', '9:16'];

const articles: Article[] = Array.from({ length: 8 }, (_, idx) => {
  const ratio = ratioPattern[idx % ratioPattern.length];
  const seed = `${baseSeed}${idx + 1}`;
  // choose dimensions according to ratio
  const sizeMap = {
    '1:1': { w: 800, h: 800 },
    '4:5': { w: 800, h: 1000 },
    '16:9': { w: 1600, h: 900 },
    '9:16': { w: 1080, h: 1920 },
  } as const;
  const { w, h } = sizeMap[ratio];
  return {
    title: `Beispielartikel ${ratio}`,
    time: `12:${(idx * 15).toString().padStart(2, '0')}`,
    date: '19.05.2025',
    image: `https://picsum.photos/seed/${seed}/${w}/${h}`,
    ratio,
  } satisfies Article;
});

export default function NewsPage() {
  return (
    <main style={{ padding: '4rem 0' }}>
      <Dragger>
        {articles.map((article, idx) => (
          <Card key={idx} {...article} />
        ))}
      </Dragger>
    </main>
  );
} 