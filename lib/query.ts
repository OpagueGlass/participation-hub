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

const convertToConsent = (data: {
  consent: boolean;
  consent_updated_at: string;
  profiles: {
    id: number;
  };
}) => {
  const { consent, consent_updated_at, profiles } = data;
  return { consent, consentUpdatedAt: new Date(consent_updated_at), id: profiles.id };
};

export async function isUserResearcher(id: string) {
  const { data, error } = await supabase.from("researchers").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw error;
  }
  return !!data;
}

export async function getUserCollections(auth_id: string, limit?: number) {
  const { data, error } = await supabase
    .from("profile_collections")
    .select(
      `collections(status(*), 
        created_at,
        description,
        id,
        participants,
        title
       ),
       profiles(auth_id)
       `,
    )
    .eq("profiles.auth_id", auth_id)
    .order("collections(created_at)", { ascending: false })
    .limit(limit || Infinity);
  if (error || !data) {
    throw error;
  }
  return data.map(({ collections }) => convertToCollection(collections));
}

export async function getResearcherCollections(researcher_id: string) {
  const { data, error } = await supabase
    .from("researcher_collections")
    .select(
      `collections(status(*), 
        created_at,
        description,
        id,
        participants,
        title,
        collection_papers(*),
        collection_images(*)
       )`,
    )
    .eq("researcher_id", researcher_id)
    .order("collections(created_at)", { ascending: false });
  if (error || !data) {
    throw error;
  }
  return data.map(({ collections }) => ({
    ...convertToCollection(collections),
    papers: collections.collection_papers.length,
    images: collections.collection_images.length,
  }));
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
        collection_images(*)`,
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

export async function getConsent(auth_id: string, collection_id: string) {
  const { data, error } = await supabase
    .from("profile_collections")
    .select(
      `
      consent,
      consent_updated_at,
      profiles(id, auth_id)
      `,
    )
    .eq("profiles.auth_id", auth_id)
    .eq("collection_id", collection_id)
    .single();

  if (error || !data) {
    throw error;
  }
  return convertToConsent(data);
}

export async function updateConsent(id: number, collection_id: string, consent: boolean) {
  const { error } = await supabase
    .from("profile_collections")
    .update({ consent, consent_updated_at: new Date().toISOString() })
    .eq("profile_id", id)
    .eq("collection_id", collection_id);

  if (error) {
    throw error;
  }
}

export async function getQuickStats(auth_id: string) {
  const { count, error } = await supabase
    .from("profile_collections")
    .select("collection_id, profiles(auth_id)", { count: "exact", head: true })
    .eq("profiles.auth_id", auth_id);
  if (error) {
    throw error;
  }

  const { count: activeCount, error: activeError } = await supabase
    .from("profile_collections")
    .select("collections(status), profiles(auth_id)", { count: "exact", head: true })
    .eq("profiles.auth_id", auth_id)
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

export async function getResearchParticipant(collection_id: string) {
  const { data, error } = await supabase
    .from("profile_collections")
    .select(
      `
      collection_id,
      consent,
      joined_at,
      profiles(
        id,
        email
      )
      `,
    )
    .eq("collection_id", collection_id);

  if (error) {
    throw error;
  }

  return data?.map((row) => ({
    id: row.profiles.id,
    email: row.profiles.email,
    consent: row.consent,
    joinedAt: new Date(row.joined_at),
  }));
}

export async function addPaperToCollection(
  collection_id: string,
  paper: {
    title: string;
    authors: string;
    journal: string;
    description: string;
    published_at: string;
    link: string;
  },
) {
  const { title, authors, journal, description, published_at, link } = paper;
  const { error } = await supabase.from("collection_papers").insert({
    collection_id,
    title,
    authors,
    journal,
    description,
    published_at,
    link,
  });
  return { error };
}

export const inviteParticipantsToCollection = async (collection_id: string, emails: string[]) => {
  const { data, error } = await supabase.functions.invoke("invite-participants", {
    body: { collection_id, emails },
  });

  return { data, error }
};