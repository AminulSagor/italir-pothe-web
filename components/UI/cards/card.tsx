interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "md" | "lg" | "xl" | "2xl" | "3xl";
  shadow?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

const roundedClasses = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

const shadowClasses = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

const Card = ({
  children,
  className = "",
  padding = "md",
  rounded = "3xl",
  shadow = "sm",
  ...props
}: CardProps) => {
  return (
    <div
      className={`bg-white ${paddingClasses[padding]} ${roundedClasses[rounded]} ${shadowClasses[shadow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
