import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { IModel } from "../models/model";
import { IUserModel } from "../models/user";

/**
 * / route
 *
 * @class User
 */
export class UsersRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router, model: IModel) {
    //log
    // model.user.create({name:"KOR1"});
    // model.user.create({name:"KOR2"});
    // model.user.create({name:"KOR3"});
    // model.user.create({name:"KOR4"}).catch((er)=>{
    //   console.log(er);
    // });


    router.get("/users", (req: Request, res: Response, next: NextFunction) => {
      model.user.find((error, users) => {
        res.json(users);
      });
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
    this.title = "Home | Tour of mylovemarks";

    //set message
    let options: Object = {
      "message": "Welcome to the Tour of mylovemarks"
    };

    //render template
    this.render(req, res, "index", options);
  }
}