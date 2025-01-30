
const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`relative ${sizes[size]} rounded-full flex items-center justify-center`}>
  
      <div className="absolute inset-0 bg-gradient-to-br from-orange-700 to-orange-800 rounded-full shadow-lg">
   
        <div className="absolute inset-0 flex items-center justify-center">
      
          <span className="text-white font-bold" style={{ 
            fontSize: size === 'sm' ? '1rem' : 
                     size === 'md' ? '1.5rem' : 
                     size === 'lg' ? '2rem' : '2.5rem' 
          }}>P</span>
          
       
          <div className="absolute inset-0 border-2 border-orange-200/30 rounded-full animate-spin-slow" 
               style={{ animationDuration: '8s' }} />
          
          <div className="absolute w-2 h-2 bg-white  rounded-full animate-orbit" 
               style={{ 
                 top: '10%',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 animationDuration: '4s'
               }} />
        </div>
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes orbit {
    from { transform: translateX(-50%) rotate(0deg) translateY(-20px) rotate(0deg); }
    to { transform: translateX(-50%) rotate(360deg) translateY(-20px) rotate(-360deg); }
  }
`;
document.head.appendChild(style);

export default Logo;