import { IModel } from "../models/model";
import { Device, IDevice } from "devices-controller";
export declare class DeviceManager {
    constructor();
    static bootDevices(model: any): Promise<void>;
    static bootIOSDevices(model: IModel, query: any, count: any): Promise<void>;
    static bootAndroidDevices(model: IModel, query: any, count: any): Promise<void>;
    static getIOSDevices(): Map<string, Device>;
    static getAndroidDevices(): Map<string, IDevice>;
    static killDevice(obj: any, model: IModel): Promise<void>;
    static killAll(model: IModel, type?: string): Promise<void>;
    static refreshData(model: IModel, request: any): Promise<void>;
    private static findDevices(model, query);
    private static copyIDeviceModelToDevice(deviceModel, device?);
    private static copyDeviceToIDeviceModel(device, deviceModel);
    private static stringObjToPrimitiveConverter(obj);
    private converArrayOfDevicesToIDeviceModel();
}
