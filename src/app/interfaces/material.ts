export interface MaterialBase {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  image_url: string;
}

export interface MaterialDetail extends MaterialBase {
  content: string;
  keywords: string[];
  order: number;
  created_at: string;
  updated_at: string;
}
