import { generateWebsiteScore } from "@app/core/controllers/pages/update";
import { getWebsite } from "@app/core/controllers/websites";
import { CRAWL_COMPLETE } from "@app/core/static";
import { pubsub } from "@app/database/pubsub";
import { collectionUpsert } from "../collection-upsert";

export function setWebsiteScore(props: {
  domain: string;
  userId: number;
  duration: number;
}): Promise<boolean>;

// set website score and send complete subcription
export async function setWebsiteScore({ domain, userId, duration }) {
  let website;
  let websiteCollection;

  try {
    [website, websiteCollection] = await getWebsite({
      domain,
      userId,
    });
  } catch (e) {
    console.error(e);
  }

  const all = website?.subdomains || website?.tld;
  const targetDomain = website?.domain || domain;

  try {
    const data = await generateWebsiteScore({
      domain: targetDomain,
      userId,
      all,
    });

    const issuesInfo = data?.issuesInfo;

    if (issuesInfo && website) {
      const dur = Number(Number.parseFloat(duration).toFixed(2));
      await collectionUpsert(
        {
          ...website,
          issuesInfo,
          crawlDuration: typeof dur === "number" ? dur : 0, // time it took to crawl the entire website in ms
        },
        [websiteCollection, !!website],
        {
          searchProps: {
            domain: website?.domain,
            userId,
          },
        }
      );
    }

    // TODO: MOVE OUT OF METHOD
    await pubsub.publish(CRAWL_COMPLETE, {
      crawlComplete: {
        userId,
        domain: website?.domain,
        adaScoreAverage: issuesInfo?.adaScoreAverage,
      },
    });

    return Promise.resolve(true);
  } catch (e) {
    console.error(e);
    return Promise.resolve(false);
  }
}
