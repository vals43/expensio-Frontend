import React from 'react';
import StatProfile from '../components/profile/StatProfile';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileSecurity from '../components/profile/ProfileSecurity';
export const Profile = () => {

  
  return <div className="flex min-h-screen">
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-1">
          {/*profile section*/}
          <ProfileCard />
          {/*Stat section*/}
          <StatProfile />
        </div>

        <div className="col-span-2">
          {/*edit section */}
          <ProfileInfo />
          {/*Security section */}
          <ProfileSecurity />
        </div>
      </div>
    </div>
  </div>;
};
export default Profile;

