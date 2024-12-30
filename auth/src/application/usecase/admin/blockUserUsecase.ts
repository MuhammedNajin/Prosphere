
import { Dependencies} from "@domain/entities/interfaces";



export const blockUserUseCase = (dependencies: Dependencies) => {
    const {
        repository: { userRepository }
    } = dependencies;

    if(!userRepository) {
        throw new Error("dependencies error, missing dependencies");
    }

    const execute = async (id: string) => {
        const bloked = await userRepository.blockUser(id);
        return bloked;
    }

    return {
        execute,
    }
}