import React, { useState, useEffect, useRef } from "react";
import { IconX, IconTrash, IconPlus, IconSearch, IconDownload } from "@tabler/icons-react";
import api from "../api";
import toast from "react-hot-toast";
import { downloadPrescription } from "../../utils/downloadPrescription";

export default function PrescriptionModal({ open, onClose, appointmentId, prescription, patientName, onSaveSuccess }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([
    { medicineId: "", medicineName: "", dosage: "", frequency: "", duration: "", instructions: "", quantity: "" }
  ]);

  const [loading, setLoading] = useState(false);
  
  // Search dropdown states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const dropdownRef = useRef(null);

  const modalKey = open ? (prescription?.prescriptionId || 'new') : null;
  const [prevModalKey, setPrevModalKey] = useState(modalKey);
  if (modalKey !== prevModalKey) {
    setPrevModalKey(modalKey);
    if (prescription) {
      setDiagnosis(prescription.diagnosis || "");
      setNotes(prescription.notes || "");
      setMedicines(prescription.medicines || []);
    } else {
      setDiagnosis("");
      setNotes("");
      setMedicines([
        { medicineId: "", medicineName: "", dosage: "", frequency: "", duration: "", instructions: "", quantity: "" }
      ]);
    }
  }

  // Click outside listener for search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveRowIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search trigger when keyword changes
  useEffect(() => {
    if (activeRowIndex === null || !searchKeyword.trim()) {
      return;
    }
    const delayDebounce = setTimeout(() => {
      setSearching(true);
      api.get("/doctor/medicines/search", { params: { keyword: searchKeyword.trim(), page: 0, size: 20 } })
        .then((res) => {
          setSearchResults(res.data?.content || []);
        })
        .catch(() => {})
        .finally(() => {
          setSearching(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchKeyword, activeRowIndex]);

  const displayedSearchResults = (activeRowIndex === null || !searchKeyword.trim()) ? [] : searchResults;

  if (!open) return null;

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      { medicineId: "", medicineName: "", dosage: "", frequency: "", duration: "", instructions: "", quantity: "" }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    setMedicines((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const startSearch = (index, currentName) => {
    setActiveRowIndex(index);
    setSearchKeyword(currentName || "");
  };

  const selectMedicine = (index, med) => {
    handleMedicineChange(index, "medicineId", med.medicineId);
    handleMedicineChange(index, "medicineName", med.medicineName);
    setActiveRowIndex(null);
    setSearchKeyword("");
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      toast.error("Diagnosis is required");
      return;
    }

    // Filter and check valid medicines
    const validMedicines = medicines.filter(m => m.medicineId && m.dosage && m.frequency && m.duration);
    if (medicines.length > 0 && validMedicines.length !== medicines.length) {
      toast.error("Please fill in Medicine, Dosage, Frequency, and Duration for all rows.");
      return;
    }

    setLoading(true);
    const dto = {
      appointmentId,
      diagnosis: diagnosis.trim(),
      notes: notes.trim() || null,
      medicines: validMedicines
    };

    try {
      await api.post(`/doctor/appointments/${appointmentId}/prescription`, dto);
      toast.success("Prescription created successfully");
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = !!prescription;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11, 31, 63, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "750px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          background: "#fff",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: "4px",
            zIndex: 10
          }}
        >
          <IconX size={18} />
        </button>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "0.5px solid var(--border)" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
            {isReadOnly ? "Prescription Details" : "Write Prescription"}
          </h3>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
          <div style={{ padding: "24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Diagnosis */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Diagnosis *
              </label>
              {isReadOnly ? (
                <div style={{ background: "var(--bg)", padding: "10px 12px", borderRadius: "8px", border: "0.5px solid var(--border)", fontSize: "13px" }}>
                  {diagnosis}
                </div>
              ) : (
                <textarea
                  required
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "0.5px solid var(--border)",
                    fontSize: "13px",
                    outline: "none",
                    resize: "vertical"
                  }}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis details..."
                />
              )}
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Notes (optional)
              </label>
              {isReadOnly ? (
                <div style={{ background: "var(--bg)", padding: "10px 12px", borderRadius: "8px", border: "0.5px solid var(--border)", fontSize: "13px" }}>
                  {notes || "No notes provided."}
                </div>
              ) : (
                <textarea
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "0.5px solid var(--border)",
                    fontSize: "13px",
                    outline: "none",
                    resize: "vertical"
                  }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter clinical notes..."
                />
              )}
            </div>

            {/* Medicines Repeating Section */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px" }}>
                Medicines
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {medicines.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "0.5px solid var(--border)",
                      borderRadius: "10px",
                      padding: "14px",
                      background: "#F9FAFC",
                      position: "relative"
                    }}
                  >
                    {/* Trash button (only if not readonly and >1 row) */}
                    {!isReadOnly && medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(idx)}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#791F1F"
                        }}
                      >
                        <IconTrash size={16} />
                      </button>
                    )}

                    {/* Row Form Inputs */}
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                      
                      {/* Medicine Picker / Autocomplete */}
                      <div style={{ position: "relative" }}>
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Medicine Name *</span>
                        {isReadOnly ? (
                          <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--navy)" }}>{item.medicineName}</div>
                        ) : (
                          <div style={{ position: "relative" }}>
                            <input
                              type="text"
                              required
                              placeholder="Type name..."
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: "6px",
                                border: "0.5px solid var(--border)",
                                fontSize: "12px"
                              }}
                              value={item.medicineName}
                              onChange={(e) => {
                                handleMedicineChange(idx, "medicineName", e.target.value);
                                handleMedicineChange(idx, "medicineId", ""); // Reset ID on edit
                                startSearch(idx, e.target.value);
                              }}
                              onFocus={() => startSearch(idx, item.medicineName)}
                            />
                            {/* Search overlay dropdown */}
                            {activeRowIndex === idx && (
                              <div
                                ref={dropdownRef}
                                style={{
                                  position: "absolute",
                                  top: "32px",
                                  left: 0,
                                  right: 0,
                                  background: "#fff",
                                  border: "0.5px solid var(--border)",
                                  borderRadius: "6px",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  zIndex: 100,
                                  maxHeight: "150px",
                                  overflowY: "auto"
                                }}
                              >
                                {searching ? (
                                  <div style={{ padding: "8px", fontSize: "11px", color: "var(--text-secondary)" }}>Searching...</div>
                                ) : displayedSearchResults.length === 0 ? (
                                  <div style={{ padding: "8px", fontSize: "11px", color: "var(--text-secondary)" }}>No active matches</div>
                                ) : (
                                  displayedSearchResults.map((med) => (
                                    <div
                                      key={med.medicineId}
                                      onClick={() => selectMedicine(idx, med)}
                                      style={{
                                        padding: "8px 10px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        borderBottom: "0.5px solid var(--border)"
                                      }}
                                      className="search-item-hover"
                                    >
                                      <div style={{ fontWeight: 600 }}>{med.medicineName}</div>
                                      <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{med.genericName}</div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Dosage */}
                      <div>
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Dosage *</span>
                        {isReadOnly ? (
                          <div style={{ fontSize: "12px" }}>{item.dosage}</div>
                        ) : (
                          <input
                            type="text"
                            required
                            placeholder="e.g. 500mg / 1 tsp"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "0.5px solid var(--border)",
                              fontSize: "12px"
                            }}
                            value={item.dosage}
                            onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
                          />
                        )}
                      </div>

                      {/* Frequency */}
                      <div>
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Frequency *</span>
                        {isReadOnly ? (
                          <div style={{ fontSize: "12px" }}>{item.frequency}</div>
                        ) : (
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1-0-1 / Once daily"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "0.5px solid var(--border)",
                              fontSize: "12px"
                            }}
                            value={item.frequency}
                            onChange={(e) => handleMedicineChange(idx, "frequency", e.target.value)}
                          />
                        )}
                      </div>

                      {/* Duration */}
                      <div>
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Duration *</span>
                        {isReadOnly ? (
                          <div style={{ fontSize: "12px" }}>{item.duration}</div>
                        ) : (
                          <input
                            type="text"
                            required
                            placeholder="e.g. 5 days / 1 month"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "0.5px solid var(--border)",
                              fontSize: "12px"
                            }}
                            value={item.duration}
                            onChange={(e) => handleMedicineChange(idx, "duration", e.target.value)}
                          />
                        )}
                      </div>
                    </div>

                    {/* Instructions & Quantity */}
                    <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "10px" }}>
                      <div>
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Instructions</span>
                        {isReadOnly ? (
                          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic" }}>{item.instructions || "—"}</div>
                        ) : (
                          <input
                            type="text"
                            placeholder="e.g. Take after meals"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "0.5px solid var(--border)",
                              fontSize: "12px"
                            }}
                            value={item.instructions}
                            onChange={(e) => handleMedicineChange(idx, "instructions", e.target.value)}
                          />
                        )}
                      </div>

                      <div>
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Qty</span>
                        {isReadOnly ? (
                          <div style={{ fontSize: "12px" }}>{item.quantity || "—"}</div>
                        ) : (
                          <input
                            type="text"
                            placeholder="e.g. 10"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "0.5px solid var(--border)",
                              fontSize: "12px"
                            }}
                            value={item.quantity}
                            onChange={(e) => handleMedicineChange(idx, "quantity", e.target.value)}
                          />
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {!isReadOnly && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleAddMedicine}
                  style={{
                    marginTop: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    padding: "6px 12px"
                  }}
                >
                  <IconPlus size={14} /> Add another medicine
                </button>
              )}
            </div>

          </div>

          {/* Footer Actions */}
          <div style={{ padding: "16px 24px", borderTop: "0.5px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {prescription && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => downloadPrescription(prescription, { patientName: prescription?.patientName || patientName })}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--teal)", borderColor: "var(--teal)", fontSize: "13px" }}
                >
                  <IconDownload size={16} /> Download PDF
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Submitting..." : "Save Prescription"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
