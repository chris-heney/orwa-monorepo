import React from "react";
import SectionHeading from "./SectionHeading";

const FormSection = ({
  title,
  description,
  footerNotice,
  children,
}: {
  title: string;
  description?: string;
  footerNotice?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-8">
      <SectionHeading title={title} />
      {description && (
        <p className="text-sm text-gray-600 text-left mb-4 -mt-2">{description}</p>
      )}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        {children}
        {footerNotice && (
          <p className="text-sm text-gray-600 text-left mt-6 border-t border-gray-200 pt-4">
            {footerNotice}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormSection;
