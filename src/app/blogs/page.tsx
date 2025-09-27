/* eslint-disable */

"use client"
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Bookmark,
  Share2,
  Award,
  Sparkles,
  X,

} from "lucide-react";
import { Quiz } from "./Quiz";
import blogPosts from "./data/blogposts";
import { Cookie } from "next/font/google";
const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});
const womenHealthTopics = [
  {
    id: 1,
    question: "What is a period?",
    answer:
      "Your period or menstruation (that’s the ‘sciencey’ name) is part of your menstrual cycle. This cycle is ultimately your body’s way of preparing itself for a possible pregnancy. During your menstrual cycle, there is an increase and decrease in a number of different hormones such as oestrogen and progesterone which control different aspects of this cycle, you’ll be hearing a lot about these hormones, so sit tight.During your cycle your body releases an egg from your ovaries – we’re talking teeny tiny eggs here - you can’t see them with the naked eye, they’re that small! In order for the egg to be released it has to be matured, which is a job for our hormones.These hormones are also responsible for making the lining of your uterus thick. Should one day an egg get fertilised by sperm, it would land on the thick cosy lining and that’s where a pregnancy would start. However, if the egg doesn’t get fertilised your body no longer needs the lining, so (here comes the hormones again!) your hormones instruct your body to break the lining down and remove it from the uterus via your vagina.",
  },
  {
    id: 2,
    question: "Breast Health and Self-Examination",
    answer:
      "Regular breast self-examinations are crucial for early detection of any abnormalities. Perform a self-exam once a month, preferably a few days after your period ends. Look for changes in size, shape, or color, and feel for lumps or thickening. If you notice any changes or have concerns, consult with your healthcare provider promptly.",
  },
  {
    id: 3,
    question: "Reproductive Health and Fertility",
    answer:
      "Reproductive health encompasses various aspects, including fertility, contraception, and sexual health. Understanding your fertile window, typically the 5 days before ovulation and the day of ovulation, is crucial for both achieving and avoiding pregnancy. Regular check-ups with a gynecologist can help monitor your reproductive health and address any concerns.",
  },
  {
    id: 4,
    question: "Menopause and Hormonal Changes",
    answer:
      "Menopause is a natural biological process marking the end of menstrual cycles, typically occurring in your 40s or 50s. It's preceded by perimenopause, which can last several years. Common symptoms include irregular periods, hot flashes, mood changes, and sleep disturbances. Hormone replacement therapy and lifestyle changes can help manage symptoms. Regular check-ups during this transition are important for maintaining overall health.",
  },
  {
    id: 5,
    question: "Women's Nutrition and Bone Health",
    answer:
      "A balanced diet is crucial for women's health, particularly for maintaining strong bones and preventing osteoporosis. Ensure adequate intake of calcium, vitamin D, and other essential nutrients. Weight-bearing exercises and strength training can also help maintain bone density. As women are at higher risk for osteoporosis, especially after menopause, it's important to prioritize bone health throughout your life.",
  },
];
import {motion, AnimatePresence} from 'framer-motion'
export default function Blogs() {
  // const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [readSections, setReadSections] = useState(
    Array(womenHealthTopics.length).fill(false)
  );
  const [completedBlogs, setCompletedBlogs] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [allSectionsRead, setAllSectionsRead] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  console.log(completedBlogs)
  console.log(completedTopics)
  console.log(quizScore)


  interface BlogPost {
    id: number;
    title: React.ReactNode;
    excerpt: string;
    content: React.ReactNode;
    author: string;
    date: string;
    category: string;
    readingTime: string;
    icon: React.ReactNode;
    video?: React.ReactNode;
  }

  const toggleAccordion = (id: number) => {
    setActiveItem((prev: number | null) => (prev === id ? null : id));
  };

  interface HandleReadFn {
    (index: number): void;
  }

  const handleRead: HandleReadFn = (index) => {
    const updatedReadSections: boolean[] = [...readSections];
    updatedReadSections[index] = true;
    setReadSections(updatedReadSections);
    setCompletedTopics(updatedReadSections.filter(Boolean).length);

    if (updatedReadSections.every(Boolean)) {
      setAllSectionsRead(true);
    }
  };

  interface SavedPostHandler {
    (postId: number): void;
  }

  const handleSavePost: SavedPostHandler = (postId) => {
    setSavedPosts((prev: number[]) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  interface ShareData {
    title: string;
    text: string;
    url: string;
  }

  interface NavigatorShare {
    share?: (data: ShareData) => Promise<void>;
    clipboard?: {
      writeText: (text: string) => Promise<void>;
    };
  }

  const handleShare = (postId: number): void => {
    const articleUrl: string = `${window.location.origin}/blogs`;
    console.log("Sharing article:", postId);

    const nav = navigator as NavigatorShare;

    if (nav.share) {
      nav
        .share({
          title: 'Check out this article!',
          text: 'Here’s something interesting I found:',
          url: articleUrl,
        })
        .then(() => console.log('Article shared successfully!'))
        .catch((error: unknown) => console.error('Error sharing article:', error));
    } else if (nav.clipboard && nav.clipboard.writeText) {
      nav.clipboard.writeText(articleUrl)
        .then(() => {
          console.log('Link copied to clipboard!');
        })
        .catch((err: unknown) => {
          console.error('Clipboard write failed:', err);
        });
    }
  };

  interface HandleCardClickFn {
    (post: BlogPost): void;
  }

  const handleCardClick: HandleCardClickFn = (post) => {
    setSelectedPost(post);
    if (!savedPosts.includes(post.id)) {
      setCompletedBlogs((prev: number) => prev + 1);
    }
  };

  interface HandleQuizCompleteFn {
    (score: number): void;
  }

  const handleQuizComplete: HandleQuizCompleteFn = (score) => {
    setQuizScore(score);
  };


  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);



  return (
    <motion.div
      className="flex min-h-screen justify-center items-center mx-auto bg-gradient-to-br from-pink-50 via-white to-pink-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Main Content */}
      <motion.main
      className={`flex-1 p-6 transition-all duration-300 ease-in-out w-full`}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        >
        <h2 className={`text-4xl md:text-6xl  ${cookie.className} text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600`}>
          Education Hub
        </h2>
        </motion.div>
        {/* Featured Article */}
        <motion.div
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        >
        <h2 className="text-2xl font-semibold text-pink-800 dark:text-pink-300 mb-2 flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-yellow-400" />
          Featured Article
        </h2>
        <div className="flex items-center space-x-4">
          <Award className="h-16 w-16 text-pink-500" />
          <div>
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Embracing Your Cycle: A Guide to Menstrual Wellness
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover how to work with your menstrual cycle for optimal
            health and well-being.
          </p>
          </div>
        </div>
        <button className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors duration-300">
          Read More
        </button>
        </motion.div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full items-stretch ">
        {/* Search Input */}
        <div className="w-full sm:w-[70%]  flex ">
          <div className="relative w-full pt-4 flex items-center">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full h-11 px-4 pr-10 text-gray-900 bg-white/80 dark:text-white dark:bg-gray-700/80 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-300 focus:shadow-lg backdrop-blur"
          />
          <Search className="absolute right-3 h-5 w-5 text-gray-500 dark:text-white pointer-events-none" />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="w-30 sm:w-[30%] mt-3  flex items-center" >
          <div className="relative w-full mt-1 pt-0.1 h-11 ">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-full px-4 text-gray-900 bg-white/80 dark:text-white dark:bg-gray-700/80 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-300 focus:shadow-lg backdrop-blur"
            style={{ lineHeight: '3rem' }}
          >
            <option value="All">All Categories</option>
            <option value="Health">Health</option>
            <option value="Nutrition">Nutrition</option>
            <option value="Wellness">Wellness</option>
            <option value="History">History</option>
            <option value="Fitness">Fitness</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Hygiene">Hygiene</option>
            <option value="Contraception">Contraception</option>
          </select>
          </div>
        </div>
        </div>

        {/* Blog Grid */}
        <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
          transition: {
            staggerChildren: 0.08,
          },
          },
        }}
        >
        {filteredPosts.map((post, idx) => (
          <motion.div
          key={post.id}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => handleCardClick(post)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.07 }}
          >
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
            {post.icon}
            <div className="flex space-x-2">
              <button
              onClick={(e) => {
                e.stopPropagation();
                handleSavePost(post.id);
              }}
              className={`p-2 rounded-full ${savedPosts.includes(post.id)
                ? "bg-pink-100 text-pink-500"
                : "bg-gray-100 text-gray-500"
                } hover:bg-pink-200 transition-colors duration-300`}
              >
              <Bookmark className="h-5 w-5" />
              </button>
              <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare(post.id);
              }}
              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-pink-200 transition-colors duration-300"
              >
              <Share2 className="h-5 w-5" />
              </button>
            </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {post.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-400 mb-4">
            {post.excerpt}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-400">
            <span>{post.author}</span>
            <span>{post.readingTime} read</span>
            </div>
          </div>
          </motion.div>
        ))}
        </motion.div>
        {/* Women's Health Topics Section */}
        <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-6 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 mb-4">
          Women's Health 101
        </h2>
        <p className="text-gray-800 dark:text-gray-300 mb-6">
          Explore key topics in Women's health to deepen your understanding
          and take control of your well-being.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700 overflow-hidden">
          <motion.div
          className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
     
          initial={{ width: 0 }}

          transition={{ duration: 0.6, ease: "easeInOut" }}
          ></motion.div>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {womenHealthTopics.map(({ id, question, answer }, index) => (
          <motion.div
            key={id}
            className="border border-pink-200 dark:border-pink-800 rounded-lg overflow-hidden transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <button
            className="flex justify-between items-center w-full p-4 text-left bg-pink-50/80 dark:bg-gray-700/80 hover:bg-pink-100/90 dark:hover:bg-gray-600/90 transition-colors duration-300"
            onClick={() => toggleAccordion(id)}
            >
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {question}
            </span>
            <motion.span
              initial={false}
              animate={{ rotate: activeItem === id ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeItem === id ? (
              <ChevronUp className="text-pink-500" />
              ) : (
              <ChevronDown className="text-pink-500" />
              )}
            </motion.span>
            </button>
            <motion.div
            initial={false}
            animate={{
              height: activeItem === id ? "auto" : 0,
              opacity: activeItem === id ? 1 : 0,
              filter: activeItem === id ? "blur(0px)" : "blur(4px)",
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{
              overflow: "hidden",
              pointerEvents: activeItem === id ? "auto" : "none",
            }}
            >
            {activeItem === id && (
              <div className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
              <p className="text-gray-800 dark:text-gray-300">
                {answer}
              </p>
              <div className="mt-4">
                <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={readSections[index]}
                  onChange={() => handleRead(index)}
                  className="form-checkbox text-pink-500 rounded focus:ring-pink-500 h-5 w-5 transition duration-150 ease-in-out"
                />
                <span>I've read this section</span>
                </label>
              </div>
              </div>
            )}
            </motion.div>
          </motion.div>
          ))}
        </div>
        </motion.div>
        {/* Quiz Section */}
        {allSectionsRead && (
        <motion.div
          className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg p-6 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 mb-4">
          Knowledge Check Quiz
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
          Test your knowledge on women's health topics. Answer the
          questions below and see how much you&#39;ve learned!
          </p>
          <Quiz onQuizComplete={handleQuizComplete} />
        </motion.div>
        )}
      </div>
      </motion.main>
      {/* Modal for selected post */}
      <AnimatePresence>
      {selectedPost && (
        <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        >
        <motion.div
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {selectedPost.title}
          </h2>
          <button
            onClick={() => setSelectedPost(null)}
            className="p-2 rounded-md bg-black/80 hover:bg-black/90 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 text-white dark:text-white" />
          </button>
          </div>
          <div className="mb-4">{selectedPost.icon}</div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
          {selectedPost.content}
          </p>
          <span>
          {selectedPost.video ? (
            <div className="mb-4">
            <h3 className="text-lg font-semibold text-pink-500 dark:text-gray-300 mb-2">
              Video Explanation
            </h3>
            {selectedPost.video}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 mb-4">
            No video available for this post.
            </p>
          )}
          </span>
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{selectedPost.author}</span>
          <span>{selectedPost.date}</span>
          </div>
        </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}

