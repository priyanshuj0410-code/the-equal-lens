import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

// Used by the Sanity CLI to run/deploy the standalone Studio:
//   npx sanity dev      (preview locally at http://localhost:3333)
//   npx sanity deploy   (host it free at <name>.sanity.studio)
export default defineCliConfig({
  api: { projectId, dataset },
  deployment: { appId: "ibo2il3fx31lxitiqj5t4opd" },
});
