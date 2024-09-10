import { Dependencies } from "../../libs/entities/interfaces";
import { getAllUserController } from "./getAllUser.controller";

const adminController = (dependecies: Dependencies) => {
    return {
        getAllUserController: getAllUserController(dependecies),
    }
}

export { adminController }