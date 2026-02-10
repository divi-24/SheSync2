/* eslint-disable */

"use client";
import { useState, useCallback, useEffect, Fragment } from "react";
import {
    MapPin,
    Star,
    Loader2,
    Languages,
    ArrowUpDown,
    X,
    Video,
    Stethoscope,
} from "lucide-react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import { Dialog, Transition } from "@headlessui/react";
import { format, addDays } from "date-fns";
import { Cookie } from "next/font/google";
import { motion } from "framer-motion";

const cookie = Cookie({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-cookie'
});


// Removed import of non-exported 'Library' type
const libraries: string[] = ["places"];

const specializations = [
    "Gynecology",
    "Obstetrics",
    "Reproductive Endocrinology",
    "Hormonal Therapy",
    "Fertility Specialist",
    "Nutrition & Dietetics",
    "Menstrual Health Specialist",
    "Endometriosis Specialist",
    "Postpartum Care",
];

const languageOptions = [
    "English",
    "Hindi",
    "Gujarati",
    "Marathi",
    "Bengali",
    "Tamil",
    "Telugu",
];
const experienceRanges = [
    "0-5 years",
    "5-10 years",
    "10-15 years",
    "15+ years",
];
export default function Consultations() {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [apiDoctors, setApiDoctors] = useState<DoctorType[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });

    const [sortBy, setSortBy] = useState("rating");

    const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [selectedConsultationType, setSelectedConsultationType] =
        useState<"video" | "clinic" | null>(null);
    const [bookingStep, setBookingStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("");



    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCIbAtB0SC6j13FLT4RTDDGgMud74q3-5A",
        libraries: libraries as any,
    });

    // Map handlers
    interface MarkerType {
        id: string;
        name: string;
        location: google.maps.LatLng | google.maps.LatLngLiteral;
        rating?: number;
        address?: string;
    }

    interface DoctorType {
        id: string;
        name: string;
        specialization: string;
        rating: number;
        reviewCount: number;
        availableDate: string;
        image: string;
        experience?: string;
        languages?: string[];
        address?: string;
        distance?: number;
        lat?: number;
        lng?: number;
    }

    const onMapLoad = useCallback((map: google.maps.Map) => setMap(map), []);
    const handleMapDrag = () => {
        if (map) {
            const center = map.getCenter();
            if (center) {
                const centerLiteral = { lat: center.lat(), lng: center.lng() };
                setMapCenter(centerLiteral);
                handleSearch(centerLiteral);
            }
        }
    };

    // Unified search handler
    const handleSearch = async (location: { lat: number; lng: number } | null = null) => {
        try {
            setIsSearching(true);
            setSearchError("");

            let searchLocation = location || userLocation;

            // If we have a search query, geocode it
            if (searchQuery && !location) {
                const geocoder = new window.google.maps.Geocoder();
                const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
                    geocoder.geocode({ address: searchQuery }, (results, status) => {
                        status === "OK" ? resolve(results as google.maps.GeocoderResult[]) : reject(status);
                    });
                });

                if (results.length === 0) {
                    setSearchError("Location not found");
                    setIsSearching(false);
                    return;
                }

                const latLngObj = results[0].geometry.location;
                searchLocation = { lat: latLngObj.lat(), lng: latLngObj.lng() };
                setUserLocation(searchLocation);
                setMapCenter(searchLocation);
            }

            if (!searchLocation) {
                setSearchError("Please enable location access or enter a location");
                setIsSearching(false);
                return;
            }

            if (!map) {
                setSearchError("Map is not loaded yet.");
                setIsSearching(false);
                return;
            }
            const service = new window.google.maps.places.PlacesService(map);
            const request = {
                location: searchLocation,
                radius: 50000,
                keyword: "gynecologist",
                type: "doctor",
            };

            service.nearbySearch(request, (results, status) => {
                if (status === "OK" && results && results.length > 0) {
                    // Calculate distance helper function
                    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
                        const R = 6371; // Earth's radius in km
                        const dLat = (lat2 - lat1) * Math.PI / 180;
                        const dLng = (lng2 - lng1) * Math.PI / 180;
                        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                            Math.sin(dLng / 2) * Math.sin(dLng / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        return R * c;
                    };

                    const newMarkers = results
                        .filter((place) => place.geometry && place.geometry.location && place.place_id)
                        .map((place) => ({
                            id: place.place_id as string,
                            name: place.name ?? "",
                            location: place.geometry && place.geometry.location ? place.geometry.location : { lat: 0, lng: 0 },
                            rating: place.rating,
                            address: place.vicinity,
                        }));

                    setMarkers(newMarkers);
                    setApiDoctors(
                        results.map((place) => {
                            const placeLocation = place.geometry?.location;
                            const distance = placeLocation && searchLocation
                                ? calculateDistance(
                                    searchLocation.lat,
                                    searchLocation.lng,
                                    placeLocation.lat(),
                                    placeLocation.lng()
                                )
                                : 0;

                            return {
                                id: place.place_id ?? "",
                                name: place.name ?? "",
                                specialization: Array.isArray(place.types) && place.types.includes("doctor")
                                    ? "Gynecologist"
                                    : "Women's Health Specialist",
                                rating: place.rating || 4.5,
                                reviewCount: place.user_ratings_total || 0,
                                availableDate: new Date().toISOString().split("T")[0],
                                image: "/images/women.jpeg",
                                address: place.vicinity ?? "",
                                distance: Number(distance.toFixed(1)),
                                lat: placeLocation?.lat(),
                                lng: placeLocation?.lng(),
                                languages: ["English", "Hindi"],
                            };
                        })
                    );
                } else {
                    setSearchError("No doctors found in this area");
                }
                setIsSearching(false);
            });
        } catch (error) {
            setSearchError("Error searching locations");
            console.error("Search error:", error);
            setIsSearching(false);
        }
    };

    // Location handlers
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(location);
                    setMapCenter(location);
                    setSearchQuery(""); // Clear search query when using current location
                    handleSearch(location);
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    setSearchError("Please enable location access to use this feature");
                }
            );
        } else {
            setSearchError("Geolocation is not supported by this browser");
        }
    };

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);


    const DoctorCard = ({ doctor }: { doctor: DoctorType }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all h-full flex flex-col"
        >
            <div className="p-6 flex flex-col h-full">
                <div className="mb-4">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold dark:text-white text-gray-900 line-clamp-2">
                                {doctor.name}
                            </h3>
                            <p className="text-pink-600 dark:text-pink-400 text-sm font-semibold mt-1">
                                {doctor.specialization}
                            </p>
                        </div>
                        <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-lg flex-shrink-0">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{doctor.rating}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                ({doctor.reviewCount})
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 flex-1">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Languages className="h-4 w-4 mr-2.5 text-pink-500 flex-shrink-0" />
                        <span className="line-clamp-2">{doctor.languages?.join(", ") || "English, Hindi"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2.5 text-pink-500 flex-shrink-0" />
                        <span className="line-clamp-2">{doctor.address || "Location unavailable"}</span>
                    </div>
                    {doctor.distance !== undefined && (
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 w-fit">
                            <MapPin className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <span className="font-semibold text-blue-700 dark:text-blue-300">{doctor.distance} km away</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    const DoctorCardSkeleton = () => (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden h-full flex flex-col border border-gray-200 dark:border-gray-700">
            <div className="p-6 animate-pulse flex flex-col h-full">
                <div className="mb-4">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                </div>
                <div className="space-y-3 flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-2/5 mt-4" />
                </div>
            </div>
        </div>
    );

    interface SortingControlsProps {
        sortBy: string;
        setSortBy: React.Dispatch<React.SetStateAction<string>>;
    }

    const SortingControls = ({ sortBy, setSortBy }: SortingControlsProps) => (
        <div className="flex items-center space-x-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by:
            </span>
            <button
                onClick={() => setSortBy("rating")}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${sortBy === "rating"
                    ? "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300"
                    : "text-gray-600 bg-white border border-black dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
            >
                <Star className="h-4 w-4 mr-1" />
                Rating
            </button>
            <button
                onClick={() => setSortBy("distance")}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${sortBy === "distance"
                    ? "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300"
                    : "text-gray-600 bg-white border border-black dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
            >
                <MapPin className="h-4 w-4 mr-1" />
                Distance
            </button>
        </div>
    );

    const BookingModal = ({
        isOpen,
        closeModal,
        doctor,
    }: {
        isOpen: boolean;
        closeModal: () => void;
        doctor: DoctorType;
    }) => {
        const timeSlots = [
            "09:00 AM",
            "09:30 AM",
            "10:00 AM",
            "10:30 AM",
            "11:00 AM",
            "11:30 AM",
            "02:00 PM",
            "02:30 PM",
            "03:00 PM",
            "03:30 PM",
            "04:00 PM",
            "04:30 PM",
        ];

        const renderStep = () => {
            switch (bookingStep) {
                case 1:
                    return (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Select Consultation Type
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        setSelectedConsultationType("video");
                                        setBookingStep(2);
                                    }}
                                    className={`p-4 rounded-lg border-2 transition-colors ${selectedConsultationType === "video"
                                        ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                                        : "border-gray-200 dark:border-gray-700 hover:border-pink-300"
                                        }`}
                                >
                                    <Video className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                                    <span className="block text-sm font-medium">
                                        Video Consultation
                                    </span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Schedule a session
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedConsultationType("clinic");
                                        setBookingStep(2);
                                    }}
                                    className={`p-4 rounded-lg border-2 transition-colors ${selectedConsultationType === "clinic"
                                        ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                                        : "border-gray-200 dark:border-gray-700 hover:border-pink-300"
                                        }`}
                                >
                                    <Stethoscope className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                                    <span className="block text-sm font-medium">
                                        Clinic Visit
                                    </span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Schedule an appointment
                                    </span>
                                </button>
                            </div>
                        </div>
                    );

                case 2:
                    return (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Select Date
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                                {[...Array(7)].map((_, index) => {
                                    const date = addDays(new Date(), index);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedDate(date);
                                                setBookingStep(3);
                                            }}
                                            className={`p-3 rounded-lg border text-center transition-colors ${selectedDate &&
                                                format(selectedDate, "yyyy-MM-dd") ===
                                                format(date, "yyyy-MM-dd")
                                                ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                                                : "border-gray-200 dark:border-gray-700 hover:border-pink-300"
                                                }`}
                                        >
                                            <span className="block text-sm font-medium">
                                                {format(date, "EEE")}
                                            </span>
                                            <span className="block text-lg font-semibold mt-1">
                                                {format(date, "d")}
                                            </span>
                                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                                                {format(date, "MMM")}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );

                case 3:
                    return (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Select Time Slot
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => {
                                            setSelectedTimeSlot(slot);
                                            setBookingStep(4);
                                        }}
                                        className={`p-3 rounded-lg border text-center transition-colors ${selectedTimeSlot === slot
                                            ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-pink-300"
                                            }`}
                                    >
                                        <span className="block text-sm font-medium">{slot}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );

                case 4:
                    return (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Payment Details
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Type</span>
                                    <span className="capitalize">{selectedConsultationType}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Doctor</span>
                                    <span>{doctor.name}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Confirm to schedule an appointment with {doctor.name}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Select Payment Method
                                </label>
                                <div className="space-y-2">
                                    {["UPI", "Card", "Net Banking"].map((method) => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`w-full p-3 rounded-lg border text-left transition-colors ${paymentMethod === method
                                                ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                                                : "border-gray-200 dark:border-gray-700 hover:border-pink-300"
                                                }`}
                                        >
                                            <span className="font-medium">{method}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );

                default:
                    return null;
            }
        };

        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-6">
                                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Book Appointment
                                        </Dialog.Title>
                                        <button
                                            onClick={closeModal}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <span className="sr-only">Close</span>
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {renderStep()}

                                    <div className="mt-6 flex justify-between">
                                        {bookingStep > 1 && (
                                            <button
                                                onClick={() => setBookingStep(bookingStep - 1)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Back
                                            </button>
                                        )}
                                        {bookingStep === 4 && (
                                            <button
                                                onClick={() => {
                                                    // Handle payment and booking confirmation
                                                    closeModal();
                                                    // Show success message
                                                }}
                                                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                                            >
                                                Confirm & Pay
                                            </button>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    };



    const handleBooking = (doctor: DoctorType, type: "video" | "clinic"): void => {
        setSelectedDoctor(doctor);
        setSelectedConsultationType(type);
        setBookingStep(1);
        setIsBookingModalOpen(true);
    };



    return (
        <div className={`flex h-screen`}>

            {/* Main content */}

            <main
                className={`flex-1 p-8 overflow-auto bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out `}
            >
                <div className="container mx-auto py-8 px-4">
                    {/* Header (keep the same as before) */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <motion.h1
                            className={`${cookie.className} text-4xl md:text-6xl font-bold pb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent text-center`}
                            initial={{ opacity: 0, filter: "blur(8px)", y: 40 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            Expert Consultation
                        </motion.h1>
                        <motion.h2
                            className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center mb-2"
                            initial={{ opacity: 0, filter: "blur(8px)", y: 30 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        >
                            Find the Best Gynecologists Near You
                        </motion.h2>
                        <motion.p
                            className="max-w-xl text-center text-gray-500 dark:text-gray-400"
                            initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                        >
                            Search, filter, and book appointments with top women’s health specialists for in-person or online consultations. Your health, your way.
                        </motion.p>
                    </div>

                    {/* Enhanced Search Section */}
                    {isLoaded && (
                        <motion.div
                            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                                Find Nearby Gynecologists
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <div className="relative flex items-center">
                                        <input
                                            id="search"
                                            type="text"
                                            placeholder="Enter location or 'Near Me'"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                            className="w-full pl-3 pr-24 py-2 text-gray-900 bg-white dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-900"
                                        />
                                        <div className="absolute right-0 flex space-x-1">
                                            <button
                                                onClick={() => handleSearch()}
                                                disabled={isSearching}
                                                className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600 transition-colors duration-300 disabled:opacity-50"
                                            >
                                                {isSearching ? "Searching..." : "Search"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={getUserLocation}
                                    disabled={isSearching}
                                    className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300 disabled:opacity-50"
                                >
                                    <MapPin className="inline-block mr-2 h-4 w-4" />
                                    Near Me
                                </button>
                            </div>

                            {searchError && (
                                <div className="text-red-500 mb-4 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {searchError}
                                </div>
                            )}

                            <div className="h-96 w-full rounded-lg overflow-hidden relative">
                                {isSearching && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                                        <Loader2 className="animate-spin text-white h-8 w-8" />
                                    </div>
                                )}
                                <GoogleMap
                                    mapContainerStyle={{ width: "100%", height: "100%" }}
                                    center={mapCenter}
                                    zoom={12}
                                    onLoad={onMapLoad}
                                    onDragEnd={handleMapDrag}
                                >
                                    {markers.map((marker) => (
                                        <Marker
                                            key={marker.id}
                                            position={marker.location}
                                            onClick={() => setSelectedMarker(marker)}
                                        >
                                            {selectedMarker?.id === marker.id && (
                                                <InfoWindow
                                                    onCloseClick={() => setSelectedMarker(null)}
                                                >
                                                    <div className="p-2 text-sm">
                                                        <h3 className="font-semibold">{marker.name}</h3>
                                                        <p>Rating: {marker.rating || "N/A"}</p>
                                                        <p>Address: {marker.address}</p>
                                                    </div>
                                                </InfoWindow>
                                            )}
                                        </Marker>
                                    ))}
                                </GoogleMap>
                            </div>
                        </motion.div>
                    )}

                    {/* Sorting Controls */}
                    <div className="mb-6">
                        <SortingControls sortBy={sortBy} setSortBy={setSortBy} />
                    </div>

                    {/* Doctors List (keep the same as before) */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {isSearching ? (
                            Array(6)
                                .fill(null)
                                .map((_, i) => <DoctorCardSkeleton key={i} />)
                        ) : apiDoctors.length > 0 ? (
                            apiDoctors.map((doctor) => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400 col-span-full py-8">
                                No doctors found. Try adjusting your search criteria.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {selectedDoctor && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    closeModal={() => {
                        setIsBookingModalOpen(false);
                        setSelectedDoctor(null);
                        setSelectedDate(null);
                        setSelectedTimeSlot(null);
                        setSelectedConsultationType(null);
                        setBookingStep(1);
                        setPaymentMethod("");
                    }}
                    doctor={selectedDoctor}
                />
            )}
        </div>
    );
}
