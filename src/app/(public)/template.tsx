import React from "react";

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-transition min-h-screen flex flex-col">
      {children}
    </div>
  );
}
