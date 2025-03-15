import { defineStore } from "pinia";
import { saveAs } from "file-saver";
import { nanoid } from "nanoid";
import { useLocalStorage } from "@vueuse/core";

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

export const useRecordStore = defineStore("record", () => {

    const title = useLocalStorage("AL_title", "Chunks");
    const chunkRecords = useLocalStorage<ChunkRecord[]>("AL_chunkRecords", [
        ChunkRecord.default().withFront("消耗精力").withBack("<b>expend</b> energy"),
        ChunkRecord.default().withFront("……的精华").withBack("the <b>cream/essence</b> of sth"),
    ], {
        serializer: {
            read(raw) { return JSON.parse(raw).map(ChunkRecord.fromJSON); },
            write(value) { return JSON.stringify(value); },
        },
    });
    const recordStorageIds = useLocalStorage<string[]>("AL_recordStorageIds", []);
    load_records(title.value, false);

    function add_record() {
        chunkRecords.value.push(ChunkRecord.default());
    }

    function find_record(id: string) {
        return chunkRecords.value.find((record) => record.id === id) ?? ChunkRecord.default();
    }

    function delete_record(id: string) {
        const index = chunkRecords.value.findIndex((record) => record.id === id);
        if (index !== -1) {
            chunkRecords.value.splice(index, 1);
        }
    }

    function add_addition(id: string) {
        const record = find_record(id);
        record.additions.push(Addition.default());
    }

    function find_addition(chunkId: string, additionId: string) {
        return find_record(chunkId).additions.find((addition) => addition.id === additionId) ?? Addition.default();
    }

    function delete_addition(chunkId: string, additionId: string) {
        const record = find_record(chunkId);
        const index = record.additions.findIndex((addition) => addition.id === additionId);
        if (index !== -1) {
            record.additions.splice(index, 1);
        }
    }

    function save_records() {
        if (!recordStorageIds.value.includes(title.value)) {
            recordStorageIds.value.push(title.value);
        }
        localStorage.setItem(`AL_records_${title.value}`, export_records());
    }

    function load_records(_title: string, interactive: boolean = true) {
        const item = localStorage.getItem(`AL_records_${_title}`);
        if (item === null) {
            if (!interactive) {
                return;
            }
            alert("Record not found.");
        } else {
            chunkRecords.value.splice(0, chunkRecords.value.length, ...JSON.parse(item).map(ChunkRecord.fromJSON));
            title.value = _title;
        }
    }

    function add_new_records() {
        save_records();
        title.value = "New " + nanoid(8);
        chunkRecords.value.splice(0, chunkRecords.value.length);
    }

    function export_records() {
        return JSON.stringify(chunkRecords.value, undefined, 2)
    }

    function download_export() {
        const jsonContent = export_records();
        const blob = new Blob([jsonContent], { type: "application/json" });
        saveAs(blob, "AL_records.json");
    }

    return {
        chunkRecords,
        title,
        recordStorageIds,
        find_record,
        add_record,
        add_addition,
        save_records,
        load_records,
        find_addition,
        delete_addition,
        download_export,
        delete_record,
        add_new_records,
    };
});
