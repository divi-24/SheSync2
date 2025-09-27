"use client"
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import {
    ArrowLeft,
    User,
    Smile,
    Frown,
    Flame,
    Zap,
    Skull,
    Ghost,
    Meh
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MoodMap() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [emotion, setEmotion] = useState("Neutral");
    const [age, setAge] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useRouter();

    const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

    const detect = async () => {
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224 });

        intervalRef.current = setInterval(async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

            try {
                const result = await faceapi
                    .detectSingleFace(videoRef.current, options)
                    .withFaceLandmarks()
                    .withFaceExpressions()
                    .withAgeAndGender();

                if (result) {
                    const expressions = result.expressions;
                    const maxExp = Object.entries(expressions).reduce((a, b) =>
                        a[1] > b[1] ? a : b
                    );
                    setEmotion(capitalize(maxExp[0]));
                    setAge(result.age.toFixed(0));
                    setGender(capitalize(result.gender));
                }
            } catch (error) {
                console.error("Face detection error:", error);
            }
        }, 1500);
    };

    useEffect(() => {
        const MODEL_URL = "/bliss/models";

        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
                ]);
            } catch (error) {
                console.error("Failed to load face-api models:", error);
                setCameraError("Failed to load AI models. Please refresh the page.");
                setIsLoading(false);
            }
        };

        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user'
                    }
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        setIsLoading(false);
                        setCameraError(null);
                    };
                }
            } catch (err: unknown) {
                console.error("Camera access denied or not available:", err);
                setIsLoading(false);

                // Provide specific error messages based on error type
                const error = err as { name?: string; message?: string };
                if (error.name === 'NotAllowedError') {
                    setCameraError("Camera access denied. Please allow camera permission and refresh the page.");
                } else if (error.name === 'NotFoundError') {
                    setCameraError("No camera found. Please connect a camera and try again.");
                } else if (error.name === 'NotReadableError') {
                    setCameraError("Camera is already in use by another application.");
                } else if (error.name === 'OverconstrainedError') {
                    setCameraError("Camera constraints not supported. Please try a different camera.");
                } else {
                    setCameraError("Camera access failed. Please check your camera settings and try again.");
                }
            }
        };

        const detect = async () => {
            const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224 });

            intervalRef.current = setInterval(async () => {
                if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

                try {
                    const result = await faceapi
                        .detectSingleFace(videoRef.current, options)
                        .withFaceLandmarks()
                        .withFaceExpressions()
                        .withAgeAndGender();

                    if (result) {
                        const expressions = result.expressions;
                        const maxExp = Object.entries(expressions).reduce((a, b) =>
                            a[1] > b[1] ? a : b
                        );
                        setEmotion(capitalize(maxExp[0]));
                        setAge(result.age.toFixed(0));
                        setGender(capitalize(result.gender));
                    }
                } catch (error) {
                    console.error("Face detection error:", error);
                }
            }, 1500);
        };

        loadModels().then(async () => {
            await startVideo();
            if (!cameraError) {
                await detect();
            }
        }).catch((error) => {
            console.error("Initialization failed:", error);
            setCameraError("Failed to initialize the mood detection system.");
            setIsLoading(false);
        });

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [cameraError]);

    const getExpressionIcon = (expression: string): React.ReactElement => {
        switch (expression.toLowerCase()) {
            case "happy":
                return <Smile />;
            case "sad":
                return <Frown />;
            case "angry":
                return <Flame />;
            case "surprised":
                return <Zap />;
            case "disgusted":
                return <Skull />;
            case "fearful":
                return <Ghost />;
            case "neutral":
            default:
                return <Meh />;
        }
    };

    const retryCamera = async () => {
        setCameraError(null);
        setIsLoading(true);

        // Stop existing stream if any
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Clear existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Restart the camera
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setIsLoading(false);
                    setCameraError(null);
                    // Start detection
                    detect();
                };
            }
        } catch (err: unknown) {
            setIsLoading(false);
            const error = err as { name?: string };
            if (error.name === 'NotAllowedError') {
                setCameraError("Camera access denied. Please allow camera permission and refresh the page.");
            } else {
                setCameraError("Camera access failed. Please check your camera settings and try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-950 dark:to-gray-900">
            {/* Header with Back Button */}
            <div className="p-6">
                <button
                    onClick={() => navigate.push("/bliss")}
                    className="flex items-center gap-2 bg-white text-pink-600 border border-pink-300 hover:bg-pink-100 dark:bg-gray-800 dark:text-pink-400 dark:border-pink-700 dark:hover:bg-gray-700 transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Bliss Page
                </button>
            </div>

            {/* Main Content Container */}
            <div className="flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-4xl">
                    <div className="text-center space-y-8">
                        {/* Game Title */}
                        <div className="space-y-2">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                MOOD MAP
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
                        </div>

                        {/* Game Content */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-100 dark:border-gray-700">
                            <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-base">
                                Track your mood via video feed and share your emotional insights with friends.
                            </p>

                            {/* Instructions */}
                            {cameraError && (
                                <div className="mb-6 bg-blue-50 dark:bg-blue-900 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📋 Camera Permission Required</h3>
                                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                        <li>• Click &quot;Allow&quot; when prompted for camera access</li>
                                        <li>• Make sure no other apps are using your camera</li>
                                        <li>• Try refreshing the page if issues persist</li>
                                        <li>• Use HTTPS for secure camera access</li>
                                    </ul>
                                </div>
                            )}

                            {/* Webcam Feed */}
                            <div className="mb-6 flex justify-center">
                                {isLoading ? (
                                    <div className="w-[500px] h-[350px] max-w-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-lg border-2 border-pink-200 dark:border-pink-700 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                                            <p className="text-pink-700 dark:text-pink-300 font-medium">Loading camera...</p>
                                        </div>
                                    </div>
                                ) : cameraError ? (
                                    <div className="w-[500px] h-[350px] max-w-full bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900 dark:to-gray-800 rounded-xl shadow-lg border-2 border-red-200 dark:border-red-700 flex items-center justify-center">
                                        <div className="text-center p-6">
                                            <div className="text-red-500 dark:text-red-400 mb-4">
                                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                                </svg>
                                            </div>
                                            <p className="text-red-700 dark:text-red-300 font-medium mb-4">{cameraError}</p>
                                            <button
                                                onClick={retryCamera}
                                                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        width="500"
                                        height="350"
                                        className="rounded-xl shadow-lg border-2 border-pink-200 dark:border-pink-700 max-w-full"
                                    />
                                )}
                            </div>

                            {/* Result Info */}
                            <div className="space-y-4">
                                <div className="text-2xl font-semibold text-pink-700 dark:text-pink-300 flex justify-center items-center gap-2">
                                    {getExpressionIcon(emotion)}
                                    <span>You look: {emotion}</span>
                                </div>

                                {age && gender && (
                                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-pink-200 dark:border-gray-600">
                                        <div className="flex justify-center items-center gap-2 text-base text-gray-700 dark:text-gray-300">
                                            <User size={18} />
                                            <span>Estimated Age: {age}</span>
                                            <span className="mx-2">•</span>
                                            <span>Gender: {gender}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

