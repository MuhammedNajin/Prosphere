import { Dependencies } from "@domain/entities/interfaces";
import { getAllUserController } from "./getAllUser.controller";
import { blockUserController } from "./blockUser.controller";
import { logoutController } from "./logout.controller";

const adminController = (dependecies: Dependencies) => {
    return {
        getAllUserController: getAllUserController(dependecies),
        blockUserController: blockUserController(dependecies),
        logoutController: logoutController(dependecies),
    }
}

export { adminController }