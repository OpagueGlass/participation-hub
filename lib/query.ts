import { supabase } from "./supabase";
import { Tables } from "./db-types";

export type ResearchPaper = ReturnType<typeof convertToPapers>;

const convertToCollection = (data: Omit<Tables<"collections">, "status"> & { status: Tables<"status_types"> }) => {
  const { created_at, ...rest } = data;
  return { createdAt: new Date(created_at), ...rest };
};

const convertToPapers = (data: Tables<"collection_papers">) => {
  const { collection_id, published_at, ...rest } = data;
  return { publishedAt: new Date(published_at), ...rest };
};

const convertToImages = (data: Tables<"collection_images">) => {
  const { collection_id, ...rest } = data;
  return { ...rest };
};

const convertToConsent = (data: Tables<"profile_collections">) => {
  const { consent, consent_updated_at } = data;
  return { consent, consentUpdatedAt: new Date(consent_updated_at) };
};

export async function getUserCollections(profile_id: string, limit?: number) {
  const { data, error } = await supabase
    .from("profile_collections")
    .select(
      `collections(status(*), 
        created_at,
        description,
        id,
        participants,
        title
       )`
    )
    .eq("profile_id", profile_id)
    .order("collections(created_at)", { ascending: false })
    .limit(limit || Infinity);
  if (error || !data) {
    throw error;
  }
  return data.map(({ collections }) => convertToCollection(collections));
}

export async function getCollectionById(collection_id: string) {
  const { data, error } = await supabase
    .from("collections")
    .select(
      `
        status(*), 
        created_at,
        description,
        id,
        participants,
        title,
        collection_papers(*),
        collection_images(*)`
    )
    .eq("id", collection_id)
    .single();

  if (error) {
    throw error;
  }

  return {
    ...convertToCollection(data),
    papers: data.collection_papers
      .map(convertToPapers)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
    images: data.collection_images.map(convertToImages),
  };
}

export async function getConsent(profile_id: string, collection_id: string) {
  const { data, error } = await supabase
    .from("profile_collections")
    .select("*")
    .eq("profile_id", profile_id)
    .eq("collection_id", collection_id)
    .single();

  if (error) {
    throw error;
  }
  return convertToConsent(data);
}

export async function updateConsent(profile_id: string, collection_id: string, consent: boolean) {
  const { error } = await supabase
    .from("profile_collections")
    .update({ consent, consent_updated_at: new Date().toISOString() })
    .eq("profile_id", profile_id)
    .eq("collection_id", collection_id)

  if (error) {
    throw error;
  }
}

export async function getQuickStats(profile_id: string) {
  const { count, error } = await supabase
    .from("profile_collections")
    .select("collection_id", { count: "exact", head: true })
    .eq("profile_id", profile_id);

  if (error) {
    throw error;
  }

  const { count: activeCount, error: activeError } = await supabase
    .from("profile_collections")
    .select("collections(status)", { count: "exact", head: true })
    .eq("profile_id", profile_id)
    .eq("collections.status", 1)
    .not("collections", "is", null);

  if (activeError) {
    throw activeError;
  }

  return {
    totalCollections: count || 0,
    activeCollections: activeCount || 0,
  };
}
