/* eslint-disable no-unused-vars */
// eslint-disable-next-line strict
declare interface DatabaseService {
  getAll<M>(opts: Record<string, unknown>): Promise<M[]> | M[];
  getById<M>(id: string): Promise<M> | M;
  create<M>(fields: Record<string, unknown>): Promise<M> | M;
  updateById<M>(id: string, fields: Record<string, unknown>): Promise<M> | M;
  deleteById(id: string): Promise<void> | void;
}
