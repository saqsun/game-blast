export interface ISubloader {
    load(cache: Record<string, unknown>, key: string, resource: unknown): Promise<void>;
}
