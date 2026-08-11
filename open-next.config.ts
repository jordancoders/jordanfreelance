import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
    },
  },
  dangerous: {
    disableIncrementalCache: true,
    disableTagCache: true,
  },
};

export default config;
