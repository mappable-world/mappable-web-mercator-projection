declare module '@mappable-world/mappable-types/import' {
    interface Import {
        (pkg: '@mappable-world/mappable-web-mercator-projection'): Promise<typeof import('./index')>;
    }
}

export {};
