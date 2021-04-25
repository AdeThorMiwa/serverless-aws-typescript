import { v4 } from 'uuid';

/*global Model*/
class DocumentModel implements Model {
  id: string;
  createdAt: Date | number;

  constructor(fields: Record<string, unknown>) {
    if (Object.values(fields).length) {
      this.id = v4();
      this.createdAt = Date.now();

      let key: string;
      for (key in fields) {
        this[key] = fields[key];
      }
    }
  }

  create<T>(fields: Record<string, unknown>): T {
    const doc: unknown = new DocumentModel(fields);
    return doc as T;
  }
}

export default new DocumentModel({});
