"use client";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
} from "@/components/ui/stepper";

interface CheckoutStepsProps {
  currentStep: number;
}

const STEPS = [
  { value: "1", label: "Sacola" },
  { value: "2", label: "Identificação" },
  { value: "3", label: "Pagamento" },
];

const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
  return (
    <Stepper
      value={String(currentStep)}
      nonInteractive
      orientation="horizontal"
    >
      <StepperList>
        {STEPS.map(step => (
          <StepperItem
            key={step.value}
            value={step.value}
            completed={Number(step.value) < currentStep}
            className="ml-2 flex items-center gap-2"
          >
            <StepperIndicator className="size-6 text-xs sm:size-7" />
            <StepperTitle className="text-xs font-medium sm:text-sm">
              {step.label}
            </StepperTitle>
            <StepperSeparator />
          </StepperItem>
        ))}
      </StepperList>
    </Stepper>
  );
};

export default CheckoutSteps;
