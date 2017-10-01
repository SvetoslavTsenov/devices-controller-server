import { IDevice } from "../interfaces/device";
import { IModel } from "../models/model";
export declare class AndroidManger {
    private static _emulators;
    static getAllDevices(): void;
    static bootDevices(name: any, count: any, model: IModel): Promise<void>;
    static startDevice(simulator: IDevice, model: IModel): Promise<void>;
    static stop(id: string): void;
    static killAll(): void;
    private static parseSimulator(sim);
}
export declare class Emulator implements IDevice {
    private _token;
    private _name;
    private _status;
    private _type;
    private _simProc;
    private _timestamp?;
    constructor(_token: any, _name: any, _status: any, _type: any, _simProc?: any);
    readonly token: any;
    readonly type: any;
    readonly simProc: any;
    readonly status: any;
    readonly name: any;
    timestamp: number;
}
