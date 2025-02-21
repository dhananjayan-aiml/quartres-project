import React from 'react';
import { Building2, Wrench, Shirt, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      name: 'Available Quarters',
      value: '12',
      icon: Building2,
      href: '/quarters',
      color: 'bg-blue-500',
    },
    {
      name: 'Pending Maintenance',
      value: '3',
      icon: Wrench,
      href: '/maintenance',
      color: 'bg-yellow-500',
    },
    {
      name: 'Service Bookings',
      value: '5',
      icon: Shirt,
      href: '/services',
      color: 'bg-green-500',
    },
    {
      name: 'Pending Bills',
      value: '2',
      icon: Receipt,
      href: '/bills',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="relative overflow-hidden rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow"
            >
              <dt>
                <div className={`absolute rounded-lg ${stat.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </dd>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-gray-600">Quarters booking request submitted</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="text-sm text-gray-600">Maintenance request updated</p>
              <p className="text-xs text-gray-400">5 hours ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-gray-600">Service booking confirmed</p>
              <p className="text-xs text-gray-400">1 day ago</p>
            </div>
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Bills</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Electricity Bill</p>
                <p className="text-xs text-gray-500">Due in 5 days</p>
              </div>
              <span className="text-sm font-medium text-gray-900">₹2,500</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Water Bill</p>
                <p className="text-xs text-gray-500">Due in 12 days</p>
              </div>
              <span className="text-sm font-medium text-gray-900">₹800</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
