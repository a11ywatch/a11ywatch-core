import { watcherCrawl } from "@app/core/utils/watcher_crawl";
import { crawlEmitter, crawlTrackingEmitter } from "@app/event";
import { getKey } from "@app/event/crawl-tracking";
import { Response } from "express";
import { getHostName } from "./get-host";

// crawl website and wait for finished emit event to continue @return Website[] use for testing.
export const crawlHttpStream = (props, res: Response): Promise<boolean> => {
  return new Promise(async (resolve) => {
    const { url, userId } = props;

    try {
      // start site-wide crawls
      setImmediate(async () => {
        await watcherCrawl({ url, scan: true, userId });
      });
    } catch (e) {
      console.error(e);
    }

    const domain = getHostName(url);

    crawlEmitter.on(`crawl-${domain}-${userId || 0}`, (source) => {
      const data = source?.data;
      const issuesFound = data.issues?.length;

      res.write(
        `${JSON.stringify({
          data,
          message: `${data?.url} has ${issuesFound} issue${
            issuesFound === 1 ? "" : "s"
          }`,
          success: true,
          code: 200,
        })},`
      );
    });

    // TODO: add flag to tell rust crawler if user was real or not instead of u32 defaults
    const key = getKey(domain, undefined, userId);

    crawlTrackingEmitter.once(`crawl-complete-${key}`, resolve);
  });
};