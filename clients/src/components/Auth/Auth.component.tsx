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
    <div className="relative h-screen flex justify-center items-center">
      <div className={`${modal ? "opacity-25" : ""} transition-opacity flex flex-col`}>
        <div
          className={`tablet:container mx-2 flex justify-center items-start`}
        >
          <div className="flex justify-center items-center flex-col md:item md:flex-row ml-4 gap-6 lg:gap-x-20 w-full max-w-6xl">
            <div className="w-96 md:w-auto">
              <div className="text-center md:text-start mb-4">
                <h1 className="text-4xl font-bold font-roboto mb-4 mr-10 md:mr-auto">
                  ProSphere
                </h1>
                <p className="text-lg font-normal text-start max-w-xl font-roboto text-zinc-500 antialiased ">
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
