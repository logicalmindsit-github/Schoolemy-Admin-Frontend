import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExpense } from "../../../Utils/expenseApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ExpenseDetail = () => {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchExpense = useCallback(async () => {
    try {
      const response = await getExpense(expenseId);
      setExpense(response.data.data);
    } catch (error) {
      console.error("Error fetching expense:", error);
      alert("Failed to fetch expense details");
    } finally {
      setLoading(false);
    }
  }, [expenseId]);

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

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
      const billElement = document.getElementById('expense-bill');
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

      pdf.save(`Expense_Bill_${expense.invoiceNumber || expenseId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download bill. Please try again.');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!expense) {
    return <div style={styles.error}>Expense not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 style={styles.title}>Expense Details</h1>
        <div style={styles.buttonGroup}>
          <button
            style={styles.downloadButton}
            onClick={downloadBill}
          >
            📄 Download Bill
          </button>
          <button
            style={styles.editButton}
            onClick={() => navigate(`/schoolemy/expense/edit/${expenseId}`)}
          >
            Edit
          </button>
        </div>
      </div>

      <div id="expense-bill" style={styles.card}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>
          <div style={styles.grid}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Invoice Number:</span>
              <span style={styles.fieldValue}>{expense.invoiceNumber}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Title:</span>
              <span style={styles.fieldValue}>{expense.title}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Amount:</span>
              <span style={{ ...styles.fieldValue, ...styles.amountValue }}>
                {formatCurrency(expense.amount)}
              </span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Status:</span>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(expense.status),
                }}
              >
                {expense.status}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Category & Department</h2>
          <div style={styles.grid}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Category:</span>
              <span style={styles.fieldValue}>{expense.category}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Sub Category:</span>
              <span style={styles.fieldValue}>
                {expense.subCategory || "N/A"}
              </span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Department:</span>
              <span style={styles.fieldValue}>
                {expense.department || "N/A"}
              </span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Recurring:</span>
              <span style={styles.fieldValue}>
                {expense.isRecurring
                  ? `Yes (${expense.recurringPeriod})`
                  : "No"}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Vendor Information</h2>
          <div style={styles.grid}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Vendor Name:</span>
              <span style={styles.fieldValue}>
                {expense.vendorName || "N/A"}
              </span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Vendor Contact:</span>
              <span style={styles.fieldValue}>
                {expense.vendorContact || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Payment Details</h2>
          <div style={styles.grid}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Payment Method:</span>
              <span style={styles.fieldValue}>{expense.paymentMethod}</span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Transaction ID:</span>
              <span style={styles.fieldValue}>
                {expense.transactionId || "N/A"}
              </span>
            </div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Date:</span>
              <span style={styles.fieldValue}>{formatDate(expense.date)}</span>
            </div>
            {expense.dueDate && (
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Due Date:</span>
                <span style={styles.fieldValue}>
                  {formatDate(expense.dueDate)}
                </span>
              </div>
            )}
          </div>
        </div>

        {expense.description && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Description</h2>
            <p style={styles.description}>{expense.description}</p>
          </div>
        )}

        {expense.approvedBy && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Approval Information</h2>
            <div style={styles.grid}>
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Approved By:</span>
                <span style={styles.fieldValue}>
                  {expense.approvedBy.name}
                </span>
              </div>
              {expense.approvedDate && (
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Approved Date:</span>
                  <span style={styles.fieldValue}>
                    {formatDate(expense.approvedDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Audit Trail</h2>
          <div style={styles.auditList}>
            {expense.auditLog?.map((log, index) => (
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
                {log.changes?.reason && (
                  <div style={styles.auditReason}>
                    Reason: {log.changes.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {expense.createdBy && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Created By</h2>
            <div style={styles.grid}>
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Name:</span>
                <span style={styles.fieldValue}>
                  {expense.createdBy.name}
                </span>
              </div>
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Email:</span>
                <span style={styles.fieldValue}>
                  {expense.createdBy.email}
                </span>
              </div>
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Role:</span>
                <span style={styles.fieldValue}>
                  {expense.createdBy.role}
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
    Pending: "#f59e0b",
    Approved: "#8b5cf6",
    Paid: "#10b981",
    Rejected: "#ef4444",
    Cancelled: "#6b7280",
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
    color: "#ef4444",
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
  auditReason: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#ef4444",
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

export default ExpenseDetail;
