import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { Button } from '@/components/ui/enhanced-button';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Animation variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const floatingVariants: Variants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shakeVariants: Variants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FD8C3B]/10 via-purple-50 to-pink-50 p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i: number) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? "linear-gradient(135deg, #FD8C3B, #FF6B6B)" 
                : i % 3 === 1 
                  ? "linear-gradient(135deg, #8A2BE2, #9370DB)" 
                  : "linear-gradient(135deg, #4F46E5, #7C3AED)",
              opacity: 0.15
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Animated floating elements */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-[#FD8C3B]/20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-purple-500/20 blur-xl"></div>
      
      <motion.div
        className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden z-10 border border-white/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="p-8 text-center">
          {/* Animated 404 text */}
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <motion.h1
              className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FD8C3B] via-pink-500 to-indigo-600"
              animate={{
                y: [0, -15, 0],
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                backgroundPosition: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              404
            </motion.h1>
          </motion.div>
          
          {/* Animated illustration */}
          <motion.div
            className="mb-8 flex justify-center"
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              animate="pulse"
              variants={pulseVariants}
            >
              <motion.div
                className="w-48 h-48 bg-gradient-to-br from-[#FD8C3B]/20 to-indigo-200 rounded-full flex items-center justify-center"
                whileHover={{
                  scale: 1.05,
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.svg
                  className="w-24 h-24 text-[#FD8C3B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-2 bg-[#FD8C3B] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg"
                animate="shake"
                variants={shakeVariants}
              >
                !
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Animated message */}
          <motion.div variants={itemVariants}>
            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-2"
              whileHover={{ scale: 1.03 }}
            >
              Oops! Page Not Found
            </motion.h2>
            <motion.p
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>
          </motion.div>
          
          {/* Animated buttons - Keeping your existing implementation */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="w-full"
                variant="hero"
              >
                <Link
                  to="/"
                  className="w-full h-full flex items-center justify-center"
                >
                  Go to Homepage
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="w-full"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <motion.div
          className="h-2 bg-gradient-to-r from-[#FD8C3B] via-pink-500 to-indigo-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
      </motion.div>
      
      <motion.p
        className="mt-8 text-gray-600 text-sm z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Need help? <a href="mailto:support@example.com" className="text-[#FD8C3B] hover:text-[#FF6B6B] font-medium transition-colors duration-300">Contact Support</a>
      </motion.p>
    </div>
  );
};

export default NotFound;
