export interface IDevice {
    name: String;
    token: String;
    type: String;
    status?: String;
    info?: String;
    config?: String;
    apiLevel?: String;
    startedAt?: number;
    startedUsageAt?: number;
    procPid?: number;
}
