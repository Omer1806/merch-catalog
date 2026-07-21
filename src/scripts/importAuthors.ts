import { supabase } from "../lib/supabase";
import { AUTHORS } from "../authorsData";

async function importAuthors() {
  const authors = AUTHORS.map((author) => ({
    id: author.id,
    name: author.name,
    location: author.location,
    bio: author.bio,
    philosophy: author.philosophy,

    avatar_url: author.avatarUrl,

    instagram: author.socials?.instagram ?? null,
    twitter: author.socials?.twitter ?? null,
    threads: author.socials?.threads ?? null,
    order_form: author.socials?.orderForm ?? null,

    extra_links: author.extraLinks ?? null,
  }));

  const { error } = await supabase
    .from("authors")
    .insert(authors);

  if (error) {
    console.error(error);
    return;
  }

  console.log("✅ Автори імпортовані");
}

importAuthors();