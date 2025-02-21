import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuartersListing = () => {
  const navigate = useNavigate();

  const quarters = [
    {
      id: 1,
      block: 'A',
      number: '101',
      type: '2 BHK',
      floor: 1,
      rent: 15000,
      status: 'available',
      features: ['Furnished', 'Balcony', 'Car Parking'],
    },
    // Add more quarters here
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Available Quarters</h1>
        <div className="flex space-x-4">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option>All Types</option>
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
          </select>
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option>All Blocks</option>
            <option>Block A</option>
            <option>Block B</option>
            <option>Block C</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quarters.map((quarter) => (
          <div
            key={quarter.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Block {quarter.block} - {quarter.number}
                  </h3>
                  <p className="text-sm text-gray-500">{quarter.type}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Available
                </span>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Floor {quarter.floor}</p>
                <p className="mt-1 text-lg font-medium text-gray-900">₹{quarter.rent}/month</p>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {quarter.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate(`/booking?id=${quarter.id}`)}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuartersListing;
