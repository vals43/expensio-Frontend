import { useState, useEffect } from "react";
import { Laptop } from "lucide-react";
import ChangePasswordForm from "./ChangePasswordForm";

export default function ProfileSecurity() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    brand: "Inconnue",
    model: "Inconnu",
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Set up the interval to update the time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (navigator.userAgentData) {
      const { brands, platform } = navigator.userAgentData;
      console.log(navigator);
      
      
      
      let brandName = "Inconnue";
      const browserBrand = brands.find(b => b.brand !== "Not;A=Brand");
      if (browserBrand) {
        brandName = browserBrand.brand;
      }
      console.log(navigator);
      
      
      navigator.userAgentData.getHighEntropyValues(['model']).then(ua => {
        setDeviceInfo({
          brand: brandName,
          model: ua.model || platform
        });
      }).catch(() => {
        setDeviceInfo({
          brand: brandName,
          model: platform
        });
      });
    } else {
      const userAgent = navigator.userAgent;
      if (userAgent.includes("Windows")) {
        setDeviceInfo({ brand: "Microsoft", model: "PC Windows" });
      } else if (userAgent.includes("Mac")) {
        setDeviceInfo({ brand: "Apple", model: "Mac" });
      } else {
        setDeviceInfo({ brand: "Inconnue", model: "Appareil Inconnu" });
      }
    }
  }, []);

  const formattedDate = currentTime.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentTime.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white border-l-4 border-b-4 dark:border-dark-border dark:bg-dark-card p-6 rounded-xl shadow-sm mt-6">
      <h3 className="font-medium mb-6">Sécurité</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="block font-medium">Changer le mot de passe</label>
            <button onClick={() => setShowChangePassword(!showChangePassword)} className="text-blue-600 text-sm">
              {showChangePassword ? "Fermer" : "Changer"}
            </button>
          </div>
          {showChangePassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
            </div>
          )}
        </div>
        <div className="border-t pt-6">
          <div className="flex justify-between mb-2">
            <label className="block font-medium">Sessions actives</label>
          </div>
          <div className="bg-gray-50 dark:bg-dark-border p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Laptop className="mr-4" />
                <div>
                  <p className="text-sm font-medium">Session actuelle</p>
                  <p className="text-xs text-gray-500">
                    {deviceInfo.brand} ({deviceInfo.model}) · {formattedDate} à {formattedTime}
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
  );
}
