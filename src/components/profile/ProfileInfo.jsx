import { PencilIcon } from "lucide-react";
import Input from "../ui/Input";
import { useJsonUser } from "../../api/user/useJsonUser";

export default function ProfileInfo(){
  const user = useJsonUser()
  
  if (!user) {
    return (
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm text-center">
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    );
  }
  
    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium">Personal Information</h3>

        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              First Name
            </label>
            <Input type="text" value={user.firstName} readOnly />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Last Name
            </label>
            <Input type="text" value={user.lastName || ""} readOnly/>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Email Address
            </label>
            <Input type="email" value={user.email} readOnly  />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Member Since
            </label>
            <Input type="text" value={user.createdAt.split("T")[0]} readOnly />
          </div>
        </div>
      </div>
    )
}