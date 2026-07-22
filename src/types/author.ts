export interface AuthorLink {
  label: string;
  url: string;
}

export interface Author {
  id: string;
  name: string;
  productArtist?: string;
  location: string;
  bio: string;
  philosophy: string;
  avatarUrl: string;
  socials: {
    twitter?: string;
    instagram?: string;
    threads?: string;
    orderForm?: string;
  };
  extraLinks?: AuthorLink[];
}
