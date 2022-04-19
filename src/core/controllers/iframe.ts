import { Request } from "express";
import type { AppResponse } from "@app/types";

const createIframe = (req: Request, res: AppResponse) => {
  try {
    const baseUrl = String(req.query.url || req.query.websiteUrl);

    if (!baseUrl) {
      return res.send(false);
    }

    // TODO: REMOVE replace
    let url = decodeURIComponent(baseUrl.replace("/api/iframe?url=", ""));

    if (/http|https/.test(url) === false) {
      const tp = req.protocol === "https" ? "https" : "http";
      url = `${tp}://${url}`;
    }

    if (url.includes(".pdf")) {
      res.redirect(url);
    }

    console.log(`temp log iframe url ${url}`);

    res.createIframe({
      url,
      baseHref: !!req.query.baseHref,
    });
  } catch (e) {
    console.error(e);
  }
};

export { createIframe };
