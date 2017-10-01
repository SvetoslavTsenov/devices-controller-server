import { IDevice } from "../interfaces/device";
import { IDeviceModel } from "../models/device";
export declare class IOSManager {
    private static XCRUN;
    private static SIMCTL;
    private static XCRUNLISTDEVICES_COMMAND;
    private static BOOT_DEVICE_COMMAND;
    private static BOOTED;
    private static SHUTDOWN;
    private static OSASCRIPT_QUIT_SIMULATOR_COMMAND;
    private static SIMULATOR;
    private static IOS_DEVICE;
    private static _simulator;
    static getAllDevices(): IDevice[];
    static startDevice(simulator: IDeviceModel): Promise<IDeviceModel>;
    static killAll(): void;
    static kill(udid: string): void;
    private static startSimulatorProcess(udid);
    private static findSimulatorByParameter(...args);
    private static parseSimulator(sim);
    private static waitUntilSimulatorBoot(udid, timeout);
}
export declare class Simulator implements IDevice {
    private _token;
    private _name;
    private _status;
    private _type;
    private _procPid;
    private _startedAt?;
    constructor(_token: string, _name: string, _status: string, _type: any, _procPid?: any);
    readonly token: string;
    readonly type: any;
    readonly procPid: any;
    status: string;
    readonly name: string;
    startedAt: number;
}
