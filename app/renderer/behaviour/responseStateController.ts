import { EventEmitter } from "events";
import { EditorEventType } from "../components/types/types";


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
