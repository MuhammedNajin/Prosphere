const verifyUserUseCase = (depedencies: any) => {
 
    const {
      repository: { userRepository },
    } = depedencies;

    
    const execute = (userId: string) => {
        try {
            const verify = userRepository.verifyUser(userId);
            return verify;
        } catch (error) {
            console.log(error);
            
        }
      };
  
      return {
        execute,
      };


};

export { verifyUserUseCase }