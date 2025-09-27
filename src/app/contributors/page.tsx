/* eslint-disable */

"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";


// Define Contributor interface based on GitHub API response
interface Contributor {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
}


const Contributors = () => {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);

    // const { theme, toggleTheme } = useTheme();


    useEffect(() => {
        const fetchAllContributors = async () => {
            let allContributors: Contributor[] = [];
            let page = 1;
            const perPage = 100;

            try {
                while (true) {
                    const res = await axios.get(
                        `https://api.github.com/repos/divi-24/SheSync/contributors`,
                        {
                            params: {
                                per_page: perPage,
                                page: page,
                            },
                            headers: {
                                Accept: "application/vnd.github+json",
                            },
                        }
                    );

                    if (res.data.length === 0) break;
                    allContributors = [...allContributors, ...res.data];
                    page++;
                }

                setContributors(allContributors);
            } catch (err) {
                console.error("Error fetching contributors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllContributors();

        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
        
            <div
                className={`flex-1 p-4 sm:p-8 bg-white dark:bg-gray-900 text-black dark:text-gray-100 transition-all duration-300 overflow-y-auto`}
            >
                {loading ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">Loading contributors...</p>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-extrabold mb-10 text-center">
                            <span className="inline-block mr-2 text-black dark:text-white">🚀</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600">
                                Meet the Contributors
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {contributors.map((contributor) => (
                                <a
                                    key={contributor.id}
                                    href={contributor.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-700 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.03]"
                                >
                                    <div className="flex flex-col items-center p-4 space-y-3">
                                        <div className="w-20 h-20 rounded-full overflow-hidden bg-white">
                                            <img
                                                src={contributor.avatar_url}
                                                alt={contributor.login}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-pink-700 dark:text-pink-300">
                                                {contributor.login}
                                            </p>
                                            <p className="text-sm text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-800/30 px-3 py-1 mt-1 rounded-full">
                                                🌟 {contributor.contributions} contributions
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

function setWidth(innerWidth: number) {
  // This function should update the screen width in state.
  // But in this file, width comes from useScreenSize() hook,
  // so setWidth should be provided by that hook, not here.
  // For now, leave it empty or remove its usage in useEffect.
  // If you want to update width locally, you can use a state:
  // Example:
  // setWidth(innerWidth) => setWidthState(innerWidth)
  // But here, just leave it as a no-op:
  console.log("Window width changed to:", innerWidth);
}
export default Contributors;

