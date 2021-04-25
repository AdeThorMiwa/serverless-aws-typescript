import 'source-map-support/register';
import generateEvent from '@util/generateEvent';
import getHelloSchema from '@schema/hello/get';

export const getHello = generateEvent({
  path: 'hello.get',
  method: 'get',
  schema: getHelloSchema
});
