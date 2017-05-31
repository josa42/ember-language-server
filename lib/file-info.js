"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const i = require('i')();
const extensions = ['.js', '.hbs', '.handlebars'];
const ignoredFiles = ['.eslintrc.js'];
class FileInfo {
    constructor(relativePath) {
        this.relativePath = relativePath;
    }
    static from(relativePath) {
        let ext = path.extname(relativePath);
        let filename = path.basename(relativePath);
        if (!extensions.includes(ext) || ignoredFiles.includes(filename)) {
            return;
        }
        let pathParts = relativePath.split(path.sep);
        let sourceRoot = pathParts[0];
        if (sourceRoot === 'app') {
            if (pathParts.length === 2) {
                // handle files in the source root
                return new MainFileInfo(relativePath, pathParts);
            }
            if (ext === '.hbs') {
                return new TemplateFileInfo(relativePath, pathParts);
            }
            return new ModuleFileInfo(relativePath, pathParts);
        }
        else if (sourceRoot === 'tests') {
            let type = pathParts[1];
            if (type === 'integration' || type === 'unit') {
                return new ModuleTestFileInfo(relativePath, pathParts, type);
            }
            else if (type === 'acceptance') {
                return new AcceptanceTestFileInfo(relativePath, pathParts);
            }
        }
    }
    get containerName() {
        return undefined;
    }
}
exports.FileInfo = FileInfo;
class MainFileInfo extends FileInfo {
    constructor(relativePath, pathParts) {
        super(relativePath);
        this.name = removeExtension(pathParts)[1];
    }
    get containerName() {
        return `main:${this.name}`;
    }
}
exports.MainFileInfo = MainFileInfo;
class TemplateFileInfo extends FileInfo {
    constructor(relativePath, pathParts) {
        super(relativePath);
        this.forComponent = (pathParts[2] === 'components');
        let nameParts = removeExtension(pathParts.slice(this.forComponent ? 3 : 2));
        this.name = nameParts.join('.');
        this.slashName = nameParts.join('/');
    }
}
exports.TemplateFileInfo = TemplateFileInfo;
class ModuleFileInfo extends FileInfo {
    constructor(relativePath, pathParts) {
        super(relativePath);
        let topLevelDirectory = pathParts[1];
        this.type = i.singularize(topLevelDirectory);
        let nameParts = removeExtension(pathParts.slice(2));
        this.name = nameParts.join('.');
        this.slashName = nameParts.join('/');
    }
    get containerName() {
        return `${this.type}:${this.name}`;
    }
}
exports.ModuleFileInfo = ModuleFileInfo;
class TestFileInfo extends FileInfo {
}
exports.TestFileInfo = TestFileInfo;
class ModuleTestFileInfo extends TestFileInfo {
    constructor(relativePath, pathParts, type) {
        super(relativePath);
        this.type = type;
        let topLevelDirectory = pathParts[2];
        this.subjectType = i.singularize(topLevelDirectory);
        let nameParts = removeExtension(pathParts.slice(3));
        this.name = nameParts.join('.');
        this.slashName = nameParts.join('/');
    }
}
exports.ModuleTestFileInfo = ModuleTestFileInfo;
class AcceptanceTestFileInfo extends TestFileInfo {
    constructor(relativePath, pathParts) {
        super(relativePath);
        let nameParts = removeExtension(pathParts.slice(2));
        this.name = nameParts.join('.');
        this.slashName = nameParts.join('/');
    }
}
exports.AcceptanceTestFileInfo = AcceptanceTestFileInfo;
function removeExtension(nameParts) {
    let baseName = nameParts.pop();
    let extension = path.extname(baseName);
    nameParts.push(baseName.substr(0, baseName.length - extension.length));
    return nameParts;
}
//# sourceMappingURL=file-info.js.map