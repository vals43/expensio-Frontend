import React from 'react';
export const Card = ({
  children,
  className = '',
  title,
  action
}) => {
  return <div className={`rounded-lg p-4 ${className} hover:scale-105 transition-all duration-500`}>
      {(title || action) && <div className="flex justify-between items-center mb-3">
          {title && <h3 className=" font-medium">{title}</h3>}
          {action && <div>{action}</div>}
        </div>}
      {children}
    </div>;
};