export interface IBaseRepository<K, T, V = null> {
  create(createDTO: K): Promise<T>;
  delete(id: number): Promise<T>;
  update(updateDto: V): Promise<T>;
  findById(id: number): Promise<T | null>;
  getAll(): Promise<T[]>;
}
