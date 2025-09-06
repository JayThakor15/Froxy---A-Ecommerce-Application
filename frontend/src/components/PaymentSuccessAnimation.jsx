import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Package, Truck } from 'lucide-react';

const PaymentSuccessAnimation = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);

  const steps = [
    { icon: CreditCard, text: 'Processing Payment...', color: 'text-blue-500' },
    { icon: CheckCircle, text: 'Payment Successful!', color: 'text-green-500' },
    { icon: Package, text: 'Order Packed', color: 'text-orange-500' },
    { icon: Truck, text: 'Ready for Delivery', color: 'text-purple-500' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            setShowAnimation(false);
            setTimeout(() => onComplete(), 500);
          }, 2000);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Payment Successful!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 dark:text-gray-400 mb-8"
            >
              Your order has been confirmed and is being processed
            </motion.p>

            {/* Progress Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;

                return (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.2 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                      isActive ? 'bg-gray-50 dark:bg-gray-700' : 'bg-transparent'
                    }`}
                  >
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.6, repeat: isCurrent ? Infinity : 0 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-primary-100 dark:bg-primary-900' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? step.color : 'text-gray-400'}`} />
                    </motion.div>
                    <span className={`font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {step.text}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="mt-6 h-2 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5 }}
                className="h-full bg-primary-600 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentSuccessAnimation;
