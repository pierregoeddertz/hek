import { supabase } from '../supabase';

// Database types
export interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  excerpt?: string;
  in_slideshow: boolean;
  created_at: string;
}

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

export class NewsService {
  // Get all news articles
  static async getAllNews(): Promise<NewsArticle[]> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return [];
    }

    return data || [];
  }

  // Get the latest news article
  static async getLatestNewsArticle(): Promise<NewsArticle | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning null');
      return null;
    }

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest news article:', error);
      return null;
    }

    return data;
  }

  // Get slideshow articles
  static async getSlideshowArticles(): Promise<NewsArticle[]> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('in_slideshow', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching slideshow articles:', error);
      return [];
    }

    return data || [];
  }

  // Get slideshow content: latest article + slideshow articles
  static async getSlideshowContent(): Promise<NewsArticle[]> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const [latestArticle, slideshowArticles] = await Promise.all([
      this.getLatestNewsArticle(),
      this.getSlideshowArticles(),
    ]);

    const allSlideshowArticles: NewsArticle[] = [];

    // Add latest article first (if it has an image)
    if (latestArticle && latestArticle.image_url) {
      allSlideshowArticles.push(latestArticle);
    }

    // Add slideshow articles (excluding the latest if it's already in slideshow)
    slideshowArticles.forEach(article => {
      if (article.image_url && article.id !== latestArticle?.id) {
        allSlideshowArticles.push(article);
      }
    });

    return allSlideshowArticles;
  }

  // Create a new news article
  static async createArticle(article: Omit<NewsArticle, 'id' | 'created_at'>): Promise<NewsArticle | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot create article');
      return null;
    }

    const { data, error } = await supabase
      .from('news')
      .insert(article)
      .select()
      .single();

    if (error) {
      console.error('Error creating news article:', error);
      return null;
    }

    return data;
  }

  // Update a news article
  static async updateArticle(id: string, updates: Partial<Omit<NewsArticle, 'id' | 'created_at'>>): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot update article');
      return false;
    }

    const { error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating news article:', error);
      return false;
    }

    return true;
  }

  // Toggle slideshow status
  static async toggleSlideshow(id: string, inSlideshow: boolean): Promise<boolean> {
    return this.updateArticle(id, { in_slideshow: inSlideshow });
  }

  // Delete a news article
  static async deleteArticle(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot delete article');
      return false;
    }

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting news article:', error);
      return false;
    }

    return true;
  }
} 