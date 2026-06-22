import { groq } from "next-sanity";

export const teamQuery = groq`*[_type == "teamMember"] | order(order asc, name asc){
  "id": coalesce(slug.current, _id),
  name, role, pronouns, bio, photo, babyPhoto, links, order
}`;

// Per-page singleton copy: fetch the one document of the given page type.
export const pageQuery = groq`*[_type == $type][0]`;

export const programsQuery = groq`*[_type == "program" && coalesce(audience, "kid") == $audience] | order(order asc, title asc){
  "id": coalesce(slug.current, _id),
  title, summary, items, icon, order, "audience": coalesce(audience, "kid")
}`;

export const jobsQuery = groq`*[_type == "job" && status == "open"] | order(postedDate desc){
  "id": coalesce(slug.current, _id),
  title, type, location, remote, summary, responsibilities, requirements,
  compensation, applyEmail, "postedDate": postedDate, status
}`;

export const postsMetaQuery = groq`*[_type == "post" && status == "published" && coalesce(audience, "kid") == $audience] | order(date desc){
  title, "slug": slug.current, "date": date, author, excerpt, tags, cover,
  status, "audience": coalesce(audience, "kid")
}`;

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title, "slug": slug.current, "date": date, author, excerpt, tags, cover,
  status, "audience": coalesce(audience, "kid"), body
}`;

export const postSlugsQuery = groq`*[_type == "post" && status == "published" && defined(slug.current)]{
  "slug": slug.current
}`;
