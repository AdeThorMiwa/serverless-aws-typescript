export function omit<T, K extends string>(
  names: readonly K[],
  obj: T
): Omit<T, K> {
  const result: Record<string, unknown> = {};
  const index: unknown = {};
  let idx = 0;
  const len = names.length;

  while (idx < len) {
    index[names[idx]] = 1;
    idx += 1;
  }

  for (const prop in obj) {
    if (!index?.[prop]) {
      result[prop] = obj[prop];
    }
  }
  return result as Omit<T, K>;
}
