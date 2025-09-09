import React, { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { changePassword } from "../../api/user/userService";

export default function ChangePasswordForm({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        if (onClose) {
          onClose(); // Close the form on success
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    // Validate that the new passwords match
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await changePassword(oldPassword, newPassword);
      setMessage(res.message || "Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      className="w-full max-w-md mx-auto mt-6 shadow-lg rounded-2xl bg-light-background dark:bg-dark-card backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50" 
      title="Change Password"
    >
      <div className="flex justify-end">
        <Button 
          onClick={onClose} 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={18} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Old Password</label>
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            placeholder="Enter your current password"
          />
        </div>
        <div>
          <label className="text-sm font-medium">New Password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter a new password"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Confirm New Password</label>
          <Input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || newPassword.length === 0 || newPassword !== confirmNewPassword}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>

      {message && (
        <div className="flex items-center gap-2 mt-4 text-green-600 text-sm">
          <CheckCircle size={18} />
          {message}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 mt-4 text-red-600 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
    </Card>
  );
}
