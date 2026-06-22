import type { StructureResolver } from "sanity/structure";

// Page copy lives in one document per page (singletons), edited in place.
const SINGLETONS: { type: string; title: string }[] = [
  { type: "homePage", title: "Home" },
  { type: "aboutPage", title: "About" },
  { type: "programsPage", title: "Programs" },
  { type: "gamesPage", title: "Games" },
  { type: "blogPage", title: "Blog" },
  { type: "contactPage", title: "Contact" },
  { type: "joinPage", title: "Join" },
];

const COLLECTIONS = ["teamMember", "job", "post", "program"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Page copy")
        .child(
          S.list()
            .title("Page copy")
            .items(
              SINGLETONS.map((s) =>
                S.listItem()
                  .id(s.type)
                  .title(s.title)
                  .child(S.document().schemaType(s.type).documentId(s.type)),
              ),
            ),
        ),
      S.divider(),
      ...COLLECTIONS.map((type) => S.documentTypeListItem(type)),
    ]);
