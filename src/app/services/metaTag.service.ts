import { Injectable } from "@angular/core";
import { Meta } from "@angular/platform-browser";

@Injectable()
export class MetaTagService {
    constructor(private meta: Meta) {}
    addTag(name, content) {
        this.meta.addTag({ name: name, content: content });
    }
    addFroceTag(name, content) {
        this.meta.addTag({ name: name, content: content }, true);
    }
    getTag(name) {
        return this.meta.getTag('name=' + name);
    }
    rmTag(name) {
        return this.meta.removeTag('name=' + name);
    }
    updateTag(name, content) {
        this.meta.updateTag({ name: name, content: content });
    }
}
