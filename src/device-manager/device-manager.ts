import * as childProcess from "child_process";
import { IModel } from "../models/model";
import { IDeviceModel } from "../models/device";
import {
    AndroidManager,
    IOSManager,
    Device,
    IDevice,
    Platform,
    Status
} from "devices-controller";

export class DeviceManager {

    constructor() { }

    public static async bootDevices(model) {
        const count = process.env.MAX_IOS_DEVICE_COUNT;
        const simName = process.env.SIM_NAMES;
        const emuName = process.env.EMU_NAMES;

        await DeviceManager.bootIOSDevices(model, simName, count);
        await DeviceManager.bootAndroidDevices(model, emuName, count);
    }

    public static async bootIOSDevices(model: IModel, query, count) {
        count = count || process.env.MAX_IOS_DEVICE_COUNT;
        query.type = Platform.SIMULATOR;
        query.status = Status.SHUTDOWN;
        let simulators = await DeviceManager.findDevices(model, query);

        const maxSimToBoot = Math.min(simulators.length, parseInt(count || 1));
        for (var index = 0; index < maxSimToBoot; index++) {
            const sim = simulators[index];
            let device = DeviceManager.copyIDeviceModelToDevice(sim);
            await IOSManager.startSimulator(device);
            model.device.update(sim, device.toJson(), (res, err) => {
                console.log(res);
                console.log(err);
            });
        }
    }

    public static async bootAndroidDevices(model: IModel, query, count) {
        count = count || process.env.MAX_ANDROID_DEVICE_COUNT;
        query.type = Platform.EMULATOR;
        query.status = Status.SHUTDOWN;
        let emulators = await DeviceManager.findDevices(model, query);
        const emulatorCountToBoot = Math.min(emulators.length, parseInt(count || 1));
        for (let index = 0; index < emulatorCountToBoot; index++) {
            const emu = emulators[index];
            let device = DeviceManager.copyIDeviceModelToDevice(emu);
            await AndroidManager.startEmulator(device);
            model.device.update(emu, device.toJson(), (res, err) => {
                console.log(res);
                console.log(err);
            });
        }
    }

    public static getIOSDevices() {
        return IOSManager.getAllDevices();
    }

    public static getAndroidDevices() {
        return AndroidManager.getAllDevices();
    }

    public static async killDevice(obj, model: IModel) {
        const devices = await model.device.find(obj);
        devices.forEach(device => {
            if (device.type.toLowerCase().includes("sim") || device.type.toLowerCase().includes("ios")) {
                IOSManager.kill(device.token.toString());
            } else {
                AndroidManager.kill(DeviceManager.copyIDeviceModelToDevice(device));
            }

            device.status = Status.SHUTDOWN;
            device.startedAt = 0;
            model.device.update(device, device.toJSON());
        });
    }

    public static async killAll(model: IModel, type?: string) {
        if (!type) {
            await model.device.db.dropDatabase();

            IOSManager.killAll();
            DeviceManager.getIOSDevices().forEach(async (device) => {
                await model.device.create({ name: device.name, token: device.token, status: device.status, startedAt: device.startedAt, type: device.type, apiLevel: device.apiLevel });
            });

            AndroidManager.killAll();
            DeviceManager.getAndroidDevices().forEach(async (device) => {
                await model.device.create({ name: device.name, token: device.token, status: device.status, startedAt: device.startedAt, type: device.type, apiLevel: device.apiLevel });
            });
        }

        if (type.includes("ios")) {
            IOSManager.killAll();
            DeviceManager.getIOSDevices().forEach(async (device) => {
                await model.device.create({ name: device.name, token: device.token, status: device.status, startedAt: device.startedAt, type: device.type, apiLevel: device.apiLevel });
            });
        }

        if (type.includes("android")) {
            AndroidManager.killAll();
            DeviceManager.getAndroidDevices().forEach(async (device) => {
                await model.device.create({ name: device.name, token: device.token, status: device.status, startedAt: device.startedAt, type: device.type, apiLevel: device.apiLevel });
            });
        }
    }

    public static async refreshData(model: IModel, request) {
        await model.device.remove(request);

        if (!request.type || request.type.includes("ios")) {
            DeviceManager.getIOSDevices().forEach(async (device) => {
                await model.device.create({ name: device.name, token: device.token, status: device.status, startedAt: device.startedAt, type: device.type, apiLevel: device.apiLevel });
            });
        }

        if (!request.type || request.type.includes("android")) {
            DeviceManager.getAndroidDevices().forEach(async (device) => {
                await model.device.create({ name: device.name, token: device.token, status: device.status, startedAt: device.startedAt, type: device.type, apiLevel: device.apiLevel });
            });
        }
    }

    private static async findDevices(model: IModel, query) {
        // let simulators = await model.device.find({
        //     "name": { "$regex": name, "$options": "i" },
        //     "status": { "$regex": "shutdown", "$options": "i" }
        // }, (err, res) => {
        //     console.log(err);
        // });

        let simulators = await model.device.find(query, (err, res) => {
            console.log(err);
            console.log(res);
        });

        return simulators;
    }

    private static copyIDeviceModelToDevice(deviceModel: IDeviceModel, device?: Device) {
        if (!device) {
            device = new Device(
                DeviceManager.stringObjToPrimitiveConverter(deviceModel.name),
                DeviceManager.stringObjToPrimitiveConverter(deviceModel.apiLevel),
                DeviceManager.stringObjToPrimitiveConverter(deviceModel.type),
                DeviceManager.stringObjToPrimitiveConverter(deviceModel.token),
                DeviceManager.stringObjToPrimitiveConverter(deviceModel.status),
                deviceModel.procPid)
        } else {
            device.name = DeviceManager.stringObjToPrimitiveConverter(deviceModel.name);
            device.procPid = deviceModel.procPid;
            device.startedAt = deviceModel.startedAt;
            device.status = DeviceManager.stringObjToPrimitiveConverter(deviceModel.status);
            device.token = DeviceManager.stringObjToPrimitiveConverter(deviceModel.token);
            device.type = DeviceManager.stringObjToPrimitiveConverter(deviceModel.type);
            device.apiLevel = DeviceManager.stringObjToPrimitiveConverter(deviceModel.apiLevel);
        }

        return device;
    }

    private static copyDeviceToIDeviceModel(device: Device, deviceModel: IDeviceModel) {
        deviceModel.name = device.name;
        deviceModel.procPid = device.procPid;
        deviceModel.startedAt = device.startedAt;
        deviceModel.status = device.status.toString();
        deviceModel.token = device.token.toString();
        deviceModel.type = device.type;
        deviceModel.apiLevel = device.apiLevel;
    }

    private static stringObjToPrimitiveConverter(obj: String) {
        let value: any = undefined;
        if (obj) {
            value = obj + "";
        }

        return value;
    }

    private converArrayOfDevicesToIDeviceModel() {

    }
}