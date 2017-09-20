"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const esprima_1 = require("esprima");
const estree_utils_1 = require("../estree-utils");
const types = require('ast-types');
class JSDocumentSymbolProvider {
    constructor() {
        this.extensions = ['.js'];
    }
    process(content) {
        let ast = esprima_1.parse(content, {
            loc: true,
            sourceType: 'module',
        });
        let symbols = [];
        types.visit(ast, {
            visitProperty(path) {
                let node = path.node;
                let symbol = vscode_languageserver_1.SymbolInformation.create(node.key.name, vscode_languageserver_1.SymbolKind.Property, estree_utils_1.toLSRange(node.key.loc));
                symbols.push(symbol);
                this.traverse(path);
            },
        });
        return symbols;
    }
}
exports.default = JSDocumentSymbolProvider;
//# sourceMappingURL=js-document-symbol-provider.js.map