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
        <div className="mb-8 border-x border-b border-slate-300 px-3 shadow-md rounded-b">
            <SectionHeading title={title} />
            {children}
        </div>
    );
};

export default FormSection;
