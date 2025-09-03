import router from "@adonisjs/core/services/router";
import UserController from "../../app/controller/UserController.js";
import { AuthMiddleware } from "#middleware/auth_middleware";

const user = new UserController();
const md = new AuthMiddleware();


router.post('/user', user.create);
router.get('/user', (ctx)=>md.middle(ctx, ()=> user.read(ctx)));
router.post('/login', user.login);
router.get('/logout', user.logout);
router.get('/validate', (ctx)=>md.middle(ctx, ()=> user.validateLogin(ctx)) );