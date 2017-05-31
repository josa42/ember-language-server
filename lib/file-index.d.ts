import { FileInfo } from './file-info';
export default class FileIndex {
    readonly root: string;
    readonly files: FileInfo[];
    constructor(root: string);
    invalidate(): Promise<void>;
    add(absolutePath: string): FileInfo | undefined;
    remove(absolutePath: string): FileInfo | undefined;
    byModuleType(type: string): FileInfo[];
}
