"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vscode_languageserver_1 = require("vscode-languageserver");
const files_1 = require("vscode-languageserver/lib/files");
const glimmer_utils_1 = require("../glimmer-utils");
const estree_utils_1 = require("../estree-utils");
const file_info_1 = require("../file-info");
const fuzzaldrin_1 = require("fuzzaldrin");
const { preprocess } = require('@glimmer/syntax');
const ember_helpers_1 = require("./ember-helpers");
const unique_by_1 = require("../utils/unique-by");
class TemplateCompletionProvider {
    constructor(server) {
        this.server = server;
    }
    provideCompletions(params) {
        const uri = params.textDocument.uri;
        const filePath = files_1.uriToFilePath(uri);
        if (!filePath || path_1.extname(filePath) !== '.hbs') {
            return [];
        }
        const project = this.server.projectRoots.projectForPath(filePath);
        if (!project) {
            return [];
        }
        let document = this.server.documents.get(uri);
        let offset = document.offsetAt(params.position);
        let originalText = document.getText();
        let text = originalText.slice(0, offset) + 'ELSCompletionDummy' + originalText.slice(offset);
        let ast = preprocess(text);
        let focusPath = glimmer_utils_1.default.toPosition(ast, estree_utils_1.toPosition(params.position));
        if (!focusPath) {
            return [];
        }
        let completions = [];
        if (isMustachePath(focusPath)) {
            completions.push(...listComponents(project.fileIndex));
            completions.push(...listHelpers(project.fileIndex));
            completions.push(...ember_helpers_1.emberMustacheItems);
        }
        else if (isBlockPath(focusPath)) {
            completions.push(...listComponents(project.fileIndex));
            completions.push(...ember_helpers_1.emberBlockItems);
        }
        else if (isSubExpressionPath(focusPath)) {
            completions.push(...listHelpers(project.fileIndex));
            completions.push(...ember_helpers_1.emberSubExpressionItems);
        }
        else if (isLinkToTarget(focusPath)) {
            completions.push(...listRoutes(project.fileIndex));
        }
        return fuzzaldrin_1.filter(completions, getTextPrefix(focusPath), { key: 'label' });
    }
}
exports.default = TemplateCompletionProvider;
function listComponents(index) {
    return unique_by_1.default(index.files.filter(isComponent), 'name').map(toCompletionItem);
}
function listHelpers(index) {
    return index.files.filter(isHelper).map(toCompletionItem);
}
function listRoutes(index) {
    return index.files.filter(isRoute).map(toRouteCompletionItem);
}
function isMustachePath(path) {
    let node = path.node;
    if (node.type !== 'PathExpression') {
        return false;
    }
    let parent = path.parent;
    if (!parent || parent.type !== 'MustacheStatement') {
        return false;
    }
    return parent.path === node;
}
function isBlockPath(path) {
    let node = path.node;
    if (node.type !== 'PathExpression') {
        return false;
    }
    let parent = path.parent;
    if (!parent || parent.type !== 'BlockStatement') {
        return false;
    }
    return parent.path === node;
}
function isSubExpressionPath(path) {
    let node = path.node;
    if (node.type !== 'PathExpression') {
        return false;
    }
    let parent = path.parent;
    if (!parent || parent.type !== 'SubExpression') {
        return false;
    }
    return parent.path === node;
}
function isLinkToTarget(path) {
    return isInlineLinkToTarget(path) || isBlockLinkToTarget(path);
}
function isInlineLinkToTarget(path) {
    let node = path.node;
    if (node.type !== 'StringLiteral') {
        return false;
    }
    let parent = path.parent;
    if (!parent || parent.type !== 'MustacheStatement') {
        return false;
    }
    return parent.params[1] === node && parent.path.original === 'link-to';
}
function isBlockLinkToTarget(path) {
    let node = path.node;
    if (node.type !== 'StringLiteral') {
        return false;
    }
    let parent = path.parent;
    if (!parent || parent.type !== 'BlockStatement') {
        return false;
    }
    return parent.params[0] === node && parent.path.original === 'link-to';
}
function isComponent(fileInfo) {
    if (fileInfo instanceof file_info_1.ModuleFileInfo) {
        return fileInfo.type === 'component';
    }
    if (fileInfo instanceof file_info_1.TemplateFileInfo) {
        return fileInfo.forComponent;
    }
    return false;
}
function isHelper(fileInfo) {
    return fileInfo instanceof file_info_1.ModuleFileInfo && fileInfo.type === 'helper';
}
function isRoute(fileInfo) {
    return fileInfo instanceof file_info_1.ModuleFileInfo && fileInfo.type === 'route';
}
function toCompletionItem(fileInfo) {
    let kind = toCompletionItemKind(fileInfo.type);
    return {
        kind,
        label: fileInfo.slashName,
        detail: fileInfo.type,
    };
}
function toRouteCompletionItem(fileInfo) {
    let kind = toCompletionItemKind(fileInfo.type);
    return {
        kind,
        label: fileInfo.name,
        detail: fileInfo.type,
    };
}
function toCompletionItemKind(type) {
    if (type === 'helper') {
        return vscode_languageserver_1.CompletionItemKind.Function;
    }
    else if (type === 'route') {
        return vscode_languageserver_1.CompletionItemKind.File;
    }
    else {
        return vscode_languageserver_1.CompletionItemKind.Class;
    }
}
function getTextPrefix({ node }) {
    return node && node.original.replace('ELSCompletionDummy', '');
}
//# sourceMappingURL=template-completion-provider.js.map