import { SVGProps } from "react";

interface KvantaLogoProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export const KvantaLogo = ({ className, ...props }: KvantaLogoProps) => (
  <svg
    width="120"
    height="32"
    viewBox="0 0 120 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M14.432 24L7.216 15.248V24H3.2V8H7.216V16.688L14.368 8H19.232L11.056 17.744L19.456 24H14.432ZM34.881 8V11.2H29.201V24H25.185V11.2H19.505V8H34.881ZM49.6133 8V11.2H43.9333V24H39.9173V11.2H34.2373V8H49.6133ZM64.3455 8V11.2H58.6655V24H54.6495V11.2H48.9695V8H64.3455ZM79.0778 8V11.2H73.3978V24H69.3818V11.2H63.7018V8H79.0778ZM93.81 8V11.2H88.13V24H84.114V11.2H78.434V8H93.81ZM108.542 8V11.2H102.862V24H98.8463V11.2H93.1663V8H108.542Z"
      fill="currentColor"
    />
  </svg>
);