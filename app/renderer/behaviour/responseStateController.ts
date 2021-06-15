import { EventEmitter } from "events";

export const EditorEventType = {
    loadedMessageToEditor: "loadedMessageToEditor",
    editingDone: "editingDone",
};

export class EditorEventEmitter extends EventEmitter {
    emitEditingDone() {
        this.emit(EditorEventType.editingDone)
    }
    emitMessageLoaded() {
        this.emit(EditorEventType.loadedMessageToEditor)
    }
}
