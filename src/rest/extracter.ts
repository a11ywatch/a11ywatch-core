import { getUserFromToken } from "@app/core/utils";
import { Request } from "express";

// extract query or body params from req
export const paramParser = (req: Request, value: string) =>
  req.query[value] || req.body[value];

// get the base params for a standard collection retrieval by userId, domain, and url
export const getBaseParams = (req: Request) => {
  const usr = getUserFromToken(req.headers.authorization);

  const dman = paramParser(req, "domain");
  const purl = paramParser(req, "pageUrl");
  const url = paramParser(req, "url");
  const domain = dman ? decodeURIComponent(dman + "") : undefined;
  const pageUrl = purl || url ? decodeURIComponent(purl || url) : undefined;

  const userId = usr?.payload?.keyid;

  return {
    userId,
    domain,
    pageUrl,
  };
};
