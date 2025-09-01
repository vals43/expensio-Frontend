import React from 'react';
const Card = ({
  children,
  className = '',
  title,
}) => {
  return <div className={` rounded-lg shadow-sm p-4  ${className}`}>
      {title && <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        </div>}
      {children}
    </div>;
};
export default Card;