export abstract class DatabaseBaseRepositoryAbstract<Entity> {
  abstract create<Dto = any>(data: Dto): Promise<Entity>;
}
