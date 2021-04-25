import middy from '@middy/core';
import { serializeError } from 'serialize-error';
import { Context } from 'aws-lambda';

/** The actual middleware */
export class ErrorMiddleWare
  implements middy.MiddlewareObject<unknown, unknown, Context> {
  public static create(): ErrorMiddleWare {
    return new ErrorMiddleWare();
  }

  public onError: middy.MiddlewareFunction<unknown, unknown> = async (
    handler: middy.HandlerLambda
  ) => {
    const error: Error & { statusCode: number } = handler.error as Error & {
      statusCode: number;
    };

    const stack = process.env.STAGE === 'dev' ? error.stack : undefined;
    if (error.statusCode && error.statusCode < 500) {
      const serialized = serializeError(error);

      handler.response = {
        body: JSON.stringify({
          statusCode: error.statusCode,
          status: error.statusCode.toString().startsWith('5')
            ? 'Error'
            : 'Fail',
          name: serialized.name,
          message: serialized.message,
          stack
        }),
        statusCode: error.statusCode
      };
      return;
    }

    handler.response = {
      body: JSON.stringify({
        statusCode: 500,
        status: 'Error',
        name: 'InternalServerError',
        message: 'Something went horribly wrong',
        stack
      }),
      statusCode: 500
    };
  };
}

export default ErrorMiddleWare.create;
