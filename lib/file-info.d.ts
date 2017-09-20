export declare abstract class FileInfo {
    readonly relativePath: string;
    static from(relativePath: string): FileInfo | undefined;
    readonly name: string;
    constructor(relativePath: string);
    readonly containerName: string | undefined;
}
export declare class MainFileInfo extends FileInfo {
    readonly name: string;
    constructor(relativePath: string, pathParts: string[]);
    readonly containerName: string;
}
export declare class TemplateFileInfo extends FileInfo {
    readonly forComponent: boolean;
    readonly name: string;
    readonly slashName: string;
    constructor(relativePath: string, pathParts: string[]);
}
export declare class ModuleFileInfo extends FileInfo {
    readonly type: string;
    readonly name: string;
    readonly slashName: string;
    constructor(relativePath: string, pathParts: string[]);
    readonly containerName: string;
}
export declare abstract class TestFileInfo extends FileInfo {
}
export declare class ModuleTestFileInfo extends TestFileInfo {
    readonly type: string;
    readonly subjectType: string;
    readonly name: string;
    readonly slashName: string;
    constructor(relativePath: string, pathParts: string[], type: string);
}
export declare class AcceptanceTestFileInfo extends TestFileInfo {
    readonly name: string;
    readonly slashName: string;
    constructor(relativePath: string, pathParts: string[]);
}
