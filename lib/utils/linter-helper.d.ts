import { Diagnostic } from 'vscode-languageserver';
export interface TemplateLinterError {
    moduleId: string;
    message: string;
    source: string;
    line?: number;
}
export declare function toDiagnostic(source: string, error: TemplateLinterError): Diagnostic;
