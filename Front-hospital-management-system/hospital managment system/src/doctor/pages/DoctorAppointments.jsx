import { useState, useEffect, useCallback } from "react";
import { IconCalendarEvent, IconX, IconCheck } from "@tabler/icons-react";
import api from "../api";
import toast from "react-hot-toast";
import PrescriptionModal from "../components/PrescriptionModal";
import DoctorPaymentStatus from "../components/DoctorPaymentStatus";

const APPT_STATUS_CLASS = {
  PENDING: "amber",
  CONFIRMED: "green",
  COMPLETED: "blue",
  CANCELLED: "red",
};

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function DoctorAppointments() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [completePromptOpen, setCompletePromptOpen] = useState(false);

  const load = useCallback(() => {
    api
      .get("/doctor/appointments", { params: { page, size } })
      .then((res) => setData(res.data))
      .catch(() => toast.error("Couldn't load appointments"))
      .finally(() => setLoading(false));
  }, [page, size]);

  useEffect(() => {
    let ignore = false;
    async function fetchAppts() {
      if (!ignore) {
        await load();
      }
    }
    fetchAppts();
    return () => {
      ignore = true;
    };
  }, [load]);

  const openDetail = (row) => {
    setPrescription(null);
    api
      .get(`/doctor/appointments/${row.appointmentId}`)
      .then((res) => {
        setSelected(res.data);
        if (res.data.status === "CONFIRMED" || res.data.status === "COMPLETED") {
          api.get(`/doctor/appointments/${row.appointmentId}/prescription`)
            .then((pRes) => setPrescription(pRes.data))
            .catch(() => setPrescription(null));
        }
      })
      .catch(() => toast.error("Couldn't load appointment details"));
  };

  const runAction = async (type) => {
    if (!selected) return;
    setActionLoading(true);
    const endpoint = `/doctor/appointments/${selected.appointmentId}/${type}`;
    try {
      const res = await api.put(endpoint);
      toast.success(res.data?.message || "Status updated successfully");
      await openDetail(selected);
      load();

      // Trigger completion popup asking to write a prescription only when completed
      if (type === "complete") {
        setCompletePromptOpen(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div>
        <div className="page-header">
          <div>
            <h2>My appointments</h2>
            <p>All appointments booked with you</p>
          </div>
        </div>

        <div className="card table-wrap">
          {loading ? (
            <div style={{ padding: 8 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-row" />
              ))}
            </div>
          ) : data.content.length === 0 ? (
            <div className="empty-state">
              <div className="icon">
                <IconCalendarEvent size={32} />
              </div>
              <p style={{ fontWeight: 500, margin: 0 }}>No appointments yet</p>
              <p style={{ fontSize: 13, margin: "4px 0 0" }}>
                Appointments will appear here once created.
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((a) => (
                  <tr
                    key={a.appointmentId}
                    className={`clickable ${selected?.appointmentId === a.appointmentId ? "selected" : ""}`}
                    onClick={() => openDetail(a)}
                  >
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          className="avatar-sm"
                          style={{ background: "var(--blue-bg)", color: "var(--blue-text)" }}
                        >
                          {initials(a.patientName)}
                        </div>
                        {a.patientName}
                      </div>
                    </td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.startTime}</td>
                    <td>{a.appointmentType}</td>
                    <td>
                      <span className={`pill ${APPT_STATUS_CLASS[a.status] || "blue"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--teal)", fontWeight: 500 }}>View →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            <span>
              Showing page {page + 1} of {data.totalPages} ({data.totalElements} total)
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn btn-outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <button
                className="btn btn-outline"
                disabled={page + 1 >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details & Status Change Modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 31, 63, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "24px",
              borderRadius: "14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              background: "#fff",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                padding: "4px",
              }}
            >
              <IconX size={18} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
                {selected.patientName}
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
                {selected.appointmentType} · {selected.appointmentDate}, {selected.startTime}
              </p>
            </div>

            <hr style={{ border: "none", borderTop: "0.5px solid var(--border)", margin: "16px 0" }} />

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 12px", marginBottom: "16px" }}>
              <div>
                <div className="field-label" style={{ textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "4px" }}>Department</div>
                <div className="field-value" style={{ fontSize: "13px", fontWeight: 500 }}>{selected.departmentName || "—"}</div>
              </div>
              <div>
                <div className="field-label" style={{ textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "4px" }}>Appointment ID</div>
                <div className="field-value" style={{ fontSize: "13px", fontWeight: 500 }}>{selected.appointmentId || "—"}</div>
              </div>
              <div>
                <div className="field-label" style={{ textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "4px" }}>Date & Time</div>
                <div className="field-value" style={{ fontSize: "13px", fontWeight: 500 }}>
                  {selected.startTime && selected.endTime ? `${selected.startTime} - ${selected.endTime}` : "—"}
                </div>
              </div>
              <div>
                <div className="field-label" style={{ textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "4px" }}>Current Status</div>
                <div>
                  <span className={`pill ${APPT_STATUS_CLASS[selected.status] || "blue"}`}>
                    {selected.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div style={{ marginBottom: "16px" }}>
              <div className="field-label" style={{ textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "4px" }}>Remarks</div>
              <div style={{ background: "var(--bg)", padding: "10px 12px", borderRadius: "8px", border: "0.5px solid var(--border)", fontSize: "13px", color: "var(--text-primary)", whiteSpace: "pre-line" }}>
                {selected.remarks || "No remarks provided."}
              </div>
            </div>

            {/* Read-Only Payment Status Block */}
            <DoctorPaymentStatus appointmentId={selected.appointmentId} />

            {/* Actions Section */}
            {(selected.status === "PENDING" || selected.status === "CONFIRMED") && (
              <>
                <hr style={{ border: "none", borderTop: "0.5px solid var(--border)", margin: "16px 0" }} />
                <div>
                  <div className="field-label" style={{ textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "8px" }}>Update Status</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {selected.status === "PENDING" && (
                      <>
                        <button
                          className="btn btn-primary"
                          style={{ flex: 1, justifyContent: "center" }}
                          disabled={actionLoading}
                          onClick={() => runAction("confirm")}
                        >
                          <IconCheck size={16} /> Confirm
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ flex: 1, justifyContent: "center", color: "#791F1F", borderColor: "#E8ECF1" }}
                          disabled={actionLoading}
                          onClick={() => runAction("cancel")}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {selected.status === "CONFIRMED" && (
                      <>
                        <button
                          className="btn btn-primary"
                          style={{ flex: 1, justifyContent: "center" }}
                          disabled={actionLoading}
                          onClick={() => runAction("complete")}
                        >
                          <IconCheck size={16} /> Mark completed
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ flex: 1, justifyContent: "center", color: "#791F1F", borderColor: "#E8ECF1" }}
                          disabled={actionLoading}
                          onClick={() => runAction("cancel")}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {(selected.status === "CONFIRMED" || selected.status === "COMPLETED") && (
              <>
                <hr style={{ border: "none", borderTop: "0.5px solid var(--border)", margin: "16px 0" }} />
                <div>
                  <div className="field-label" style={{ textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "8px" }}>Prescription</div>
                  {prescription ? (
                    <button
                      className="btn btn-outline"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => setPrescriptionModalOpen(true)}
                    >
                      View Prescription
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", background: "var(--teal)", borderColor: "var(--teal)" }}
                      onClick={() => setPrescriptionModalOpen(true)}
                    >
                      Write Prescription
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Post-Completion Prescription Prompt Modal */}
      {completePromptOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 31, 63, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 110,
          }}
          onClick={() => setCompletePromptOpen(false)}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "24px",
              borderRadius: "14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              background: "#fff",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#E6F7F1",
                color: "#178A66",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <IconCheck size={26} />
            </div>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
              Appointment Completed!
            </h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Appointment for <strong>{selected?.patientName}</strong> is now marked as Completed. Would you like to write a prescription now?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1, padding: "9px 14px", fontSize: "13px" }}
                onClick={() => setCompletePromptOpen(false)}
              >
                Skip for now
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: "9px 14px", fontSize: "13px", background: "var(--teal)" }}
                onClick={() => {
                  setCompletePromptOpen(false);
                  setPrescriptionModalOpen(true);
                }}
              >
                Write Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      <PrescriptionModal
        open={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        appointmentId={selected?.appointmentId}
        prescription={prescription}
        onSaveSuccess={() => {
          if (selected) openDetail(selected);
        }}
      />
    </div>
  );
}
