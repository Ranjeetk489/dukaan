'use client';
import ProductsComponent from '@/components/block/page/admin/Products/Products';
import AdminDashboard from '@/components/block/page/admin/adminDashboard';
import AdminOrders from '@/components/block/page/admin/orders/adminOrders';
import React, { useState } from 'react';

const navigation = [
  { name: 'Dashboard', component: AdminDashboard },
  { name: 'Orders', component: AdminOrders },
  { name: 'Products', component: ProductsComponent },
//   { name: 'Bulk Orders', component: BulkOrdersComponent },
//   { name: 'Settings', component: SettingsComponent },
];

const VerticalNavbar: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string| null>(null);

  const handleMenuClick = (component: string) => {
    setSelectedComponent(component);
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <div className="flex flex-col w-64">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gray-900">
          Logo
        </div>
        
        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-4">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
            {selectedComponent == 'Dashboard' && <AdminDashboard />}
            {selectedComponent == 'Orders' && <AdminOrders />}
      </div>
    </div>
  );
};

export default VerticalNavbar;
