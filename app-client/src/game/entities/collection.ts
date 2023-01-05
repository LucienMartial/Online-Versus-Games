import { Entity } from "./entity";

type EntityCollection = { [key: string]: Set<Entity> };

/**
 * Manager for multiple collection of game entities
 */
class CollectionManager {
  private collections: EntityCollection;
  private relations: { [key: string]: Set<string> };

  constructor() {
    this.collections = {};
    this.relations = {};
  }

  // Entity in collection

  add(collectionName = "default", entity: Entity): void {
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = new Set<Entity>();
    }
    this.collections[collectionName].add(entity);
  }

  remove(collectionName = "default", entity: Entity): void {
    this.collections[collectionName].delete(entity);
  }

  get<T extends Entity>(collectionName = "default"): Set<T> {
    // get all the collection childs
    const entities = new Set<T>();
    for (const childName of this.getChilds(collectionName)) {
      for (const entity of this.collections[childName].values()) {
        entities.add(entity as T);
      }
    }
    // add own entities
    for (const entity of this.collections[collectionName].values()) {
      entities.add(entity as T);
    }
    return entities;
  }

  // Collection in collection

  addCollection(parentName = "default", childNames: string[]): void {
    if (!this.relations[parentName]) {
      this.relations[parentName] = new Set<string>();
    }
    for (const name of childNames) {
      if (!this.collections[name]) continue;
      this.relations[parentName].add(name);
    }
  }

  /**
   * Remove child collection to its parent, do not remove entity
   */
  removeCollection(parentName = "default", childName: string): void {
    if (!this.collections[parentName] || !this.collections[childName]) return;
    this.relations[parentName].delete(childName);
  }

  private getChilds(parentName: string): IterableIterator<string> {
    const childs = this.relations[parentName];
    if (!childs) return new Set<string>().values();
    return childs.values();
  }

  /**
   * run update on all entities
   * @param dt
   */
  update(dt: number) {
    for (const [name, collection] of Object.entries(this.collections)) {
      // update collection child's entities
      for (const childName of this.getChilds(name)) {
        for (const entity of this.collections[childName].values()) {
          entity.update(dt);
        }
      }
      // update own entity
      for (const entity of collection.values()) {
        entity.update(dt);
      }
    }
  }
}

export { CollectionManager };
