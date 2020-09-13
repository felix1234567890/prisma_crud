export interface IBaseRepository<K, V, T> {
  create(createDTO: K): Promise<T>;
  delete(id: number): Promise<T>;
  update(user: V): Promise<T>;
  findById(updateDTO: number): Promise<T | null>;
  getAll(): Promise<T[]>;
}
