/// <reference types="node" />
import { EventEmitter } from 'events';
import FileIndex from './file-index';
export declare class Project {
    readonly root: string;
    readonly fileIndex: FileIndex;
    constructor(root: string);
}
export default class ProjectRoots {
    workspaceRoot: string;
    projects: Map<string, Project>;
    initialize(workspaceRoot: string, watcher: EventEmitter): Promise<void>;
    onProjectAdd(path: string): void;
    onProjectDelete(path: string): void;
    projectForPath(path: string): Project | undefined;
}
