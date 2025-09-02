import React from 'react';
import StatProfile from '../components/profile/StatProfile';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileSecurity from '../components/profile/ProfileSecurity';

export const Profile = () => {
  return (
    <div className="flex min-h-screen p-4 md:p-8">
      <div className="flex-1 w-full">
        <h1 className="text-2xl font-bold mb-6 md:mb-8">My Profile</h1>

        {/* Responsive grid: 1 column on small screens, 3 columns from lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left column */}
          <div className="space-y-6">
            {/* Profile section */}
            <ProfileCard />
            {/* Stat section */}
            <StatProfile />
          </div>

          {/* Right column spans 2 on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit section */}
            <ProfileInfo />
            {/* Security section */}
            <ProfileSecurity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
