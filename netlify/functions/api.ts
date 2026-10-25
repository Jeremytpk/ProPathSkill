import serverless from "serverless-http";
import { createApp } from "../../server/app";

/** The ProPath API on Netlify. Requests to /api/* are routed here (see netlify.toml). */
const app = createApp();

export const handler = serverless(app, {
  request(req: any) {
    // Requests may arrive under the function's own path; the routes expect /api/...
    req.url = req.url.replace(/^\/\.netlify\/functions\/api(?=\/|$)/, "/api");
  },
});
