import { Check } from "lucide-react";

type Step = {
  title: string;
  description: string;
};

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
}

const WizardProgress = ({ steps, currentStep }: WizardProgressProps) => {
  return (
    <div className="relative">
      <div className="absolute top-5 left-6 w-[calc(100%-3rem)] h-0.5 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div
              key={step.title}
              className="flex flex-col items-center"
              style={{ width: "120px" }}
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    isCompleted
                      ? "bg-blue-600 text-white"
                      : isCurrent
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${isCurrent ? "text-blue-600" : "text-gray-600"}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;