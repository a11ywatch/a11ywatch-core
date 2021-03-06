import { connect } from "@app/database";
import {
  WEBSITE_NOT_FOUND,
  SUCCESS,
  SUCCESS_DELETED_ALL,
} from "@app/core/strings";
import { getWebsite } from "../find";
import { HistoryController } from "../../history";
import { domainNameFind } from "@app/core/utils";

// remove a website or all website and related data.
export const removeWebsite = async ({ userId, url, deleteMany = false }) => {
  if (typeof userId === "undefined") {
    throw new Error(WEBSITE_NOT_FOUND);
  }

  const [scriptsCollection] = await connect("Scripts");
  const [analyticsCollection] = await connect("Analytics");
  const [pagesCollection] = await connect("Pages");
  const [issuesCollection] = await connect("Issues");
  const [actionsCollection] = await connect("PageActions");
  const [pageSpeedCollection] = await connect("PageSpeed");

  if (deleteMany) {
    const [webcollection] = await connect("Websites");
    await webcollection.deleteMany({ userId });
    await scriptsCollection.deleteMany({ userId });
    await analyticsCollection.deleteMany({ userId });
    await pagesCollection.deleteMany({ userId });
    await issuesCollection.deleteMany({ userId });
    await actionsCollection.deleteMany({ userId });
    await pageSpeedCollection.deleteMany({ userId });

    return { code: 200, success: true, message: SUCCESS_DELETED_ALL };
  }

  const [siteExist, collection] = await getWebsite({ userId, url });

  if (!siteExist) {
    throw new Error(WEBSITE_NOT_FOUND);
  }

  const removeRelative = siteExist.subdomains || siteExist.tld;

  const baseRemoveQuery = { domain: siteExist?.domain, userId };

  const deleteQuery = removeRelative
    ? domainNameFind({ userId }, siteExist.domain)
    : baseRemoveQuery;

  const [history, historyCollection] = await HistoryController().getHistoryItem(
    baseRemoveQuery,
    true
  );

  await scriptsCollection.deleteMany(deleteQuery);
  await analyticsCollection.deleteMany(deleteQuery);
  await pagesCollection.deleteMany(deleteQuery);
  await issuesCollection.deleteMany(deleteQuery);
  await collection.findOneAndDelete(deleteQuery);
  await actionsCollection.deleteMany(deleteQuery);
  await pageSpeedCollection.deleteMany(deleteQuery);

  // PREVENT DUPLICATE ITEMS IN HISTORY
  if (!history) {
    if ((await historyCollection.countDocuments({ userId })) >= 20) {
      await historyCollection.deleteOne({ userId });
    }
    await historyCollection.insertOne({
      ...siteExist,
      deletedDate: new Date(),
    });
  }

  return { website: siteExist, code: 200, success: true, message: SUCCESS };
};
