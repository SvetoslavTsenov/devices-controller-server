export interface IDevice {
    name: String;
    token: String;
    type: String;
    status?: String;
    startedAt?: number;
    procPid?: number;
    apiLevel?: String;
}
