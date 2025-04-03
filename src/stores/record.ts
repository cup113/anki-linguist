import { defineStore } from "pinia";
import { saveAs } from "file-saver";
import { nanoid } from "nanoid";
import { useLocalStorage } from "@vueuse/core";
import { encode as encode_base64 } from 'js-base64';
import { useToastsStore } from "./toasts";

type HTMLString = string;

type JsonType<T> = T extends Date ? string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    : T extends Function | undefined | symbol ? never
    : T extends object ? { [K in keyof T]: JsonType<T[K]> } : T;

export class Addition {
    public id: string;
    public icon: string;
    public front: string;
    public back: string;

    constructor(id: string, icon: string, front: string, back: string) {
        this.id = id;
        this.icon = icon;
        this.front = front;
        this.back = back;
    }

    static fromJSON(json: JsonType<Addition>) {
        return new Addition(json.id, json.icon, json.front, json.back);
    }

    static default() {
        return new Addition(nanoid(), "→", "", "");
    }
}

export class ChunkRecord {
    public id: string;
    public level: string;
    public front: HTMLString;
    public back: HTMLString;
    public additions: Addition[];

    constructor(id: string, level: string, front: HTMLString, back: HTMLString, additions: Addition[]) {
        this.id = id;
        this.level = level;
        this.front = front;
        this.back = back;
        this.additions = additions;
    }

    public withFront(front: HTMLString) {
        this.front = front;
        return this;
    }

    public withBack(back: HTMLString) {
        this.back = back;
        return this;
    }

    static default() {
        return new ChunkRecord(nanoid(), "-", "", "", []);
    }

    static fromJSON(json: JsonType<ChunkRecord>) {
        return new ChunkRecord(json.id, json.level, json.front, json.back, json.additions.map(Addition.fromJSON));
    }
}

type Section = { abbr: string, full: string }[];
type ChunkDocumentV0 = ChunkRecord[];
type ChunkDocumentV1 = { version: 1, title: string, records: ChunkRecord[], sections: Section[] };

export class ChunkDocument {
    static LATEST_VERSION = 2;

    public version: number;
    public title: string;
    public records: ChunkRecord[];
    public sections: Section[];
    public footer: string;

    constructor(title: string, records: ChunkRecord[]) {
        this.version = ChunkDocument.LATEST_VERSION;
        this.title = title;
        this.records = records;
        this.sections = [];
        this.footer = "";
    }

    public add_record(): void {
        this.records.push(ChunkRecord.default());
    }

    public find_record(id: string): ChunkRecord {
        return this.records.find((record) => record.id === id) ?? ChunkRecord.default();
    }

    public delete_record(id: string): boolean {
        const index = this.records.findIndex((record) => record.id === id);
        if (index !== -1) {
            this.records.splice(index, 1);
            return true;
        }
        return false;
    }

    public add_addition(id: string): void {
        this.find_record(id).additions.push(Addition.default());
    }

    public find_addition(id: string, additionId: string): Addition {
        return this.find_record(id).additions.find((addition) => addition.id === additionId) ?? Addition.default();
    }

    public delete_addition(id: string, additionId: string): boolean {
        const record = this.find_record(id);
        const index = record.additions.findIndex((addition) => addition.id === additionId);
        if (index !== -1) {
            record.additions.splice(index, 1);
            return true;
        }
        return false;
    }

    static fromJSON(json: JsonType<ChunkDocument> | JsonType<ChunkDocumentV1> | JsonType<ChunkDocumentV0>): ChunkDocument {
        if (Array.isArray(json)) {
            return new ChunkDocument("", json.map(ChunkRecord.fromJSON));
        }

        const result = new ChunkDocument(json.title, json.records.map(ChunkRecord.fromJSON));
        result.sections = json.sections;
        if (json.version === 2) {
            result.footer = json.footer;
        }
        return result;
    }
}

export const useRecordStore = defineStore("record", () => {
    const chunkDocument = useLocalStorage("AL_chunkDocument", new ChunkDocument("New " + nanoid(8), []), {
        serializer: {
            read(raw) { return ChunkDocument.fromJSON(JSON.parse(raw)); },
            write(value) { return JSON.stringify(value); },
        },
    });
    const recordStorageIds = useLocalStorage<string[]>("AL_recordStorageIds", []);
    load_document(chunkDocument.value.title, false);

    function get_local_storage_key(title: string) {
        return `AL_records_${encode_base64(title)}`;
    }

    function save_document() {
        if (!recordStorageIds.value.includes(chunkDocument.value.title)) {
            recordStorageIds.value.push(chunkDocument.value.title);
        }
        localStorage.setItem(get_local_storage_key(chunkDocument.value.title), JSON.stringify(chunkDocument.value));
        const toastsStore = useToastsStore();
        toastsStore.add_toast("文档已保存", `(${new Date().toLocaleTimeString()}) ${chunkDocument.value.title}`);
    }

    function load_document(_title: string, interactive: boolean = true) {
        const item = localStorage.getItem(get_local_storage_key(_title));
        if (item === null) {
            if (!interactive) {
                return;
            }
            alert("Record not found.");
        } else {
            chunkDocument.value = ChunkDocument.fromJSON(JSON.parse(item));
            chunkDocument.value.title = _title;
        }
    }

    function delete_document(title: string) {
        localStorage.removeItem(get_local_storage_key(title));
        const index = recordStorageIds.value.indexOf(title);
        if (index !== -1) {
            recordStorageIds.value.splice(index, 1);
        }
    }

    function new_document() {
        save_document();
        chunkDocument.value = new ChunkDocument("New " + nanoid(8), []);
    }

    function download_export() {
        const jsonContent = JSON.stringify(chunkDocument.value, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        saveAs(blob, "AL_document.json");
    }

    return {
        chunkDocument,
        recordStorageIds,
        save_document,
        load_document,
        delete_document,
        download_export,
        new_document,
    };
});
