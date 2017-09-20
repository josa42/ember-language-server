"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const file_info_1 = require("./file-info");
const deferred_1 = require("./utils/deferred");
const klaw = require('klaw');
const ignoredFolders = [
    '.git',
    'bower_components',
    'dist',
    'node_modules',
    'tmp',
];
class FileIndex {
    constructor(root) {
        this.files = [];
        this.root = root;
    }
    invalidate() {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = (it) => ignoredFolders.indexOf(path.basename(it)) === -1;
            let deferred = new deferred_1.default();
            klaw(this.root, { filter })
                .on('data', (item) => this.add(item.path))
                .on('end', () => deferred.resolve());
            return deferred.promise;
        });
    }
    add(absolutePath) {
        let relativePath = path.relative(this.root, absolutePath);
        let fileInfo = file_info_1.FileInfo.from(relativePath);
        if (fileInfo) {
            console.log(`add ${relativePath} -> ${fileInfo.containerName}`);
            this.files.push(fileInfo);
        }
        return fileInfo;
    }
    remove(absolutePath) {
        let relativePath = path.relative(this.root, absolutePath);
        let index = this.files.findIndex(fileInfo => fileInfo.relativePath === relativePath);
        if (index !== -1) {
            let fileInfo = this.files.splice(index, 1)[0];
            console.log(`remove ${relativePath} -> ${fileInfo.containerName}`);
            return fileInfo;
        }
    }
    byModuleType(type) {
        return this.files.filter(it => it instanceof file_info_1.ModuleFileInfo && it.type === type);
    }
}
exports.default = FileIndex;
//# sourceMappingURL=file-index.js.map