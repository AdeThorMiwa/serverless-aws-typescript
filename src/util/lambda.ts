import 'source-map-support/register';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import middySchemachemaValidator from '@middy/validator';
import ErrorHandlerMiddleWare from '@util/errorHandler';
import { Context } from 'aws-lambda';
import type {
  MutableAPIGatewayProps,
  ValidatedEventAPIGatewayProxyEvent
} from '@util/apiGateway';

export function middyfy<S, M extends MutableAPIGatewayProps>(
  handler: ValidatedEventAPIGatewayProxyEvent<S, M>,
  schema: S
): middy.Middy<unknown, unknown, Context> {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(middySchemachemaValidator({ inputSchema: schema }))
    .use(ErrorHandlerMiddleWare());
}
