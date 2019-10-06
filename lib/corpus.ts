export class Corpus<T> {

    private contents: (T | Corpus<T>)[];
    private index: number = 0;

    constructor(...contents: (T | Corpus<T>)[]) {
        this.contents = contents;
    }

    get(): T {
        if (this.index >= this.contents.length) {
            this.index = 0;
        }
        const element = this.contents[this.index++];
        if (element instanceof Corpus) {
            return (element as Corpus<T>).get();
        }
        return element as T;
    }

    randomize(): this {
        for (let i = 0; i < this.contents.length; i++) {
            const j = Math.floor(Math.random() * (this.contents.length - i)) + i;
            const element = this.contents[j];
            this.contents[j] = this.contents[i];
            this.contents[i] = element;
            if (element instanceof Corpus) {
                (element as Corpus<T>).randomize();
            }
        }
        return this;
    }

}