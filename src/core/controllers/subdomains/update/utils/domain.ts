import { arrayAverage } from "@app/core/utils";
import { getDomains } from "../../find";

export const generateWebsiteAverage = async ({
  domain,
  perfectScore,
  userId,
  allDomains: allDomainsList,
}: {
  domain?: string;
  perfectScore?: boolean;
  userId?: number;
  allDomains?: any[];
}) => {
  try {
    const allDomains = allDomainsList?.length
      ? allDomainsList
      : await getDomains({
          domain,
          userId,
        });
    const getAvgAdaScore = allDomains
      .filter((subd) => subd?.adaScore)
      .map((fDomain) => fDomain?.adaScore);
    const averageItems = arrayAverage(getAvgAdaScore);
    const avgScore = isNaN(averageItems) || perfectScore ? 100 : averageItems;

    return avgScore;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const generateWebsiteAverageIssues = async ({ domain, userId }) => {
  try {
    const allDomains = await getDomains({
      domain,
      userId,
    });
    const averageIssues = await generateWebsiteAverage({
      domain,
      userId,
      allDomains,
    });

    return [averageIssues];
  } catch (e) {
    console.error(e);
  }
};
