"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_languageserver_1 = require("vscode-languageserver");
const files_1 = require("vscode-languageserver/lib/files");
const esprima_1 = require("esprima");
const estree_utils_1 = require("./estree-utils");
const glimmer_utils_1 = require("./glimmer-utils");
const file_info_1 = require("./file-info");
const file_extension_1 = require("./utils/file-extension");
const { preprocess } = require('@glimmer/syntax');
class DefinitionProvider {
    constructor(server) {
        this.server = server;
    }
    handle(params) {
        let uri = params.textDocument.uri;
        let filePath = files_1.uriToFilePath(uri);
        if (!filePath) {
            return null;
        }
        const project = this.server.projectRoots.projectForPath(filePath);
        if (!project) {
            return null;
        }
        let extension = file_extension_1.getExtension(params.textDocument);
        if (extension === '.hbs') {
            let content = this.server.documents.get(uri).getText();
            let ast = preprocess(content);
            let focusPath = glimmer_utils_1.default.toPosition(ast, estree_utils_1.toPosition(params.position));
            if (!focusPath) {
                return null;
            }
            if (this.isComponentOrHelperName(focusPath)) {
                const componentOrHelperName = focusPath.node.original;
                return project.fileIndex.files
                    .filter(fileInfo => {
                    if (fileInfo instanceof file_info_1.ModuleFileInfo) {
                        return (fileInfo.type === 'component' || fileInfo.type === 'helper') &&
                            fileInfo.slashName === componentOrHelperName;
                    }
                    else if (fileInfo instanceof file_info_1.TemplateFileInfo) {
                        return fileInfo.forComponent && fileInfo.slashName === componentOrHelperName;
                    }
                })
                    .map(fileInfo => toLocation(fileInfo, project.root));
            }
        }
        else if (extension === '.js') {
            let content = this.server.documents.get(uri).getText();
            let ast = esprima_1.parse(content, {
                loc: true,
                sourceType: 'module',
            });
            let astPath = glimmer_utils_1.default.toPosition(ast, estree_utils_1.toPosition(params.position));
            if (!astPath) {
                return null;
            }
            if (isModelReference(astPath)) {
                let modelName = astPath.node.value;
                return project.fileIndex.files
                    .filter(fileInfo => fileInfo instanceof file_info_1.ModuleFileInfo &&
                    fileInfo.type === 'model' &&
                    fileInfo.name === modelName)
                    .map(fileInfo => toLocation(fileInfo, project.root));
            }
            else if (isTransformReference(astPath)) {
                let transformName = astPath.node.value;
                return project.fileIndex.files
                    .filter(fileInfo => fileInfo instanceof file_info_1.ModuleFileInfo &&
                    fileInfo.type === 'transform' &&
                    fileInfo.name === transformName)
                    .map(fileInfo => toLocation(fileInfo, project.root));
            }
        }
        return null;
    }
    get handler() {
        return this.handle.bind(this);
    }
    isComponentOrHelperName(path) {
        let node = path.node;
        if (node.type !== 'PathExpression') {
            return false;
        }
        let parent = path.parent;
        if (!parent || parent.path !== node || (parent.type !== 'MustacheStatement' && parent.type !== 'BlockStatement')) {
            return false;
        }
        return true;
    }
}
exports.default = DefinitionProvider;
function isModelReference(astPath) {
    let node = astPath.node;
    if (node.type !== 'Literal') {
        return false;
    }
    let parent = astPath.parent;
    if (!parent || parent.type !== 'CallExpression' || parent.arguments[0] !== node) {
        return false;
    }
    let identifier = (parent.callee.type === 'Identifier') ? parent.callee : parent.callee.property;
    return identifier.name === 'belongsTo' || identifier.name === 'hasMany';
}
function isTransformReference(astPath) {
    let node = astPath.node;
    if (node.type !== 'Literal') {
        return false;
    }
    let parent = astPath.parent;
    if (!parent || parent.type !== 'CallExpression' || parent.arguments[0] !== node) {
        return false;
    }
    let identifier = (parent.callee.type === 'Identifier') ? parent.callee : parent.callee.property;
    return identifier.name === 'attr';
}
function toLocation(fileInfo, root) {
    let uri = `file://${path.join(root, fileInfo.relativePath)}`;
    let range = vscode_languageserver_1.Range.create(0, 0, 0, 0);
    return vscode_languageserver_1.Location.create(uri, range);
}
//# sourceMappingURL=definition-provider.js.map