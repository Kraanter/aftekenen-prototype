interface IDatabaseSchema {
  [key: string]: object[];
}

interface IDatabase<Schema extends IDatabaseSchema> {
  setup(): void;
  insert<T extends keyof Schema>(location: T, item: Schema[T][number]): void;
  select<T extends keyof Schema>(location: T): Schema[T];
}

class Database<Schema extends IDatabaseSchema> implements IDatabase<Schema> {
  // The schema is a map of keys to arrays of objects
  // NOTE - The schema does not have all data, only a map of keys to empty arrays
  private schema: Schema;

  constructor(schema: Schema) {
    this.schema = schema;
    this.setup();
  }

  setup(): void {
    Object.entries(this.schema).forEach(([key, value]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (!Array.isArray(data)) {
          throw new Error('Data must be an array');
        }

        // Combine the data from the schema and the data from localStorage
        const combinedData = [...value, ...data];
        localStorage.setItem(key, JSON.stringify(combinedData));

        // Clear the schema data
        // @ts-ignore - We know that the key exists in the schema
        this.schema[key] = [];
      }
    });
  }

  insert<T extends keyof Schema>(location: T, item: Schema[T][number]): void {
    console.log('insert into:', location, 'The value:', item);
    if (typeof location !== 'string') {
      throw new Error('Location must be a string');
    }

    const data = JSON.parse(localStorage.getItem(location) || '[]');
    data.push(item);
    localStorage.setItem(location, JSON.stringify(data));
  }

  select<T extends keyof Schema>(location: T): Schema[T] {
    if (typeof location !== 'string') {
      throw new Error('Location must be a string');
    }

    return JSON.parse(localStorage.getItem(location) || '[]');
  }
}

export { Database };
