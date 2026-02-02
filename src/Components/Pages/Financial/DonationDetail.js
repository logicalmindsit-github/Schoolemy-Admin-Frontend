import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDonation } from "../../../Utils/donationApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DonationDetail = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDonation = useCallback(async () => {
    try {
      const response = await getDonation(donationId);
      setDonation(response.data.data);
    } catch (error) {
      console.error("Error fetching donation:", error);
      alert("Failed to fetch donation details");
    } finally {
      setLoading(false);
    }
  }, [donationId]);

  useEffect(() => {
    fetchDonation();
  }, [fetchDonation]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadBill = async () => {
    try {
      const billElement = document.getElementById('donation-bill');
      if (!billElement) return;

      const canvas = await html2canvas(billElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Donation_Receipt_${donation.receiptNumber || donationId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download bill. Please try again.');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!donation) {
    return <div style={styles.error}>Donation not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 style={styles.title}>Donation Details</h1>
        <div style={styles.buttonGroup}>
          <button
            style={styles.downloadButton}
            onClick={downloadBill}
          >
            📄 Download Bill
          </button>
          <button
            style={styles.editButton}
            onClick={() => navigate(`/schoolemy/donation/edit/${donationId}`)}
          >
            Edit
          </button>
        </div>
      </div>

      <div id="donation-bill" style={styles.card}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>
          <div style={styles.grid}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Receipt Number:</span>
              <span style={styles.fieldValue}>{donation.receiptNumber}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Amount:</span>
              <span style={{ ...styles.fieldValue, ...styles.amountValue }}>
                {formatCurrency(donation.amount)}
              </span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Status:</span>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(donation.status),
                }}
              >
                {donation.status}
              </span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Date:</span>
              <span style={styles.fieldValue}>
                {formatDate(donation.date)}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Donor Information</h2>
          <div style={styles.grid}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Name:</span>
              <span style={styles.fieldValue}>
                {donation.isAnonymous ? "Anonymous" : donation.donorName}
              </span>
            </div>
            {!donation.isAnonymous && (
              <>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Email:</span>
                  <span style={styles.fieldValue}>
                    {donation.donorEmail || "N/A"}
                  </span>
                </div>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Phone:</span>
                  <span style={styles.fieldValue}>
                    {donation.donorPhone || "N/A"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Transaction Details</h2>
          <div style={styles.grid}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Donation Type:</span>
              <span style={styles.fieldValue}>{donation.donationType}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Category:</span>
              <span style={styles.fieldValue}>{donation.category}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Transaction ID:</span>
              <span style={styles.fieldValue}>
                {donation.transactionId || "N/A"}
              </span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Purpose:</span>
              <span style={styles.fieldValue}>
                {donation.purpose || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {donation.description && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Description</h2>
            <p style={styles.description}>{donation.description}</p>
          </div>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Audit Trail</h2>
          <div style={styles.auditList}>
            {donation.auditLog?.map((log, index) => (
              <div key={index} style={styles.auditItem}>
                <div style={styles.auditAction}>{log.action}</div>
                <div style={styles.auditDetails}>
                  <span style={styles.auditUser}>
                    By: {log.performedBy?.name || "System"}
                  </span>
                  <span style={styles.auditTime}>
                    {formatDate(log.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {donation.createdBy && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Created By</h2>
            <div style={styles.grid}>
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Name:</span>
                <span style={styles.fieldValue}>
                  {donation.createdBy.name}
                </span>
              </div>
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Email:</span>
                <span style={styles.fieldValue}>
                  {donation.createdBy.email}
                </span>
              </div>
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Role:</span>
                <span style={styles.fieldValue}>
                  {donation.createdBy.role}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    Completed: "#10b981",
    Verified: "#3b82f6",
    Pending: "#f59e0b",
    Cancelled: "#ef4444",
  };
  return colors[status] || "#6b7280";
};

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  editButton: {
    padding: "10px 20px",
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
  },
  downloadButton: {
    padding: "10px 20px",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
  },
  section: {
    marginBottom: "32px",
    paddingBottom: "32px",
    borderBottom: "1px solid #e1e5e9",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fieldLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  fieldValue: {
    fontSize: "16px",
    color: "#1a1a1a",
  },
  amountValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#10b981",
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    width: "fit-content",
  },
  description: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.6",
  },
  auditList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  auditItem: {
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    borderLeft: "4px solid #667eea",
  },
  auditAction: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  auditDetails: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#6b7280",
  },
  auditUser: {
    fontWeight: "500",
  },
  auditTime: {
    fontStyle: "italic",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
  error: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#ef4444",
  },
};

export default DonationDetail;
