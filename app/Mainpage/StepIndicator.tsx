// import { Check } from "lucide-react";

// interface Step {
//   id: number;
//   label: string;
//   sublabel: string;
// }

// interface StepIndicatorProps {
//   steps: Step[];
//   currentStep: number;
// }

// const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
//   return (
//     <div className="flex items-start justify-center w-full max-w-3xl mx-auto mb-12">
//       {steps.map((step, index) => (
//         <div key={step.id} className="flex items-center flex-1 last:flex-none">
//           {/* Step circle and label */}
//           <div className="flex flex-col items-center relative min-w-[100px]">
//             {/* <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
//               {step.label}
//             </span> */}
//             <span className="text-[14px] font-semibold text-foreground text-gray-700 tracking-wide mb-3">
//               {step.sublabel}
//             </span>
            
//             <div
//               className="w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10"
//               style={{
//                 backgroundColor: currentStep >= step.id ? '#404040' : 'white',
//                 borderColor: currentStep >= step.id ? '#404040' : '#A6A6A6',
//               }}
//             >
//               {currentStep > step.id ? (
//                 <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
//               ) : currentStep === step.id ? (
//                 <div className="w-2 h-2 rounded-full bg-white" />
//               ) : (
//                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#A6A6A6' }} />
//               )}
//             </div>
//           </div>

//           {/* Progress Connector Line */}
//           {index < steps.length - 1 && (
//             <div className="flex-1 h-[2px] -ml-6 -mr-6 mt-[34px] bg-gray-100 relative">
//               {/* Active Progress Overlay */}
//               <div
//                 className="absolute top-0 left-0 h-full transition-all duration-500 ease-in-out"
//                 style={{
//                   width: currentStep > step.id ? "100%" : "0%",
//                   backgroundColor: '#262626',
//                 }}
//               />
//               {/* Base line color from palette */}
//               <div 
//                 className="w-full h-full" 
//                 style={{ backgroundColor: currentStep > step.id ? '#262626' : '#A6A6A6', opacity: 0.3 }} 
//               />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StepIndicator;

import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
  sublabel: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void; // ✅ ADD THIS
}

const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="flex items-start justify-center w-full max-w-3xl mx-auto mb-12">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center relative min-w-[100px]">
            <span className="text-[14px] font-semibold text-foreground text-gray-700 tracking-wide mb-3">
              {step.sublabel}
            </span>
            
            {/* ✅ CHANGE: wrap in button, clickable only for visited steps */}
            <button
              onClick={() => currentStep > step.id && onStepClick?.(step.id)}
              className={currentStep > step.id ? "cursor-pointer" : "cursor-default"}
              disabled={currentStep <= step.id}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10"
                style={{
                  backgroundColor: currentStep >= step.id ? '#404040' : 'white',
                  borderColor: currentStep >= step.id ? '#404040' : '#A6A6A6',
                }}
              >
                {currentStep > step.id ? (
                  <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                ) : currentStep === step.id ? (
                  <div className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#A6A6A6' }} />
                )}
              </div>
            </button>
          </div>

          {index < steps.length - 1 && (
            <div className="flex-1 h-[2px] -ml-6 -mr-6 mt-[34px] bg-gray-100 relative">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-500 ease-in-out"
                style={{
                  width: currentStep > step.id ? "100%" : "0%",
                  backgroundColor: '#262626',
                }}
              />
              <div 
                className="w-full h-full" 
                style={{ backgroundColor: currentStep > step.id ? '#262626' : '#A6A6A6', opacity: 0.3 }} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;