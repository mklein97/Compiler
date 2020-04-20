export class Node {
    label: string;
    n: Node[];
    constructor(L: string) {
        this.label = L;
        this.n = [];
    }
}