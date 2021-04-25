import 'source-map-support/register';
import { handlerPathFromLibs } from '@util/handlerResolver';

const generateEvent = (opts: {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  schema?: unknown;
}): {
  handler: string;
  events: { http: { method: string; path: string; [key: string]: unknown } }[];
} => {
  const [base, pathname] = opts.path.split('.');
  let request;
  if (opts.method !== 'get') {
    request = {
      schema: {
        'application/json': opts.schema
      }
    };
  }

  return {
    handler: `${handlerPathFromLibs(__dirname, base)}/${pathname}.handler`,
    events: [
      {
        http: {
          method: opts.method,
          path: pathname,
          request
        }
      }
    ]
  };
};

export default generateEvent;
