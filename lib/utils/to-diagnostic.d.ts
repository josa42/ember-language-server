import { Diagnostic } from 'vscode-languageserver';
export interface TemplateLinterError {
    moduleId: string;
    message: string;
    source: string;
    line?: number;
}
export default function toDiagnostic(source: string, error: TemplateLinterError): Diagnostic;
