import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookingProcess = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Book Quarter</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Selected Quarter Details</h2>
          {/* Quarter details will be populated based on URL params */}
        </div>
      </div>
    </div>
  );
};

export default BookingProcess;
