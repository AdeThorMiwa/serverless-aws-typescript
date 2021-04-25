/* eslint-disable no-undef */

type ResponseData = Record<string, unknown>;

interface Props {
  statusCode?: StatusCode;
  message?: string;
  data?: ResponseData;
}

export default class AppResponse implements Iresponse {
  private statusCode: StatusCode;
  private data: ResponseData;
  private message: string;

  constructor({ statusCode, message, data }: Props) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data || undefined;
  }

  getMessage(): string {
    return this.message;
  }

  getStatusCode(): StatusCode {
    return this.statusCode;
  }

  getData(): ResponseData {
    return this.data;
  }
}
