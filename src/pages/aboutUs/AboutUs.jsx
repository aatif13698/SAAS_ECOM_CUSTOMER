// AboutUs.jsx
import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-950 bg-black/80 text-gray-100 font-sans">
      {/* Hero Images Section */}
      <div className="relative h-[80vh] min-h-[600px] md:h-[90vh] overflow-hidden">
        {/* Image 1 */}
        <div className="absolute top-[10%] left-[5%] w-[40%] md:w-[42%] z-30 transform rotate-[-3deg] transition-all duration-500 hover:scale-105 hover:rotate-[-1deg] hover:shadow-2xl">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-gray-800/40">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80"
              alt="Team working together"
              className="w-[100%] h-auto object-cover aspect-[4/5]"
            />
          </div>
        </div>

        {/* Image 2 - Center overlapping */}
        <div className="absolute top-[18%] left-[28%] w-[38%] md:w-[40%] z-20 transform rotate-[4deg] transition-all duration-500 hover:scale-105 hover:rotate-[2deg] hover:shadow-2xl">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-gray-800/40">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Creative brainstorming"
              className="w-[100%] h-auto object-cover aspect-[4/5]"
            />
          </div>
        </div>

        {/* Image 3 */}
        <div className="absolute top-[25%] right-[5%] w-[36%] md:w-[38%] z-10 transform rotate-[6deg] transition-all duration-500 hover:scale-105 hover:rotate-[4deg] hover:shadow-2xl">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-gray-800/40">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
              alt="Team celebrating success"
              className="w-[100%] h-auto object-cover aspect-[4/5]"
            />
          </div>
        </div>
      </div>

      {/* Content Section - Moved outside images with no overlap */}
      <div className="relative z-40 px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent mb-10">
            We Build the Future, Together
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            We are a passionate team of creators, thinkers, and builders who believe that great products come from great collaboration. 
            <br className="hidden md:block" />
            Since day one, we've been obsessed with solving real problems with elegant, thoughtful design and powerful technology.
            <br className="hidden md:block" />
            Our mission is simple: create experiences that people love and businesses grow from — every single day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;