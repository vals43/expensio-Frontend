import { Calendar, Camera, Mail, PhoneIcon } from "lucide-react";
import { useJsonUser } from './../../api/user/useJsonUser';

export default function ProfileCard() {
  const user = useJsonUser();

  if (!user) {
    return (
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm text-center">
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    );
  }
  
    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl">
              M
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
              <Camera size={18} className="text-gray-600" />
            </button>
          </div>
          <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-500 mb-4">Member</p>
          <div className="w-full border-t pt-4 mt-2">
          </div>
        </div>
      </div>
    )
}