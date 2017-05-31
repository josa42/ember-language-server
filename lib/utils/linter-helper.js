"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
function toDiagnostic(source, error) {
    return {
        severity: vscode_languageserver_1.DiagnosticSeverity.Error,
        range: toRange(source, error),
        message: error.message,
        source: 'ember-template-lint'
    };
}
exports.toDiagnostic = toDiagnostic;
function toLineRange(source, idx) {
    const line = (source.split('\n')[idx] || '').replace(/\s+$/, '');
    const pre = line.match(/^(\s*)/);
    const start = pre ? pre[1].length : 0;
    const end = line.length || start + 1;
    return [start, end];
}
function toRange(source, error) {
    let line;
    const parseError = error.message.match(/^Parse error on line (\d+)/);
    if (parseError) {
        line = Number(parseError[1]) - 1;
    }
    else if (error.line) {
        line = error.line - 1;
    }
    else {
        line = 0;
    }
    const [start, end] = toLineRange(source, line);
    return {
        start: { line, character: start },
        end: { line, character: end }
    };
}
//# sourceMappingURL=linter-helper.js.map