import 'source-map-support/register';
import { handlerPathFromLibs } from '@util/handlerResolver';

const generateEvent = (opts: {
  path: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  schema?: unknown;
  [key: string]: unknown;
}): {
  handler: string;
  events?: { http: { method: string; path: string; [key: string]: unknown } }[];
} => {
  const { path, method, schema, ...rest } = opts;
  const [base, pathname] = path.split('.');
  let request;
  if (method !== 'get') {
    request = {
      schema: {
        'application/json': schema
      }
    };
  }

  const generated = {
    handler: `${handlerPathFromLibs(__dirname, base)}/${pathname}.handler`
  };

  if (method) {
    generated['events'] = [
      {
        http: {
          method: method,
          path: pathname,
          request,
          ...rest
        }
      }
    ];
  }

  return generated;
};

export default generateEvent;