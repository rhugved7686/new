"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import CabBookingForm from "@/components/CabBookingForm";
import BusBookingForm from "@/components/BusBookingForm";
import HotelBookingForm from "@/components/HotelBookingForm";
import FlightBookingForm from "@/components/FlightBookingForm";
import HomestaysBookingForm from "@/components/HomestaysBookingForm";
import HolidayBookingForm from "@/components/HolidayBookingForm";
import FloatingIcons from "@/components/FloatingIcons";

// Counter hook for animated numbers
const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const startTime = Date.now();
            const animate = () => {
              const currentTime = Date.now();
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              setCount(Math.floor(target * progress));
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(target);
              }
            };
            animate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return { count, elementRef };
};

// FAQ Item Component
function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 border-t border-gray-200">
          <p className="text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function GondiaCabServicePage() {
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState('cabs');

  // Initialize counters at component level
  const personalCabsCounter = useCounter(30);
  const registeredCabsCounter = useCounter(500);
  const citiesCounter = useCounter(100);
  const officesCounter = useCounter(50);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderBookingForm = () => {
    switch (activeTab) {
      case 'cabs':
        return <CabBookingForm />;
      case 'buses':
        return <BusBookingForm />;
      case 'flights':
        return <FlightBookingForm />;
      case 'hotels':
        return <HotelBookingForm />;
      case 'homestays':
        return <HomestaysBookingForm />;
      case 'holiday':
        return <HolidayBookingForm />;
      default:
        return <CabBookingForm />;
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 max-w-lg w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                There was an error loading this page. Please try again later.
              </p>
            </div>
          </div>
        </div>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  try {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onTabChange={handleTabChange} disableForm={true} />
        
        {/* Hero Section with Background */}
        <div className="relative h-[550px]">
          <div className="absolute inset-0">
            <Image
              src="/images/gondia.jpg"
              alt="Gondia City"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          <div className="relative z-10 h-full">
            <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-full flex flex-col justify-center">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Gondia Cab Booking
                </h1>
              </div>
              
              {renderBookingForm()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="bg-gray-50">
          {/* New Hero Content Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l7.9-7.9h-.828zm5.656 0L19.515 8.485 17.343 10.657 28 0h-2.83zM32.656 0L26.172 6.485 24 8.657 34.657 0h-2zM38.315 0L29.828 8.485 27.657 10.657 38.315 0zm5.657 0l-5.657 5.657L36.485 7.828 42.142 0h2.83zM53.657 0l3.657 3.657L43.828 17.143l-1.414-1.414L53.657 0zM17.143 42.414l3.657 3.657-.828.828-3.657-3.657.828-.828zM0 22.344l3.657 3.657L0 29.657V22.344zM54.627 60l.83-.828-1.415-1.415L51.8 60h2.827zM5.373 60l-.83-.828L5.96 57.757 8.2 60H5.374zM48.97 60l3.657-3.657-1.414-1.414L46.143 60h2.828zM11.03 60L7.372 56.343 8.787 54.93 13.857 60H11.03zm32.284 0L49.8 53.515l-1.415-1.414-7.9 7.9h2.83zM16.686 60L10.2 53.515l1.415-1.414 7.9 7.9h-2.83zm5.657 0L13.857 51.515l1.415-1.414 7.9 7.9h-.828zM28 60l-8.485-8.485L17.343 49.343 28 60zm4.657 0l-6.485-6.485L24 51.343 34.657 60h-2zm5.657 0l-8.485-8.485L27.657 49.343 38.315 60zm5.657 0l-5.657-5.657 1.414-1.415 5.657 5.657h-1.414zM53.657 60l3.657-3.657L43.828 42.857l-1.414 1.414L53.657 60zM17.143 17.586l3.657-3.657-.828-.828-3.657 3.657.828.828zM0 37.656l3.657-3.657L0 30.343v7.313z\' fill=\'%23000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                backgroundSize: '24px 24px'
              }}></div>
            </div>
            <div className="max-w-7xl mx-auto relative">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative inline-block">
                  Best Cab Services in Gondia
                  <div className="absolute bottom--4 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </h2>
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-xl p-12 mb-12 transform hover:scale-[1.02] transition-all duration-300">
                    <p className="text-2xl text-gray-600 leading-relaxed">
                      When you need reliable and affordable cab services in Gondia, Worldtriplink (WTL) is here to offer you an unbeatable experience. Whether you're looking for a Pune to Gondia cab service, exploring local city-to-city tour packages, or need transportation for business or leisure, WTL is the go-to provider for all your travel needs.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-4 mr-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Pune to Gondia</h3>
                      </div>
                      <p className="text-lg text-gray-600">Reliable and comfortable cab services from Pune to Gondia with experienced drivers.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full p-4 mr-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">City Tours</h3>
                      </div>
                      <p className="text-lg text-gray-600">Explore Gondia with our local city-to-city tour packages and sightseeing services.</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-4 mr-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Business Travel</h3>
                      </div>
                      <p className="text-lg text-gray-600">Professional transportation services for business and corporate travel needs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-full mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                  Best Cab Services in Gondia
                  <div className="absolute bottom--4 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </h2>
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-xl p-12 mb-12 transform hover:scale-[1.02] transition-all duration-300">
                    <p className="text-2xl text-gray-600 leading-relaxed">
                      As one of the best cab service providers in India, WTL has established itself as the best cab service in Gondia, offering a seamless travel experience at competitive prices.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-4 mr-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Reliable Services</h3>
                      </div>
                      <p className="text-lg text-gray-600">Reliability is at the heart of our services. Our fleet of well-maintained vehicles and experienced drivers ensure that your trips, whether it's a Pune to Gondia cab service or any other destination, are timely and dependable.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full p-4 mr-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Affordable Pricing</h3>
                      </div>
                      <p className="text-lg text-gray-600">We offer competitive pricing for our cab services in Gondia. From Pune to Gondia and Gondia to Pune, our rates are transparent, with no hidden charges.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 relative inline-block">
              Our Cab Services in Gondia
              <div className="absolute bottom--4 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Pune to Gondia Cab Service</h3>
                <p className="text-gray-600 text-lg">Traveling from Pune to Gondia can often be time-consuming, but with WTL's Pune to Gondia cab service, you can enjoy a comfortable and hassle-free ride. Our service ensures punctuality, 24/7 availability, and customized travel packages.</p>
              </div>
              <div className="group bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-xl p-8 border border-purple-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">Gondia to Pune Cab Services</h3>
                <p className="text-gray-600 text-lg">Once you've completed your visit to Gondia, Gondia to Pune cab services from WTL ensure a smooth return journey. Our fleet of well-maintained vehicles and professional drivers make your journey comfortable and safe.</p>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Route-wise Pricing and Kilometers Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-lg">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Distance (km)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cab Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pune to Gondia</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">330 km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sedan (Compact)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6,500</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pune to Gondia</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">330 km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SUV (Luxury)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">9,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gondia to Pune</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">330 km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sedan (Compact)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6,500</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gondia to Pune</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">330 km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SUV (Luxury)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">9,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">Note: Prices are indicative and may vary depending on availability, time of year, and demand.</p>
          </section>

          {/* About Us Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l7.9-7.9h-.828zm5.656 0L19.515 8.485 17.343 10.657 28 0h-2.83zM32.656 0L26.172 6.485 24 8.657 34.657 0h-2zM38.315 0L29.828 8.485 27.657 10.657 38.315 0zm5.657 0l-5.657 5.657L36.485 7.828 42.142 0h2.83zM53.657 0l3.657 3.657L43.828 17.143l-1.414-1.414L53.657 0zM17.143 42.414l3.657 3.657-.828.828-3.657-3.657.828-.828zM0 22.344l3.657 3.657L0 29.657V22.344zM54.627 60l.83-.828-1.415-1.415L51.8 60h2.827zM5.373 60l-.83-.828L5.96 57.757 8.2 60H5.374zM48.97 60l3.657-3.657-1.414-1.414L46.143 60h2.828zM11.03 60L7.372 56.343 8.787 54.93 13.857 60H11.03zm32.284 0L49.8 53.515l-1.415-1.414-7.9 7.9h2.83zM16.686 60L10.2 53.515l1.415-1.414 7.9 7.9h-2.83zm5.657 0L13.857 51.515l1.415-1.414 7.9 7.9h-.828zM28 60l-8.485-8.485L17.343 49.343 28 60zm4.657 0l-6.485-6.485L24 51.343 34.657 60h-2zm5.657 0l-8.485-8.485L27.657 49.343 38.315 60zm5.657 0l-5.657-5.657 1.414-1.415 5.657 5.657h-1.414zM53.657 60l3.657-3.657L43.828 42.857l-1.414 1.414L53.657 60zM17.143 17.586l3.657-3.657-.828-.828-3.657 3.657.828.828zM0 37.656l3.657-3.657L0 30.343v7.313z\' fill=\'%23000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                backgroundSize: '24px 24px'
              }}></div>
            </div>

            <div className="relative">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12 relative inline-block">
                About Us – Worldtriplink
                <div className="absolute bottom--4 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform hover:scale-[1.02] transition-all duration-300">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Worldtriplink (WTL) was established in 2016 in Pune with a mission to offer reliable and convenient travel services across India. Since our inception, we have grown to become a leading provider of outstation cab services, employee transportation, daily pick-up & drop services, and hotel & flight bookings.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div ref={personalCabsCounter.elementRef} className="text-5xl font-bold text-blue-600 mb-4">
                      {personalCabsCounter.count}+
                    </div>
                    <p className="text-gray-600 font-medium">Personal Cabs operating across India</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div ref={registeredCabsCounter.elementRef} className="text-5xl font-bold text-purple-600 mb-4">
                      {registeredCabsCounter.count}+
                    </div>
                    <p className="text-gray-600 font-medium">Registered Cabs in our fleet</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div ref={citiesCounter.elementRef} className="text-5xl font-bold text-green-600 mb-4">
                      {citiesCounter.count}+
                    </div>
                    <p className="text-gray-600 font-medium">Cities Covered with reliable services</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div ref={officesCounter.elementRef} className="text-5xl font-bold text-amber-600 mb-4">
                      {officesCounter.count}+
                    </div>
                    <p className="text-gray-600 font-medium">Corporate Clients served</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions (FAQs)</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <FaqItem
                question="How do I book a cab from Pune to Gondia?"
                answer="Booking a Pune to Gondia cab service is simple! You can book online through our website, or you can give us a call to speak with our customer support team. Our booking process is quick and easy."
              />
              <FaqItem
                question="What types of cabs are available for the Pune to Gondia route?"
                answer="We offer a wide variety of cabs for your journey, including compact sedans and luxury SUVs. Choose the vehicle that best suits your needs."
              />
              <FaqItem
                question="How much does a cab service from Gondia to Pune cost?"
                answer="Our Gondia to Pune cab service starts at INR 6,500 for a standard sedan. Pricing may vary based on the vehicle type and time of booking."
              />
              <FaqItem
                question="Are your drivers trained and experienced?"
                answer="Yes, all our drivers are professionally trained, licensed, and knowledgeable about the routes to ensure a safe and comfortable journey."
              />
              <FaqItem
                question="Do you offer local city-to-city tour packages in Gondia?"
                answer="Yes, we offer customized local city-to-city tour packages in Gondia. Let us know your preferences, and we will arrange the perfect itinerary for you."
              />
              <FaqItem
                question="Do you offer hotel and flight services as well?"
                answer="Yes, alongside outstation cab services, we also offer hotel and flight booking services, providing you with a complete travel solution."
              />
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l7.9-7.9h-.828zm5.656 0L19.515 8.485 17.343 10.657 28 0h-2.83zM32.656 0L26.172 6.485 24 8.657 34.657 0h-2zM38.315 0L29.828 8.485 27.657 10.657 38.315 0zm5.657 0l-5.657 5.657L36.485 7.828 42.142 0h2.83zM53.657 0l3.657 3.657L43.828 17.143l-1.414-1.414L53.657 0zM17.143 42.414l3.657 3.657-.828.828-3.657-3.657.828-.828zM0 22.344l3.657 3.657L0 29.657V22.344zM54.627 60l.83-.828-1.415-1.415L51.8 60h2.827zM5.373 60l-.83-.828L5.96 57.757 8.2 60H5.374zM48.97 60l3.657-3.657-1.414-1.414L46.143 60h2.828zM11.03 60L7.372 56.343 8.787 54.93 13.857 60H11.03zm32.284 0L49.8 53.515l-1.415-1.414-7.9 7.9h2.83zM16.686 60L10.2 53.515l1.415-1.414 7.9 7.9h-2.83zm5.657 0L13.857 51.515l1.415-1.414 7.9 7.9h-.828zM28 60l-8.485-8.485L17.343 49.343 28 60zm4.657 0l-6.485-6.485L24 51.343 34.657 60h-2zm5.657 0l-8.485-8.485L27.657 49.343 38.315 60zm5.657 0l-5.657-5.657 1.414-1.415 5.657 5.657h-1.414zM53.657 60l3.657-3.657L43.828 42.857l-1.414 1.414L53.657 60zM17.143 17.586l3.657-3.657-.828-.828-3.657 3.657.828.828zM0 37.656l3.657-3.657L0 30.343v7.313z\' fill=\'%23FFFFFF\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                backgroundSize: '24px 24px'
              }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                  Contact WTL Tourism Pvt. Ltd. Today!
                </h2>
                <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
                  Experience the best cab service in Gondia with our professional and reliable transportation solutions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Call/WhatsApp</h3>
                      <div className="space-y-2">
                        <a href="tel:9112085055" className="block text-xl font-bold text-white hover:text-blue-200 transition-colors">
                          +91 91120 85055
                        </a>
                        <a href="tel:9130030054" className="block text-xl font-bold text-white hover:text-blue-200 transition-colors">
                          +91 91300 30054
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Visit Our Website</h3>
                      <a 
                        href="https://www.worldtriplink.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xl font-bold text-white hover:text-blue-200 transition-colors"
                      >
                        www.worldtriplink.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Link href="/">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Book Your Ride Now
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <FloatingIcons />
      </div>
    );
  } catch (error) {
    setHasError(true);
    return null;
  }
}
