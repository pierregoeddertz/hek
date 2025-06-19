import { NextResponse } from 'next/server';

export async function GET() {
  // In real scenario fetch from CMS or DB.
  const article = {
    id: 'latest',
    title: 'Neueste Nachricht: Launch unserer App',
    image: 'https://picsum.photos/seed/latest/1200/800',
    link: '/news/latest'
  };
  return NextResponse.json(article);
} 