export class Dependent {
    classe: any;
    attributeName?: string;
    object?: any;
    path?: string;

    constructor(classe: any, attributeName?: string, object?: any, path?: string) {
        this.classe = classe;
        this.attributeName = attributeName;
        this.object = object;
        this.path = path;
    }
}
