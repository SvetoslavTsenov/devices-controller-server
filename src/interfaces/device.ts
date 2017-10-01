export interface IDevice {
  name: String,
  token: String,
  type: String,
  status?: String,
  holder?: String,
  apiLevel?: String,
  startedAt?: number,
  startedUsageAt?: number,
  procPid?: number
}