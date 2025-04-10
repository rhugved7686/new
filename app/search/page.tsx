"use client"
import React from 'react'
import { useState, useEffect, Suspense } from "react"
import Footer from "@/components/footer"
import { useSearchParams } from 'next/navigation'
import Navbar2 from "../../components/Navbar2"
import axios from 'axios'

interface Car {
  type: string;
  image?: string;
  features?: string[];
  rating?: number;
  reviews?: number;
  category?: string;
}

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  key?: string | number;
  type?: 'button' | 'submit' | 'reset';
}

function Button({ children, className, onClick, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface CarType {
  title: string;
  subtitle: string;
  image: string;
  priceKey: string;
  options?: string[];
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}

function SearchResultsContent() {
  const DEBUG_MODE = true;
  const [selectedCategory, setSelectedCategory] = useState("All Cars")
  const [distance, setDistance] = useState<number | null>(null)
  const [tripInfo, setTripInfo] = useState<any>(null)
  const [cabInfo, setCabInfo] = useState<Car[]>([
    {
      type: "Hatchback",
      image: "/images/hatchback-car.jpg",
      rating: 4.5,
      reviews: 48,
      features: ["4+1 Seater", "USB Charging", "Air Conditioning", "Music System"],
      category: "Hatchback"
    },
    {
      type: "Sedan",
      image: "/images/sedan-car.jpg",
      rating: 4.7,
      reviews: 52,
      features: ["4+1 Seater", "USB Charging", "Air Conditioning", "Music System"],
      category: "Sedan"
    },
    {
      type: "Sedan Premium",
      image: "/images/city.jpg",
      rating: 4.8,
      reviews: 45,
      features: ["4+1 Seater", "USB Charging", "Climate Control", "Premium Sound System"],
      category: "Sedan Premium"
    },
    {
      type: "SUV",
      image: "/images/suv.jpg",
      rating: 4.8,
      reviews: 56,
      features: ["6+1 Seater", "USB Charging", "Climate Control", "Premium Sound System"],
      category: "SUV"
    },
    {
      type: "MUV",
      image: "/images/innova.jpg",
      rating: 4.7,
      reviews: 52,
      features: ["7+1 Seater", "USB Charging", "Climate Control", "Entertainment System"],
      category: "MUV"
    }
  ])
  const [days, setDays] = useState<number>(0)
  const [isClient, setIsClient] = useState(false)
  const searchParams = useSearchParams()
  const [selectedCar, setSelectedCar] = useState("Maruti Wagonr")
  const [selectedCarImage, setSelectedCarImage] = useState("/images/wagonr.jpg")
  const [selectedSedan, setSelectedSedan] = useState("Maruti Swift Dzire")
  const [selectedSedanImage, setSelectedSedanImage] = useState("/images/swift.jpg")
  const [selectedSUV, setSelectedSUV] = useState("Maruti Ertiga")
  const [selectedSUVImage, setSelectedSUVImage] = useState("/images/ertiga.jpg")
  const [selectedSedanPremium, setSelectedSedanPremium] = useState("Honda City")
  const [selectedSedanPremiumImage, setSelectedSedanPremiumImage] = useState("/images/city.jpg")
  // const[trip,setTripInfo] = useState([])
  
  const debugLog = (...args: any[]) => {
    if (DEBUG_MODE) {
      console.log('[DEBUG]', ...args);
    }
  }
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchCabDataPost = async () => {
    try {
      // 1. Prepare parameters EXACTLY as in Postman
      const params = new URLSearchParams();
      params.append('tripType', searchParams.get('tripType') || 'oneWay');
      params.append('pickupLocation', searchParams.get('pickup') || '');
      params.append('dropLocation', searchParams.get('drop') || '');
      params.append('date', searchParams.get('date') || '');
      params.append('time', searchParams.get('time') || '');
      params.append('Returndate', searchParams.get('Returndate') || '');
  
      // 2. Add debug logging
      console.log('Sending params:', Object.fromEntries(params));
  
      // 3. Make the request with identical Postman configuration
      const response = await axios.post(
        'https://api.worldtriplink.com/api/cab1',
        params.toString(),
        {
          // headers: {
          //   'Content-Type': 'application/x-www-form-urlencoded',
          //   'Accept': 'application/json',
          //   // Add any other headers you see in Postman
          // },
          // Add these if shown in Postman
        }
      );
  
      // 4. Validate response structure
      if (!response.data?.tripinfo) {
        console.error('Unexpected response structure', response.data);
        throw new Error('Invalid API response');
      }
  
      console.log('Full API response:', response.data);
      setTripInfo(response.data);
      return response.data;
  
    } catch (error) {
      // Enhanced error diagnostics
      if (axios.isAxiosError(error)) {
        console.error(
          'API Error:',
          error.response?.status,
          error.response?.data || error.message
        );
        
        // Special case for 301 redirects
        if (error.response?.status === 301) {
          console.error('Permanent redirect to:', error.response.headers.location);
        }
      } else {
        console.error('Unexpected error:', error);
      }
      
      throw error;
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      try {
        const data = await fetchCabDataPost();
        debugLog("API response:", data);
        
        if (data.distance && data.distance > 0) {
          setDistance(data.distance);
        }
        
        if (data.tripinfo && data.tripinfo.length > 0) {
          setTripInfo(data.tripinfo[0]);
        }
        
        if (data.days && data.days > 0) {
          setDays(data.days);
        }
        
        if (data.cabinfo && data.cabinfo.length > 0) {
          setCabInfo(data.cabinfo);
        }
      } catch (error) {
        console.error("Error fetching cab data:", error);
      }
    };

    fetchData();
  }, [isClient, searchParams]);

  const getLatestPrice = (carType: string): number => {
    try {
      const currentTripInfo = tripInfo || {};
      const currentDistance = distance || 100;
      const currentDays = days || 1;
      
      let basePrice = 0;
      switch(carType.toLowerCase()) {
        case 'hatchback':
          basePrice = currentTripInfo?.hatchback ? Number(currentTripInfo.hatchback) : tripInfo.tripinfo.hatchback*tripInfo.distance;
          break;
        case 'sedan':
          basePrice = currentTripInfo?.sedan ? Number(currentTripInfo.sedan) : "";
          break;
        case 'sedan premium':
          basePrice = currentTripInfo?.sedanpremium ? Number(currentTripInfo.sedanpremium) : "";
          break;
        case 'suv':
          basePrice = currentTripInfo?.suv ? Number(currentTripInfo.suv) : "";
          break;
        case 'muv':
          basePrice = currentTripInfo?.suvplus ? Number(currentTripInfo.suvplus) : "";
          break;
      }

      const tripType = searchParams.get('tripType');
      let totalPrice = 0;
      
      if (tripType === 'roundTrip' || tripType === 'round-trip') {
        totalPrice = currentDistance * basePrice * currentDays;
      } else {
        totalPrice = currentDistance * basePrice;
      }

      return Math.round(totalPrice);
    } catch (error) {
      console.error('Error calculating price:', error);
      return 0;
    }
  }

  const hatchbackCars: Record<string, string> = {
    "Maruti Wagonr": "/images/wagonr.jpg",
    "Toyota Glanza": "/images/glanza.jpg",
    "Celerio": "/images/celerio.png"
  };

  const sedanCars: Record<string, string> = {
    "Maruti Swift Dzire": "/images/swift.jpg",
    "Honda Amaze": "/images/amaze.jpg",
    "Hyundai Aura/Xcent": "/images/aura.jpg",
    "Toyota etios": "/images/etios.jpg"
  };

  const suvCars: Record<string, string> = {
    "Maruti Ertiga": "/images/ertiga.jpg",
    "Mahindra Marazzo": "/images/marazzo.jpg"
  };

  const sedanPremiumCars: Record<string, string> = {
    "Honda City": "/images/city.jpg",
    "Hyundai Verna": "/images/verna.jpg",
    "Maruti Ciaz": "/images/ciaz.jpg"
  };

  const handleCarChange = (carName: string) => {
    setSelectedCar(carName);
    setSelectedCarImage(hatchbackCars[carName]);
  };

  const handleSedanChange = (carName: string) => {
    setSelectedSedan(carName);
    setSelectedSedanImage(sedanCars[carName]);
  };

  const handleSUVChange = (carName: string) => {
    setSelectedSUV(carName);
    setSelectedSUVImage(suvCars[carName]);
  };

  const handleSedanPremiumChange = (carName: string) => {
    setSelectedSedanPremium(carName);
    setSelectedSedanPremiumImage(sedanPremiumCars[carName]);
  };

  const carTypes: Record<string, CarType> = {
    'Hatchback': {
      title: 'Hatchback',
      subtitle: 'Compact Hatchback • Manual • Efficient',
      image: selectedCarImage,
      priceKey: 'hatchback',
      options: ['Maruti Wagonr', 'Toyota Glanza', 'Celerio']
    },
    'Sedan': {
      title: 'Sedan',
      subtitle: 'Luxury Sedan • Manual • Sleek Design',
      image: selectedSedanImage,
      priceKey: 'sedan',
      options: ['Maruti Swift Dzire', 'Honda Amaze', 'Hyundai Aura/Xcent', 'Toyota etios']
    },
    'Sedan Premium': {
      title: 'Sedan Premium',
      subtitle: 'Premium Sedan • Automatic • Luxury',
      image: selectedSedanPremiumImage,
      priceKey: 'sedanpremium',
      options: ['Honda City', 'Hyundai Verna', 'Maruti Ciaz']
    },
    'SUV': {
      title: 'SUV',
      subtitle: 'Premium SUV • Automatic • Spacious',
      image: selectedSUVImage,
      priceKey: 'suv',
      options: ['Maruti Ertiga', 'Mahindra Marazzo']
    },
    'MUV': {
      title: 'MUV',
      subtitle: 'Luxury MUV • Automatic • Premium',
      image: '/images/innova.jpg',
      priceKey: 'suvplus'
    }
  };

  const displayedCars = selectedCategory === "All Cars" 
    ? cabInfo 
    : cabInfo.filter(car => car.category === selectedCategory);

  const featureCards: FeatureCard[] = [
    {
      title: "Digital Check-in",
      description: "Quick vehicle access with our app",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      )
    },
    {
      title: "Premium Insurance",
      description: "Comprehensive coverage included",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F9]">
      <Navbar2 />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 gap-6">
          {displayedCars.map((car: Car, index) => {
            const price = getLatestPrice(car.type);
            const carInfo = carTypes[car.type as keyof typeof carTypes];
            
            if (!carInfo) return null;

            return (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-2/5 h-64">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20">
                      <img
                        src={car.type === "Hatchback" ? selectedCarImage : 
                             car.type === "Sedan" ? selectedSedanImage : 
                             car.type === "SUV" ? selectedSUVImage :
                             car.type === "Sedan Premium" ? selectedSedanPremiumImage :
                             car.image || '/images/innova.jpg'}
                        alt={carInfo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/innova.jpg';
                        }}
                      />
                    </div>
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Premium</span>
                      <div className="flex items-center bg-white/90 px-2 py-1 rounded-full">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm">{car.rating || 4.7}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{carInfo.title}</h3>
                        <p className="text-gray-600 text-sm">{carInfo.subtitle}</p>
                        {car.type === "Hatchback" && (
                          <div className="mt-2 flex items-center gap-4">
                            {carInfo.options?.map((option) => (
                              <div key={option} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id={option}
                                  name="carOption"
                                  checked={selectedCar === option}
                                  onChange={() => handleCarChange(option)}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <label htmlFor={option} className="text-sm text-gray-700">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        {car.type === "Sedan" && (
                          <div className="mt-2 flex items-center gap-4">
                            {carInfo.options?.map((option) => (
                              <div key={option} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id={option}
                                  name="sedanOption"
                                  checked={selectedSedan === option}
                                  onChange={() => handleSedanChange(option)}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <label htmlFor={option} className="text-sm text-gray-700">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        {car.type === "Sedan Premium" && (
                          <div className="mt-2 flex items-center gap-4">
                            {carInfo.options?.map((option) => (
                              <div key={option} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id={option}
                                  name="sedanPremiumOption"
                                  checked={selectedSedanPremium === option}
                                  onChange={() => handleSedanPremiumChange(option)}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <label htmlFor={option} className="text-sm text-gray-700">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        {car.type === "SUV" && (
                          <div className="mt-2 flex items-center gap-4">
                            {carInfo.options?.map((option) => (
                              <div key={option} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id={option}
                                  name="suvOption"
                                  checked={selectedSUV === option}
                                  onChange={() => handleSUVChange(option)}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <label htmlFor={option} className="text-sm text-gray-700">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-green-600 text-sm">Limited Time Offer</span>
                        <div className="text-2xl font-bold">₹{price}/day</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          Distance
                        </div>
                        <p className="text-sm">{distance || 149} km included</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Fuel Type
                        </div>
                        <p className="text-sm">CNG with refill breaks</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Duration
                        </div>
                        <p className="text-sm">24 Hour rental</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Free cancellation up to 1 hour before pickup</span>
                    </div>

                    <button
                      className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        if (!distance) {
                          alert("Please select pickup and drop locations to get the final price");
                          return;
                        }

                        const priceKey = carInfo.priceKey;
                        const basePrice = tripInfo?.[priceKey] || 0;

                        let selectedImage = car.image;
                        if (car.type === "Hatchback") {
                          selectedImage = selectedCarImage;
                        } else if (car.type === "Sedan") {
                          selectedImage = selectedSedanImage;
                        } else if (car.type === "SUV") {
                          selectedImage = selectedSUVImage;
                        } else if (car.type === "Sedan Premium") {
                          selectedImage = selectedSedanPremiumImage;
                        }

                        const params = new URLSearchParams({
                          modelType: car.type,
                          modelName: carInfo.title,
                          image: selectedImage || '',
                          price: price.toString(),
                          basePrice: basePrice.toString(),
                          category: car.type,
                          pickupLocation: searchParams.get('pickup') || '',
                          dropLocation: searchParams.get('drop') || '',
                          date: searchParams.get('date') || '',
                          Returndate: searchParams.get('Returndate') || '',
                          time: searchParams.get('time') || '',
                          tripType: searchParams.get('tripType') || 'oneWay',
                          distance: distance?.toString() || '0',
                          days: days.toString(),
                          features: JSON.stringify(car.features || []),
                          rating: (car.rating || 4.7).toString(),
                          reviews: (car.reviews || 50).toString()
                        } as Record<string, string>);
                        
                        window.location.href = `/booking/invoice?${params.toString()}`;
                      }}
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {featureCards.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}