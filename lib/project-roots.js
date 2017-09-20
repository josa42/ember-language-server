'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const file_index_1 = require("./file-index");
class Project {
    constructor(root) {
        this.root = root;
        this.fileIndex = new file_index_1.default(root);
    }
}
exports.Project = Project;
class ProjectRoots {
    constructor() {
        this.projects = new Map();
    }
    initialize(workspaceRoot, watcher) {
        return __awaiter(this, void 0, void 0, function* () {
            this.workspaceRoot = workspaceRoot;
            let promise = new Promise(resolve => {
                watcher.once('ready', resolve);
            });
            watcher.on('add', (path) => {
                if (path_1.basename(path) === 'ember-cli-build.js') {
                    this.onProjectAdd(path_1.dirname(path));
                }
                promise.then(() => {
                    let project = this.projectForPath(path);
                    if (project) {
                        project.fileIndex.add(path);
                    }
                });
            });
            watcher.on('unlink', (path) => {
                if (path_1.basename(path) === 'ember-cli-build.js') {
                    this.onProjectDelete(path_1.dirname(path));
                }
                promise.then(() => {
                    let project = this.projectForPath(path);
                    if (project) {
                        project.fileIndex.remove(path);
                    }
                });
            });
            yield promise;
        });
    }
    onProjectAdd(path) {
        console.log(`Ember CLI project added at ${path}`);
        this.projects.set(path, new Project(path));
    }
    onProjectDelete(path) {
        console.log(`Ember CLI project deleted at ${path}`);
        this.projects.delete(path);
    }
    projectForPath(path) {
        let root = (Array.from(this.projects.keys()) || [])
            .filter(root => path.indexOf(root) === 0)
            .reduce((a, b) => a.length > b.length ? a : b, '');
        return this.projects.get(root);
    }
}
exports.default = ProjectRoots;
//# sourceMappingURL=project-roots.js.map