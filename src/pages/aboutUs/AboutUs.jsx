// AboutUs.jsx
import React, { useEffect, useState } from 'react';
import customerService from '../../services/customerService';
import Loading from '../../components/Loading/Loading';

const AboutUs = () => {
    const [statement, setStatement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const type = 'About';
        getStatement(type);
    }, []);

    async function getStatement(type) {
        try {
            const response = await customerService.getStatement(type);
            setStatement(response?.data?.data);
        } catch (error) {
            console.error('Error while getting the statement:', error);
            setError('Failed to load privacy statement. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div>
                <Loading />
            </div>)
    }

    if (error) {
        return <div>{error}</div>; // Error message
    }
    return (
        <div className="min-h-screen bg-gray-950 bg-black/80 text-gray-100 font-sans">

            {/* Hero Images Section */}
            <div className="relative h-[80vh] min-h-[600px] md:h-[90vh] overflow-hidden">
                {/* Image 1 */}
                <div className="absolute top-[10%] left-[5%] w-[40%] md:w-[32%] z-30 transform rotate-[-3deg] transition-all duration-500 hover:scale-105 hover:rotate-[-1deg] hover:shadow-2xl">
                    <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-gray-800/40">
                        <img
                            src={statement?.images[0]}
                            alt="Team working together"
                            className="w-[100%] h-auto object-cover aspect-[4/5]"
                        />
                    </div>
                </div>

                {/* Image 2 - Center overlapping */}
                <div className="absolute top-[18%] left-[28%] w-[38%] md:w-[30%] z-20 transform rotate-[4deg] transition-all duration-500 hover:scale-105 hover:rotate-[2deg] hover:shadow-2xl">
                    <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-gray-800/40">
                        <img
                            src={statement?.images[1]}
                            alt="Creative brainstorming"
                            className="w-[100%] h-auto object-cover aspect-[4/5]"
                        />
                    </div>
                </div>

                {/* Image 3 */}
                <div className="absolute top-[25%] right-[5%] w-[36%] md:w-[38%] z-10 transform rotate-[6deg] transition-all duration-500 hover:scale-105 hover:rotate-[4deg] hover:shadow-2xl">
                    <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-gray-800/40">
                        <img
                            src={statement?.images[2]}
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
                        {statement?.title}
                    </h1>

                    <div
                        className="prose prose-lg" // Optional: Use Tailwind's prose for better rich text styling
                        dangerouslySetInnerHTML={{ __html: statement.description }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutUs;