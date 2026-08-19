import React from "react";
import SectionHeading from "./SectionHeading";

const FormSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="mb-8">
            <SectionHeading title={title} />
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                {children}
            </div>
        </div>
    );
};

export default FormSection;
