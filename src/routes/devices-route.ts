import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { IModel } from "../models/model";
import { IDeviceModel } from "../models/device";
import { DocumentQuery } from "mongoose";
import { DeviceManager } from "../device-manager/device-manager";

/**
 * / route
 *
 * @class User
 */
export class DevicesRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router, model: IModel) {

    const getDevicesFilter = function (req, res, next) {
      model.device.find(req.query, (err, devices) => {
        res.json(devices);
      });
    };

    router.get("/devices", getDevicesFilter, (req: Request, res: Response, next: NextFunction) => {
      res.send("no query string");
    });

    router.get("/devices/killall", (req: Request, res: Response, next: NextFunction) => {
      DeviceManager.killAll(model);
      res.json("All simulators and emulators are dead!")
    });

    router.get("/devices/killall/ios", (req: Request, res: Response, next: NextFunction) => {
      DeviceManager.killAll(model, "sim");
      res.json("IOS simulatorors are dead!");
    });

    router.get("/devices/killall/android", (req: Request, res: Response, next: NextFunction) => {
      DeviceManager.killAll(model, "android");
      res.json("Android emulators are dead!");
    });

    router.get("/devices/kill", async (req: Request, res: Response, next: NextFunction) => {
      let query = req.query;
      await DeviceManager.killDevice(req.query, model);
      res.send("no query string");
    });

    const bootIOSDeviceFilter = function (req, res, next) {
      DeviceManager.bootIOSDevices(model, req.query, req.query.count).then((value) => {
        res.json("IOS emualtors are booted! " + value);
      })
    };

    router.get("/devices/boot/ios", bootIOSDeviceFilter, (req: Request, res: Response, next: NextFunction) => {
      res.json("IOS simulatorors are dead!");
    });

    const bootAndroidDeviceFilter = function (req, res, next) {
      DeviceManager.bootAndroidDevices(model, req.query, req.query.count).then(() => {
        res.json("Android emualtors are booted!");
      })
    };

    router.get("/devices/boot/android", bootAndroidDeviceFilter, (req: Request, res: Response, next: NextFunction) => {
      res.json("Android emulators failed to boot!");
    });

    const refreshFilter = function (req, res, next) {
      DeviceManager.refreshData(model, req.query).then(() => {
        res.json("Data is refreshed");
      })
    };

    router.get("/devices/refresh", refreshFilter, (req: Request, res: Response, next: NextFunction) => {
      res.json("Data failed to refresh!");
    });
  }

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The home page route.
   *
   * @class IndexRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public get(req: Request, res: Response, next: NextFunction) {
    //set custom title
    this.title = "Home | Device manager server!";

    //set message
    let options: Object = {
      "message": "Welcome to the device manager server"
    };

    //render template
    this.render(req, res, "index", options);
  }

  public static async refreshData(model: IModel) {
    DeviceManager.killAll(model);
    console.log("Data refreshed")
  }
}