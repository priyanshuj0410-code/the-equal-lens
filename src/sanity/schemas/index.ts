import { aboutPage } from "./aboutPage";
import { blogPage } from "./blogPage";
import { contactPage } from "./contactPage";
import { gamesPage } from "./gamesPage";
import { homePage } from "./homePage";
import { job } from "./job";
import { joinPage } from "./joinPage";
import { post } from "./post";
import { program } from "./program";
import { programsPage } from "./programsPage";
import { teamMember } from "./teamMember";
import { testimonial } from "./testimonial";

// Per-page editable copy (singletons), then collections.
export const pageTypes = [
  homePage,
  aboutPage,
  programsPage,
  gamesPage,
  blogPage,
  contactPage,
  joinPage,
];

export const schemaTypes = [...pageTypes, teamMember, job, post, program, testimonial];
