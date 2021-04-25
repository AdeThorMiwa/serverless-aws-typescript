import 'source-map-support/register';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

export type MutableAPIGatewayProps = 'body' | 'queryStringParameters';

export type ValidatedAPIGatewayProxyEvent<
  S,
  M extends MutableAPIGatewayProps
> = Omit<APIGatewayProxyEvent, M> &
  (M extends 'body'
    ? {
        body: FromSchema<S>;
      }
    : { queryStringParameters: FromSchema<S> });

export type ValidatedEventAPIGatewayProxyEvent<
  S,
  M extends MutableAPIGatewayProps
> = Handler<ValidatedAPIGatewayProxyEvent<S, M>, APIGatewayProxyResult>;

/*global Iresponse*/
export const respondWith = (response: Iresponse): APIGatewayProxyResult => {
  const statusCode = response.getStatusCode();
  return {
    statusCode,
    body: JSON.stringify({
      status: 'success',
      message: response.getMessage(),
      data: response.getData()
    })
  };
};
