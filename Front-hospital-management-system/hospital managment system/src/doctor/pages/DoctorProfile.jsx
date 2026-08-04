import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { IconCamera, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import api from "../api";
import PhotoUpload from "../../patient/components/PhotoUpload";
import toast from "react-hot-toast";

const STATUS_LABEL = {
  AVAILABLE: "Available",
  NOT_AVAILABLE: "Not available",
  ON_LEAVE: "On leave",
};
const STATUS_PILL_CLASS = {
  AVAILABLE: "green",
  NOT_AVAILABLE: "red",
  ON_LEAVE: "amber",
};

const initials = (first, last) =>
  `${(first || "?")[0]}${(last || "")[0] || ""}`.toUpperCase();

export default function DoctorProfile() {
  const { profile, setProfile } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    description: "",
    availabilityStatus: "AVAILABLE",
    profilePhoto: "",
  });
  const [saving, setSaving] = useState(false);

  // Sync form with profile once loaded
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        description: profile.description || "",
        availabilityStatus: profile.availabilityStatus || "AVAILABLE",
        profilePhoto: profile.profilePhoto || "",
      });
    }
  }, [profile]);

  if (!profile) {
    return <p className="p-6 text-sm text-[#6B7A99]">Loading profile...</p>;
  }

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCancel = () => {
    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phoneNumber: profile.phoneNumber || "",
      description: profile.description || "",
      availabilityStatus: profile.availabilityStatus || "AVAILABLE",
      profilePhoto: profile.profilePhoto || "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Send only changed fields
      const changed = {};
      const fields = ["firstName", "lastName", "phoneNumber", "description", "availabilityStatus", "profilePhoto"];
      fields.forEach((k) => {
        const val = form[k];
        const orig = profile[k] || "";
        if (val !== orig) {
          changed[k] = val;
        }
      });

      if (Object.keys(changed).length === 0) {
        toast("Nothing to save", { icon: "ℹ️" });
        setIsEditing(false);
        setSaving(false);
        return;
      }

      const res = await api.put("/doctor/profile", changed);
      setProfile((p) => ({ ...p, ...changed }));
      toast.success(res.data?.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save changes");
    } finally {
      setSaving(false);
    }
  };

  // Determine current fields to show in left preview card
  const displayFirstName = isEditing ? form.firstName : profile.firstName;
  const displayLastName = isEditing ? form.lastName : profile.lastName;
  const displayPhoto = isEditing ? form.profilePhoto : profile.profilePhoto;
  const displayStatus = isEditing ? form.availabilityStatus : profile.availabilityStatus;

  return (
    <div className="doctor-profile-page">
      <div className="page-header">
        <div>
          <h2>My profile</h2>
          <p>Manage how patients see you and your availability</p>
        </div>
      </div>

      <div className="split-layout">
        {/* ---- Summary Card (Left) ---- */}
        <div className="card profile-summary">
          <PhotoUpload
            value={isEditing ? form.profilePhoto : profile.profilePhoto}
            onChange={(url) => setForm({ ...form, profilePhoto: url })}
            isEditing={isEditing}
            initials={initials(displayFirstName, displayLastName)}
          />

          <p style={{ fontWeight: 500, fontSize: "15px", margin: 0 }}>
            Dr. {displayFirstName || "—"} {displayLastName || ""}
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "2px 0 10px" }}>
            {profile.specialization || "—"}
          </p>
          <span className={`pill ${STATUS_PILL_CLASS[displayStatus] || "green"}`}>
            ● {STATUS_LABEL[displayStatus] || displayStatus}
          </span>

          <div style={{ textAlign: "left", marginTop: 16 }}>
            <div className="kv-row">
              <span>Qualification</span>
              <span className="val">{profile.qualification || "—"}</span>
            </div>
            <div className="kv-row">
              <span>Experience</span>
              <span className="val">{profile.yearsOfExperience ?? "—"} yrs</span>
            </div>
            <div className="kv-row">
              <span>Fee</span>
              <span className="val">₹{profile.consultationFee ?? "—"}</span>
            </div>
            <div className="kv-row">
              <span>Department</span>
              <span className="val">{profile.departmentName || profile.department?.departmentName || "—"}</span>
            </div>
            <div className="kv-row">
              <span>Room</span>
              <span className="val">{profile.roomNumber ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* ---- Details/Edit Card (Right) ---- */}
        <div className="card split-main" style={{ padding: 20 }}>
          <div className="flex justify-between items-center mb-5">
            <p className="font-semibold text-sm text-[#1A2233] m-0">
              {isEditing ? "Edit profile" : "Profile details"}
            </p>
            {!isEditing ? (
              <button
                className="btn btn-outline flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6B7A99] border border-[#E8ECF1] rounded-lg hover:bg-[#F4F6FA] transition-all"
                onClick={() => setIsEditing(true)}
              >
                <IconEdit size={14} />
                Edit profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  className="btn btn-outline flex items-center gap-1 px-3 py-1.5 text-xs text-[#6B7A99] border border-[#E8ECF1] rounded-lg hover:bg-[#F4F6FA] transition-all"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <IconX size={14} />
                  Cancel
                </button>
                <button
                  className="btn btn-primary flex items-center gap-1 px-3 py-1.5 text-xs bg-[#1D9E75] text-white rounded-lg hover:opacity-90 transition-all font-medium"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <IconCheck size={14} />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            /* Edit Form View */
            <div className="space-y-4">
              <div className="field-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="field-label block text-xs text-[#6B7A99] mb-1.5">First name</label>
                  <input
                    className="field-input w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:border-[#1D9E75]"
                    value={form.firstName}
                    onChange={update("firstName")}
                  />
                </div>
                <div>
                  <label className="field-label block text-xs text-[#6B7A99] mb-1.5">Last name</label>
                  <input
                    className="field-input w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:border-[#1D9E75]"
                    value={form.lastName}
                    onChange={update("lastName")}
                  />
                </div>
                <div>
                  <label className="field-label block text-xs text-[#6B7A99] mb-1.5">Phone number</label>
                  <input
                    className="field-input w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:border-[#1D9E75]"
                    value={form.phoneNumber}
                    onChange={update("phoneNumber")}
                  />
                </div>
                <div>
                  <label className="field-label block text-xs text-[#6B7A99] mb-1.5">Availability status</label>
                  <select
                    className="field-input w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm bg-white focus:outline-none focus:border-[#1D9E75]"
                    value={form.availabilityStatus}
                    onChange={update("availabilityStatus")}
                  >
                    {Object.entries(STATUS_LABEL).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>



              <div>
                <label className="field-label block text-xs text-[#6B7A99] mb-1.5">About / description</label>
                <textarea
                  className="field-input w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm min-h-[90px] focus:outline-none focus:border-[#1D9E75]"
                  value={form.description}
                  onChange={update("description")}
                />
              </div>
            </div>
          ) : (
            /* Read-Only Details View */
            <div>
              <div className="field-grid">
                <div>
                  <label className="field-label">First Name</label>
                  <div className="field-value">{profile.firstName || "—"}</div>
                </div>
                <div>
                  <label className="field-label">Last Name</label>
                  <div className="field-value">{profile.lastName || "—"}</div>
                </div>
                <div>
                  <label className="field-label">Email Address</label>
                  <div className="field-value">{profile.email || "—"}</div>
                </div>
                <div>
                  <label className="field-label">Phone Number</label>
                  <div className="field-value">{profile.phoneNumber || "—"}</div>
                </div>
              </div>



              <div>
                <label className="field-label">About / Description</label>
                <div className="field-value" style={{ lineHeight: "1.6", fontWeight: "normal", background: "var(--bg)", padding: "12px", borderRadius: "8px", border: "0.5px solid var(--border)", whiteSpace: "pre-line" }}>
                  {profile.description || "No description added yet."}
                </div>
              </div>

              <div className="disclaimer-text">
                * Qualification, specialization, fee, department, and room are set by the hospital administration and cannot be edited.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
