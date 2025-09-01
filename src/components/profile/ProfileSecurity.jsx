import { Tablet } from "lucide-react";

export default function ProfileSecurity() {
    return (
        <div className="bg-white dark:bg-dark-card  p-6 rounded-xl shadow-sm mt-6">
        <h3 className="font-medium mb-6">Security</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="block font-medium">Change Password</label>
              <button className="text-blue-600 text-sm">Change</button>
            </div>
          </div>
          <div className="border-t pt-6">
            <div className="flex justify-between mb-2">
              <label className="block font-medium">Active Sessions</label>
              <button className="text-blue-600 text-sm">Manage</button>
            </div>
            <div className="bg-gray-50 dark:bg-dark-border p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Tablet className='mr-4' />
                  <div>
                    <p className="text-sm font-medium">Current Session</p>
                    <p className="text-xs text-gray-500">
                      New York, USA · June 15, 2022 at 2:30 PM
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}