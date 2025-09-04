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
        <div className="bg-white border-l-4 border-b-4 dark:border-dark-border dark:bg-dark-card p-6 rounded-xl shadow-sm">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl">
              M
            </div>
          </div>
          <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-500 mb-4">Member</p>
          <div className="w-full border-t pt-4 mt-2">
          </div>
        </div>
      </div>
    )
}