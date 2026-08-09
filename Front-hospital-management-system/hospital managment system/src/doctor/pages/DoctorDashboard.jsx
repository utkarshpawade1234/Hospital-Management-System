import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import {
  IconCalendarEvent,
  IconClock,
  IconCircleCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import api from "../api";
import useToast from "../components/useToast";

const STATUS_OPTIONS = ["AVAILABLE", "NOT_AVAILABLE", "ON_LEAVE"];
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
const APPT_STATUS_CLASS = {
  PENDING: "amber",
  CONFIRMED: "green",
  COMPLETED: "blue",
  CANCELLED: "red",
};

export default function DoctorDashboard() {
  const { profile, setProfile } = useOutletContext();
  const { toast, showToast } = useToast();

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  // Simple derived counts from the recent page — the backend has no
  // dedicated doctor-stats endpoint, so this stays intentionally simple.
  const [stats, setStats] = useState({ upcoming: 0, pending: 0, completed: 0 });

  useEffect(() => {
    api
      .get("/doctor/appointments", { params: { page: 0, size: 100 } })
      .then((res) => {
        const content = res.data?.content || [];
        setRecent(content.slice(0, 5));
        setStats({
          upcoming: content.filter(
            (a) => a.status === "CONFIRMED" || a.status === "PENDING"
          ).length,
          pending: content.filter((a) => a.status === "PENDING").length,
          completed: content.filter((a) => a.status === "COMPLETED").length,
        });
      })
      .catch(() => showToast("Couldn't load appointments", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const changeStatus = async (status) => {
    setStatusMenuOpen(false);
    if (status === profile?.availabilityStatus) return;
    setSavingStatus(true);
    try {
      await api.put("/doctor/status", null, {
        params: { availabilityStatus: status },
      });
      setProfile((p) => ({ ...p, availabilityStatus: status }));
      showToast("Availability updated");
    } catch {
      showToast("Couldn't update status", "error");
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Welcome back, Dr. {profile?.lastName || ""}</h2>
          <p>Here's what's on your schedule</p>
        </div>

        <div style={{ position: "relative" }}>
          <div
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              cursor: "pointer",
            }}
            onClick={() => setStatusMenuOpen((o) => !o)}
          >
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Status
            </span>
            <span
              className={`pill ${STATUS_PILL_CLASS[profile?.availabilityStatus] || "green"}`}
            >
              ● {STATUS_LABEL[profile?.availabilityStatus] || "..."}
            </span>
            <IconChevronDown size={14} color="#6B7A99" />
          </div>

          {statusMenuOpen && (
            <div
              className="card"
              style={{
                position: "absolute",
                top: 42,
                right: 0,
                minWidth: 160,
                padding: 6,
                zIndex: 20,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  disabled={savingStatus}
                  onClick={() => changeStatus(s)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    border: "none",
                    background: "none",
                    fontSize: 13,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "var(--blue-bg)" }}>
            <IconCalendarEvent size={16} color="var(--blue-text)" />
          </div>
          <p className="stat-value">{stats.upcoming}</p>
          <p className="stat-label">Upcoming appointments</p>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "var(--amber-bg)" }}>
            <IconClock size={16} color="var(--amber-text)" />
          </div>
          <p className="stat-value">{stats.pending}</p>
          <p className="stat-label">Awaiting confirmation</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "var(--green-bg)" }}>
            <IconCircleCheck size={16} color="var(--green-text)" />
          </div>
          <p className="stat-value">{stats.completed}</p>
          <p className="stat-label">Completed recently</p>
        </div>
      </div>

      <div className="card table-wrap">
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "0.5px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>
            Recent appointments
          </p>
          <Link
            to="/doctor/appointments"
            style={{ fontSize: 12, color: "var(--teal)", fontWeight: 500 }}
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: 8 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <div className="icon">
              <IconCalendarEvent size={32} />
            </div>
            <p style={{ fontWeight: 500, margin: 0 }}>No appointments yet</p>
            <p style={{ fontSize: 13, margin: "4px 0 0" }}>
              Appointments will appear here once patients book with you.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a) => (
                <tr key={a.appointmentId}>
                  <td>{a.patientName}</td>
                  <td>{a.appointmentDate}</td>
                  <td>{a.startTime}</td>
                  <td>{a.appointmentType}</td>
                  <td>
                    <span className={`pill ${APPT_STATUS_CLASS[a.status] || "blue"}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toast && <div className={`toast ${toast.type === "error" ? "error" : ""}`}>{toast.message}</div>}
    </>
  );
}
