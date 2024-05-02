import { Router } from "express"
import messagesController from "../controllers/messages.controller.js";

const messageRouter = Router();

messageRouter.get('/chat', messagesController.getMessages);

export default messageRouter;