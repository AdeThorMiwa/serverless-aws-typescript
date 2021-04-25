import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@util/apiGateway';
import { respondWith } from '@util/apiGateway';
import { middyfy } from '@util/lambda';
import schema from '@schema/hello/get';
import createError from 'http-errors';
import AppResponse from '@util/response';

const fn: ValidatedEventAPIGatewayProxyEvent<typeof schema, 'body'> = async (
  event
) => {
  try {
    // send response
    return respondWith(
      new AppResponse({
        statusCode: 200,
        data: event
      })
    );
  } catch (e) {
    throw new createError.BadRequest('Something went horribly wrong!');
  }
};

export const handler = middyfy<typeof schema, 'body'>(fn, schema);
