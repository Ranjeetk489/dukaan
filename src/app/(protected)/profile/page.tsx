"use client";
import MyAddress from '@/components/block/page/profile/myAddress';
import MyOrders from '@/components/block/page/profile/myOrders';
import React, { useState } from 'react';

type Props = {};

function Profile({}: Props) {
  const [activeTab, setActiveTab] = useState('My Address');

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen px-60 py-4">
      <div className=" bg-gray-100 p-4 h-screen w-[190px]">
        <ul>
          <li
            className={`cursor-pointer mb-2 ${
              activeTab === 'My Address' && 'font-bold'
            }`}
            onClick={() => handleTabChange('My Address')}
          >
            My Address
          </li>
          <li
            className={`cursor-pointer mb-2 ${
              activeTab === 'My Orders' && 'font-bold'
            }`}
            onClick={() => handleTabChange('My Orders')}
          >
            My Orders
          </li>
          <li className="cursor-pointer mb-2" onClick={logout}>
            Logout
          </li>
        </ul>
      </div>

      <div className="w-3/4 p-4">
        {activeTab === 'My Address' && <MyAddress />}
        {activeTab === 'My Orders' && <MyOrders />}
      </div>
    </div>
  );
}

export default Profile;
