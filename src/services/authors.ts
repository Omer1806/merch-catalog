import { supabase } from '../lib/supabase';
import type { Author } from '../types/author';

export async function getAuthors(): Promise<Author[]> {
  console.log("🚀 getAuthors START");

  const { data, error } = await supabase
    .from("authors")
    .select("*");

  console.log("Authors data:", data);
  console.log("Authors error:", error);

  if (error) throw new Error(error.message);

  return (data ?? []).map((author) => ({
    id: author.id,
    name: author.name,
    productArtist: author.name,
    location: author.location,
    bio: author.bio,
    philosophy: author.philosophy,
    avatarUrl: author.avatar_url,
    socials: {
      instagram: author.instagram,
      twitter: author.twitter,
      threads: author.threads,
      orderForm: author.order_form,
    },
    extraLinks: author.extra_links ?? [],
  })) as Author[];
}

export async function addAuthor(author: Author) {
  const { error } = await supabase.from('authors').insert([
    {
      id: author.id,
      name: author.name,
      location: author.location,
      bio: author.bio,
      philosophy: author.philosophy,
      avatar_url: author.avatarUrl,
      instagram: author.socials.instagram,
      twitter: author.socials.twitter,
      threads: author.socials.threads,
      order_form: author.socials.orderForm,
      extra_links: author.extraLinks,
    },
  ]);

  if (error) throw new Error(error.message);
}

export async function updateAuthor(author: Author) {
  const { error } = await supabase
    .from('authors')
    .update({
      name: author.name,
      location: author.location,
      bio: author.bio,
      philosophy: author.philosophy,
      avatar_url: author.avatarUrl,
      instagram: author.socials.instagram,
      twitter: author.socials.twitter,
      threads: author.socials.threads,
      order_form: author.socials.orderForm,
      extra_links: author.extraLinks,
    })
    .eq('id', author.id);

  if (error) throw new Error(error.message);
}
