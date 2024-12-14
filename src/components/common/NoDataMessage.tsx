import React from 'react';

interface NoDataMessageProps {
  message: string;
}

const NoDataMessage: React.FC<NoDataMessageProps> = ({ message }) => {
  return (
    <div className="text-center py-12 text-gray-500">
      {message}
    </div>
  );
};

export default NoDataMessage;