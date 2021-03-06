import { connect } from "@app/database";
import { domainNameFind, websiteSearchParams } from "@app/core/utils";

// get analytics by domain for a user with pagination offsets.
export const getPageSpeedPaging = async (params, chain?: boolean) => {
  const { userId, domain, limit = 20, offset = 0, all = false } = params ?? {};

  try {
    const [collection] = await connect("PageSpeed");

    let params = {};

    if (typeof userId !== "undefined") {
      params = { userId };
    }

    if (typeof domain !== "undefined" && domain) {
      if (all) {
        params = domainNameFind(params, domain);
      } else {
        params = { ...params, domain };
      }
    }

    const items = await collection
      .find(params)
      .skip(offset)
      .limit(limit)
      .toArray();

    const pages = items ?? [];

    return chain ? [pages, collection] : pages;
  } catch (e) {
    console.error(e);
  }
};

// PageSpeed insights by lighthouse
// returns stringified json results if found.
export const PageSpeedController = ({ user } = { user: null }) => ({
  getWebsite: async (
    {
      pageUrl,
      userId,
      domain,
      all = false,
    }: { pageUrl?: string; userId?: number; domain?: string; all?: boolean },
    chain?: boolean
  ) => {
    const [collection] = await connect("PageSpeed");
    const searchProps = websiteSearchParams({
      pageUrl,
      userId,
      domain,
      all,
    });

    let insights;

    if (Object.keys(searchProps).length) {
      try {
        insights = await collection.findOne(searchProps);
      } catch (e) {
        console.error(e);
      }
    }

    return chain ? [insights, collection] : insights;
  },
  // get page speed by domain relating to a website.
  getWebsitePageSpeed: async ({
    userId,
    domain,
  }: {
    userId?: number;
    domain?: string;
  }) => {
    const [collection] = await connect("PageSpeed");
    const searchProps = websiteSearchParams({ domain, userId });

    return await collection.findOne(searchProps);
  },
  getPageSpeed: async ({
    userId,
    pageUrl,
  }: {
    userId?: number;
    pageUrl?: string;
  }) => {
    const [collection] = await connect("PageSpeed");
    const searchProps = websiteSearchParams({ pageUrl, userId });
    return await collection.find(searchProps).limit(20).toArray();
  },
  getPageSpeedPaging,
});
