import { useState } from 'react';
import { Rocket, Users, Building2, ArrowRightCircle } from 'lucide-react';

const FeatureCards = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  
  const features = [
    {
      icon: <Rocket className="w-8 h-8 text-white" />,
      title: "Fast Recruitment",
      description: "Streamline your hiring process with our advanced matching algorithms that connect you with the right candidates faster.",
      color: "from-orange-500 to-orange-600",
      hoverColor: "from-orange-600 to-orange-700"
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Top Talent Pool",
      description: "Access a curated network of skilled professionals across industries, vetted and ready to contribute to your success.",
      color: "from-orange-400 to-orange-500",
      hoverColor: "from-orange-500 to-orange-600"
    },
    {
      icon: <Building2 className="w-8 h-8 text-white" />,
      title: "Enterprise Solutions",
      description: "Customized recruitment solutions for businesses of all sizes, tailored to meet your specific organizational needs.",
      color: "from-orange-300 to-orange-500",
      hoverColor: "from-orange-400 to-orange-600"
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Powerful Features</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Discover how our innovative platform can transform your recruitment process</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {features.map((feature, index: number) => (
            <div 
              key={index}
              className="relative overflow-hidden group"
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className={`
                h-full flex flex-col rounded-2xl transition-all duration-300
                ${activeCard === index ? 'transform -translate-y-2' : ''}
              `}>
                
                <div className={`
                  p-6 relative overflow-hidden bg-gradient-to-br ${activeCard === index ? feature.hoverColor : feature.color}
                  transform transition-all duration-500
                `}>
        
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white opacity-10"></div>
                  <div className="absolute top-12 -right-10 w-16 h-16 rounded-full bg-white opacity-5"></div>
                  
                  <div className="relative z-10">
                    <div className="bg-white/20 rounded-full p-4 inline-flex items-center justify-center backdrop-blur-sm mb-4 shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  </div>
                </div>

                <div className={`
                  flex-grow p-6 bg-white rounded-b-2xl shadow-lg transition-all duration-300
                  ${activeCard === index ? 'shadow-xl border-t-4 border-orange-300' : 'shadow-md'}
                `}>
                  <p className="text-gray-700 mb-6">{feature.description}</p>
                  <div className={`
                    flex items-center text-orange-600 font-medium transition-all duration-300
                    ${activeCard === index ? 'opacity-100 translate-x-0' : 'opacity-70'}
                  `}>
                    Learn more
                    <ArrowRightCircle className={`
                      ml-2 w-5 h-5 transition-all duration-500
                      ${activeCard === index ? 'translate-x-1' : ''}
                    `} />
                  </div>
                </div>
              </div>
              
              <div className={`
                absolute inset-0 rounded-2xl border-2 border-orange-300 opacity-0
                transition-all duration-500 pointer-events-none
                ${activeCard === index ? 'opacity-100 scale-105' : 'scale-100'}
              `}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;