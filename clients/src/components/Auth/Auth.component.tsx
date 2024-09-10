import React, { useEffect, useState } from "react";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import SignUpComponent from "./signUp.component";
import LoginComponent from "./login.component";

interface Type {
  type: boolean;
}

const Auth: React.FC<Type> = ({ type }) => {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    console.log(modal);
  }, [modal]);

  const closeModal = () => {
    setModal((state) => !state);
  };

  return (
    <div className="relative h-screen">
      <div className={`${modal ? "opacity-25" : ""} transition-opacity`}>
        <div
          className={`lg:container lg:mx-auto mx-2 flex items-center justify-center h-full lg:mt-32 sm:mt-16 mt-10 px-4`}
        >
          <div className="grid lg:grid-cols-5 md:grid-cols-4  grid-cols-1 gap-6 w-full max-w-5xl">
            <div className="md:col-start-1 md:col-end-3 lg:col-span-3 col-span-1 p-4 lg:ms-3 lg:mt-7 mt-4">
              <div className="lg:text-start text-center mt-14 lg:mt-10 md:mt-8 sm:mt-6">
                <h1 className="text-5xl font-bold font-roboto mb-4 sm:text-4xl text-3xl">
                  ProSphere
                </h1>
                <p className="text-xl font-normal max-w-2xl font-roboto text-zinc-500 antialiased sm:text-lg text-base">
                  Discover opportunities and connect with professionals through
                  our platform where your career meets community.
                </p>
              </div>
            </div>

            {type ? (
              <SignUpComponent setModal={setModal} />
            ) : (
              <LoginComponent setModal={setModal} />
            )}
          </div>
        </div>
      </div>
      {modal && (
        <div className="absolute inset-0 flex items-center justify-center">
          {type ? (
            <SignUpModal closeModal={closeModal} />
          ) : (
            <LoginModal closeModal={closeModal} />
          )}
        </div>
      )}
    </div>
  );
};

export default Auth;
