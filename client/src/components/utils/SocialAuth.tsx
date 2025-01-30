import React, { ReactNode } from 'react';


interface SignInButtonProps {
  handler: () => void;
  Icon: ReactNode;
  text: string
}

const SocialAuth: React.FC<SignInButtonProps> = (props) => {

    const { Icon, handler, text } = props;
  return (
    <button
    type='button'
      onClick={() => handler()}
      className="flex w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      { Icon }
      <span className='ms-2 font-normal font-roboto'>{ text }</span>
    </button>
  );
};

export default SocialAuth;

