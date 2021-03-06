import { WEBSITE_NOT_FOUND, CRAWLER_FINISHED } from "@app/core/strings";
import { ApiResponse, ResponseParamsModel, ResponseModel } from "./types";

const responseModel = (
  { msgType, statusCode, success = true, ...extra }: ResponseParamsModel = {
    msgType: ApiResponse.Success,
    statusCode: ApiResponse.Success,
    success: true,
  }
): ResponseModel => {
  let message = extra?.message;
  let code = extra?.code;

  if (!message) {
    switch (msgType) {
      case ApiResponse.NotFound:
        message = WEBSITE_NOT_FOUND;
        break;
      default:
        message = CRAWLER_FINISHED;
        break;
    }
  }

  if (!code) {
    // for gQL
    switch (statusCode) {
      case ApiResponse.NotFound:
        code = 404;
        break;
      case ApiResponse.BadRequest:
        code = 400;
        break;
      default:
        code = 200;
        break;
    }
  }

  return {
    ...extra,
    success,
    code,
    message,
  };
};

export { responseModel };
