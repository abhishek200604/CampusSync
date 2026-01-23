import { ArrowLeft, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    const developers = [
        {
            name: 'Pratik Tawhare',
            image: 'https://ui-avatars.com/api/?name=Pratik+Tawhare&background=8b5cf6&color=fff&size=200',
            linkedin: 'https://www.linkedin.com/in/pratik-tawhare',
        },
        {
            name: 'Abhijeet Suryawanshi',
            image: 'https://ui-avatars.com/api/?name=Abhijeet+Suryawanshi&background=3b82f6&color=fff&size=200',
            linkedin: 'https://www.linkedin.com/in/abhijeet-suryawanshi-21a587294',
        },
        {
            name: 'Abhishek Tamte',
            image: 'https://ui-avatars.com/api/?name=Abhishek+Tamte&background=ec4899&color=fff&size=200',
            linkedin: 'https://www.linkedin.com/in/abhishek-tamte-09b81421a/',
        },
        {
            name: 'Aary Thasal',
            image: 'https://ui-avatars.com/api/?name=Aary+Thasal&background=10b981&color=fff&size=200',
            linkedin: 'https://www.linkedin.com/in/aary-thasal-9255392a7',
        },
        {
            name: 'Shahid Shaikh',
            image: 'https://ui-avatars.com/api/?name=Shahid+Shaikh&background=f59e0b&color=fff&size=200',
            linkedin: '#',
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <header className="max-w-7xl mx-auto px-6 py-6">
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors group font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </header>
            </div>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                    Meet the Creators
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    The brilliant minds from <span className="text-blue-600 font-semibold">ZCOER</span> behind CampusSync.
                    Dedicated to revolutionizing college management through technology.
                </p>

                <div className="inline-block relative">
                    <div className="px-6 py-2 bg-white rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                        <span className="text-gray-500 font-medium text-sm">Batch</span>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <span className="font-bold text-blue-600">
                            ZCOER - 2027
                        </span>
                    </div>
                </div>
            </main>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-center">
                    {developers.map((dev, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex flex-col items-center">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-full p-1 bg-white border border-gray-100 shadow-sm">
                                        <img
                                            src={dev.image}
                                            alt={dev.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-base font-bold text-gray-900 mb-6 text-center">{dev.name}</h3>

                                <div className="flex gap-2 w-full justify-center pt-4 border-t border-gray-50">
                                    <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-8 text-center">
                <p className="text-gray-500 text-sm">
                    Designed & Developed by Batch 2027 • ZCOER
                </p>
            </footer>
        </div>
    );
};

export default About;
