import { EventEmitter } from "events";

export const EditorEventType = {
    loadedMessageToEditor: "loadedMessageToEditor",
    editingDone: "editingDone",
};

export class EditorEventEmitter extends EventEmitter {
    isMessageLoaded: boolean = false;
    emitEditingDone() {
        this.emit(EditorEventType.editingDone)
        this.isMessageLoaded = false;
    }
    emitMessageLoaded() {
        this.emit(EditorEventType.loadedMessageToEditor)
        this.isMessageLoaded = true;
    }
}
