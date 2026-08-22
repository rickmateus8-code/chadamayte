import type Database from "better-sqlite3";

export function createD1Mock(sqlite: Database.Database): D1Database {
  return {
    prepare(query: string) {
      let boundParams: unknown[] = [];

      const stmt = {
        bind(...values: unknown[]) {
          boundParams = values;
          return stmt;
        },
        async first<T = unknown>(colName?: string): Promise<T | null> {
          const s = sqlite.prepare(query);
          const row = s.get(...boundParams) as Record<string, unknown> | undefined;
          if (!row) return null;
          if (colName) return (row[colName] as T) ?? null;
          return row as T;
        },
        async all<T = unknown>(): Promise<D1Result<T>> {
          const s = sqlite.prepare(query);
          const results = s.all(...boundParams) as T[];
          return {
            results,
            success: true,
            meta: {} as D1Meta,
          };
        },
        async run(): Promise<D1Response> {
          const s = sqlite.prepare(query);
          const info = s.run(...boundParams);
          return {
            success: true,
            meta: { changes: info.changes, last_row_id: Number(info.lastInsertRowid) } as D1Meta,
          };
        },
      } as unknown as D1PreparedStatement;

      return stmt;
    },
    async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
      const results: D1Result<T>[] = [];
      sqlite.transaction(() => {
        for (const s of statements) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (s as any).run();
        }
      })();
      return results;
    },
    async exec(query: string): Promise<D1ExecResult> {
      sqlite.exec(query);
      return { count: 1, duration: 0 };
    },
    async dump(): Promise<ArrayBuffer> {
      return new ArrayBuffer(0);
    },
  };
}