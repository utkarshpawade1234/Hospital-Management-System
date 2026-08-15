import React, { useState, useEffect } from "react";
import { IconChevronDown, IconChevronUp, IconCalendar, IconUser, IconFileText, IconPills, IconDownload } from "@tabler/icons-react";
import api from "../api/patientAxios";
import toast from "react-hot-toast";
import { downloadPrescription } from "../../utils/downloadPrescription";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    api.get("/patient/profile/myProfile")
      .then((res) => {
        const u = res.data?.user || res.data;
        if (u && (u.firstName || u.lastName)) {
          setPatientName(`${u.firstName || ''} ${u.lastName || ''}`.trim());
        }
      })
      .catch(() => {});

    api.get("/patient/prescriptions")
      .then((res) => {
        setPrescriptions(res.data || []);
      })
      .catch(() => {
        toast.error("Failed to load your prescriptions");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <div>
          <h2>My Prescriptions</h2>
          <p>View and manage all prescriptions issued by your doctors</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 8 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-row" style={{ height: "100px", marginBottom: "12px", borderRadius: "10px" }} />
          ))}
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="card" style={{ padding: "40px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "var(--blue-bg)", color: "var(--blue-text)", padding: "16px", borderRadius: "50%" }}>
            <IconFileText size={32} />
          </div>
          <h4 style={{ margin: 0, fontWeight: 600 }}>No prescriptions yet</h4>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, maxWidth: "300px" }}>
            When a doctor prescribes you medicine for a completed appointment, it will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {prescriptions.map((pres) => {
            const isExpanded = expandedCardId === pres.prescriptionId;
            return (
              <div
                key={pres.prescriptionId}
                className="card"
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "0.5px solid var(--border)",
                  background: "#fff",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Card Header info */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, color: "var(--text-primary)", fontSize: "14px" }}>
                      <IconUser size={16} style={{ color: "var(--teal)" }} />
                      {pres.doctorName || "Doctor"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                      <IconCalendar size={14} />
                      {pres.appointmentDate}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => downloadPrescription(pres, { patientName: pres.patientName || patientName })}
                      style={{
                        background: "var(--blue-bg)",
                        border: "0.5px solid var(--border)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--teal)",
                        padding: "5px 10px",
                        borderRadius: "6px"
                      }}
                      title="Download or Print Prescription PDF"
                    >
                      <IconDownload size={15} /> Download PDF
                    </button>

                    <button
                      onClick={() => toggleExpand(pres.prescriptionId)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "var(--teal)",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        backgroundColor: "var(--bg)"
                      }}
                    >
                      {isExpanded ? (
                        <>
                          Hide Details <IconChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          View Medicines ({pres.medicines?.length || 0}) <IconChevronDown size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Diagnosis snippet */}
                <div style={{ marginTop: "12px" }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Diagnosis
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                    {pres.diagnosis}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "0.5px solid var(--border)" }}>
                    {pres.notes && (
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                          Notes / Instructions
                        </div>
                        <div style={{ background: "var(--bg)", padding: "10px 12px", borderRadius: "8px", border: "0.5px solid var(--border)", fontSize: "12px", color: "var(--text-primary)" }}>
                          {pres.notes}
                        </div>
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                        Prescribed Medicines
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {pres.medicines?.map((med) => (
                          <div
                            key={med.prescriptionMedicineId}
                            style={{
                              border: "0.5px solid var(--border)",
                              borderRadius: "8px",
                              padding: "12px",
                              background: "#F9FAFC",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "13px", color: "var(--navy)" }}>
                                <IconPills size={16} style={{ color: "var(--teal)" }} />
                                {med.medicineName}
                              </div>
                              {med.quantity && (
                                <span style={{ fontSize: "11px", color: "var(--text-secondary)", backgroundColor: "var(--bg)", padding: "2px 6px", borderRadius: "4px" }}>
                                  Qty: {med.quantity}
                                </span>
                              )}
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "12px" }}>
                              <div>
                                <span style={{ color: "var(--text-secondary)" }}>Dosage:</span> {med.dosage}
                              </div>
                              <div>
                                <span style={{ color: "var(--text-secondary)" }}>Frequency:</span> {med.frequency}
                              </div>
                              <div>
                                <span style={{ color: "var(--text-secondary)" }}>Duration:</span> {med.duration}
                              </div>
                            </div>

                            {med.instructions && (
                              <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontStyle: "italic", borderTop: "0.5px dashed var(--border)", paddingTop: "6px" }}>
                                Instructions: {med.instructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
