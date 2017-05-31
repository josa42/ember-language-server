import { Position } from 'estree';
export default class ASTPath {
    private readonly path;
    private readonly index;
    static toPosition(ast: any, position: Position): ASTPath | undefined;
    private constructor(path, index?);
    readonly node: any;
    readonly parent: any | undefined;
    readonly parentPath: ASTPath | undefined;
}
