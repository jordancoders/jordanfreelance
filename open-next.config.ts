import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
    },
  },
  transform: {
    init: {
      propagateIsrMetadata: false,
    },
  },
};

export default config;
