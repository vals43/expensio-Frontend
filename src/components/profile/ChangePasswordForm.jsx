// src/components/user/ChangePasswordForm.jsx
import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { changePassword } from "../../api/user/userService";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await changePassword(oldPassword, newPassword);
      //setMessage(res.message || "Password updated successfully.");

      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-6 shadow-lg rounded-2xl" title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
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

        <Button
          type="submit"
          disabled={loading}
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
