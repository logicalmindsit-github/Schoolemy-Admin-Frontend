import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./FinancialStyles.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  listDonations,
  getDonationStatistics,
  deleteDonation,
  verifyDonation,
} from "../../../Utils/donationApi";
import {
  listExpenses,
  getExpenseStatistics,
  deleteExpense,
  approveExpense,
  markExpenseAsPaid,
  rejectExpense,
} from "../../../Utils/expenseApi";

const FinancialAuditingScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [donationStats, setDonationStats] = useState(null);
  const [expenseStats, setExpenseStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    category: "",
    search: "",
  });

  // Pagination
  const [donationPage, setDonationPage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  const [donationPagination, setDonationPagination] = useState(null);
  const [expensePagination, setExpensePagination] = useState(null);

  const fetchStatistics = useCallback(async () => {
    try {
      const [donationRes, expenseRes] = await Promise.all([
        getDonationStatistics({
          startDate: filters.startDate,
          endDate: filters.endDate,
        }),
        getExpenseStatistics({
          startDate: filters.startDate,
          endDate: filters.endDate,
        }),
      ]);
      setDonationStats(donationRes.data.data);
      setExpenseStats(expenseRes.data.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  }, [filters.startDate, filters.endDate]);

  const fetchDonations = useCallback(async () => {
    try {
      const response = await listDonations({
        page: donationPage,
        limit: 10,
        ...filters,
      });
      setDonations(response.data.data || []);
      setDonationPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  }, [donationPage, filters]);

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await listExpenses({
        page: expensePage,
        limit: 10,
        ...filters,
      });
      setExpenses(response.data.data || []);
      setExpensePagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, [expensePage, filters]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        await Promise.all([fetchStatistics(), fetchDonations(), fetchExpenses()]);
      } else if (activeTab === "donations") {
        await fetchDonations();
      } else if (activeTab === "expenses") {
        await fetchExpenses();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, fetchStatistics, fetchDonations, fetchExpenses]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteDonation = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await deleteDonation(id);
        fetchDonations();
      } catch (error) {
        alert("Failed to delete donation");
      }
    }
  };

  const handleVerifyDonation = async (id) => {
    try {
      await verifyDonation(id);
      fetchDonations();
      fetchStatistics();
    } catch (error) {
      alert("Failed to verify donation");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (error) {
        alert("Failed to delete expense");
      }
    }
  };

  const handleApproveExpense = async (id) => {
    try {
      await approveExpense(id);
      fetchExpenses();
      fetchStatistics();
    } catch (error) {
      alert("Failed to approve expense");
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await markExpenseAsPaid(id);
      fetchExpenses();
      fetchStatistics();
    } catch (error) {
      alert("Failed to mark as paid");
    }
  };

  const handleRejectExpense = async (id) => {
    const reason = prompt("Please enter rejection reason:");
    if (reason) {
      try {
        await rejectExpense(id, reason);
        fetchExpenses();
        fetchStatistics();
      } catch (error) {
        alert("Failed to reject expense");
      }
    }
  };

  const downloadDonationBill = async (donation) => {
    try {
      // Create a temporary div with donation details for PDF generation
      const billContent = document.createElement('div');
      billContent.id = 'donation-bill-temp';
      billContent.style.cssText = `
        padding: 20px;
        font-family: Arial, sans-serif;
        background: white;
        max-width: 600px;
        margin: 0 auto;
      `;

      billContent.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">DONATION RECEIPT</h1>
          <p style="color: #666; margin: 5px 0;">Receipt #${donation.receiptNumber}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Donor Information</h3>
          <p><strong>Name:</strong> ${donation.isAnonymous ? 'Anonymous' : donation.donorName}</p>
          ${!donation.isAnonymous ? `<p><strong>Email:</strong> ${donation.donorEmail || 'N/A'}</p>` : ''}
          ${!donation.isAnonymous ? `<p><strong>Phone:</strong> ${donation.donorPhone || 'N/A'}</p>` : ''}
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Donation Details</h3>
          <p><strong>Amount:</strong> ${formatCurrency(donation.amount)}</p>
          <p><strong>Type:</strong> ${donation.donationType}</p>
          <p><strong>Category:</strong> ${donation.category}</p>
          <p><strong>Date:</strong> ${formatDate(donation.date)}</p>
          <p><strong>Status:</strong> ${donation.status}</p>
          ${donation.transactionId ? `<p><strong>Transaction ID:</strong> ${donation.transactionId}</p>` : ''}
          ${donation.purpose ? `<p><strong>Purpose:</strong> ${donation.purpose}</p>` : ''}
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Description</h3>
          <p>${donation.description || 'No description provided'}</p>
        </div>

        <div style="text-align: center; margin-top: 50px; color: #666; font-size: 12px;">
          <p>Thank you for your generous donation!</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      `;

      document.body.appendChild(billContent);

      const canvas = await html2canvas(billContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(billContent);

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

      pdf.save(`Donation_Receipt_${donation.receiptNumber || donation._id}.pdf`);
    } catch (error) {
      console.error('Error generating donation PDF:', error);
      alert('Failed to download donation bill. Please try again.');
    }
  };

  const downloadExpenseBill = async (expense) => {
    try {
      // Create a temporary div with expense details for PDF generation
      const billContent = document.createElement('div');
      billContent.id = 'expense-bill-temp';
      billContent.style.cssText = `
        padding: 20px;
        font-family: Arial, sans-serif;
        background: white;
        max-width: 600px;
        margin: 0 auto;
      `;

      billContent.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">EXPENSE BILL</h1>
          <p style="color: #666; margin: 5px 0;">Invoice #${expense.invoiceNumber}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Expense Details</h3>
          <p><strong>Title:</strong> ${expense.title}</p>
          <p><strong>Amount:</strong> ${formatCurrency(expense.amount)}</p>
          <p><strong>Category:</strong> ${expense.category}</p>
          <p><strong>Vendor:</strong> ${expense.vendorName || 'N/A'}</p>
          <p><strong>Date:</strong> ${formatDate(expense.date)}</p>
          <p><strong>Status:</strong> ${expense.status}</p>
          ${expense.paymentMethod ? `<p><strong>Payment Method:</strong> ${expense.paymentMethod}</p>` : ''}
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Department & Approval</h3>
          <p><strong>Department:</strong> ${expense.department || 'N/A'}</p>
          <p><strong>Requested By:</strong> ${expense.requestedBy?.name || 'N/A'}</p>
          <p><strong>Approved By:</strong> ${expense.approvedBy?.name || 'N/A'}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Description</h3>
          <p>${expense.description || 'No description provided'}</p>
        </div>

        <div style="text-align: center; margin-top: 50px; color: #666; font-size: 12px;">
          <p>Expense Management System</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      `;

      document.body.appendChild(billContent);

      const canvas = await html2canvas(billContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(billContent);

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

      pdf.save(`Expense_Bill_${expense.invoiceNumber || expense._id}.pdf`);
    } catch (error) {
      console.error('Error generating expense PDF:', error);
      alert('Failed to download expense bill. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Completed: "#10b981",
      Verified: "#3b82f6",
      Pending: "#f59e0b",
      Cancelled: "#ef4444",
      Approved: "#8b5cf6",
      Paid: "#10b981",
      Rejected: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const calculateBalance = () => {
    const totalDonations = donationStats?.overall?.totalAmount || 0;
    const totalExpenses = expenseStats?.overall?.totalAmount || 0;
    return totalDonations - totalExpenses;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Financial Auditing & Management</h1>
        <div style={styles.buttonGroup}>
          {/* <button
            style={styles.createButton}
            onClick={() => navigate("/schoolemy/donation/new")}
          >
            + Add Donation
          </button>
          <button
            style={styles.createButton}
            onClick={() => navigate("/schoolemy/expense/new")}
          >
            + Add Expense
          </button> */}
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          style={styles.filterInput}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          style={styles.filterInput}
          placeholder="End Date"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={styles.filterInput}
          placeholder="Search..."
        />

        <div style={styles.filterActions}>
          <button
            style={styles.resetButton}
            onClick={() =>
              setFilters({
                startDate: "",
                endDate: "",
                status: "",
                category: "",
                search: "",
              })
            }
          >
            Reset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        {[
          { key: "overview", label: "Overview" },
          { key: "donations", label: "Donations" },
          { key: "expenses", label: "Expenses" },
          { key: "monthly-fees", label: "Monthly Fees", route: "/schoolemy/monthly-fees-AUD" },
          { key: "direct-meet-fees", label: "Direct Meet Fees", route: "/schoolemy/direct-meet-fees-AUD" },
          { key: "payment-record", label: "Payment Record", route: "/schoolemy/payment-records-AUD" },
        ].map((tab) => (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.activeTab : {}),
            }}
            onClick={() => {
              if (tab.route) {
                navigate(tab.route);
              } else {
                setActiveTab(tab.key);
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <div style={styles.loading}>Loading...</div>}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div style={styles.overviewContainer}>
          <div style={styles.statsGrid}>
            <div style={{ ...styles.statCard, borderLeft: "4px solid #10b981" }}>
              <h3 style={styles.statLabel}>Total Donations</h3>
              <p style={styles.statValue}>
                {formatCurrency(donationStats?.overall?.totalAmount)}
              </p>
              <p style={styles.statSubtext}>
                {donationStats?.overall?.totalDonations || 0} transactions
              </p>
            </div>

            <div style={{ ...styles.statCard, borderLeft: "4px solid #ef4444" }}>
              <h3 style={styles.statLabel}>Total Expenses</h3>
              <p style={styles.statValue}>
                {formatCurrency(expenseStats?.overall?.totalAmount)}
              </p>
              <p style={styles.statSubtext}>
                {expenseStats?.overall?.totalExpenses || 0} transactions
              </p>
            </div>

            {/* <div
              style={{
                ...styles.statCard,
                borderLeft: `4px solid ${
                  calculateBalance() >= 0 ? "#10b981" : "#ef4444"
                }`,
              }}
            >
              <h3 style={styles.statLabel}>Net Balance <span style={styles.currencyNote}>(INR)</span></h3>
              <p
                style={{
                  ...styles.statValue,
                  color: calculateBalance() >= 0 ? "#10b981" : "#ef4444",
                }}
              >
                {formatCurrency(calculateBalance())}
              </p>
              <p style={styles.statSubtext}>
                {calculateBalance() >= 0 ? "Surplus" : "Deficit"} ({formatCurrency(Math.abs(calculateBalance()))})
              </p>
            </div> */}

            <div style={{ ...styles.statCard, borderLeft: "4px solid #3b82f6" }}>
              <h3 style={styles.statLabel}>Average Donation</h3>
              <p style={styles.statValue}>
                {formatCurrency(donationStats?.overall?.avgDonation)}
              </p>
              <p style={styles.statSubtext}>Per transaction</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={styles.chartsGrid}>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Donations by Category</h3>
              <div style={styles.categoryList}>
                {donationStats?.byCategory?.map((cat, idx) => (
                  <div key={idx} style={styles.categoryItem}>
                    <span style={styles.categoryName}>{cat._id}</span>
                    <span style={styles.categoryAmount}>
                      {formatCurrency(cat.totalAmount)}
                    </span>
                    <span style={styles.categoryCount}>({cat.count})</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Expenses by Category</h3>
              <div style={styles.categoryList}>
                {expenseStats?.byCategory?.map((cat, idx) => (
                  <div key={idx} style={styles.categoryItem}>
                    <span style={styles.categoryName}>{cat._id}</span>
                    <span style={styles.categoryAmount}>
                      {formatCurrency(cat.totalAmount)}
                    </span>
                    <span style={styles.categoryCount}>({cat.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div style={styles.recentSection}>
            <h3 style={styles.sectionTitle}>Recent Donations</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Receipt No</th>
                    <th style={styles.th}>Donor</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.slice(0, 5).map((donation) => (
                    <tr key={donation._id} style={styles.tr}>
                      <td style={styles.td}>{donation.receiptNumber}</td>
                      <td style={styles.td}>
                        {donation.isAnonymous ? "Anonymous" : donation.donorName}
                      </td>
                      <td style={styles.td}>{formatCurrency(donation.amount)}</td>
                      <td style={styles.td}>{donation.category}</td>
                      <td style={styles.td}>{formatDate(donation.date)}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: getStatusColor(donation.status),
                          }}
                        >
                          {donation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.recentSection}>
            <h3 style={styles.sectionTitle}>Recent Expenses</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Invoice No</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 5).map((expense) => (
                    <tr key={expense._id} style={styles.tr}>
                      <td style={styles.td}>{expense.invoiceNumber}</td>
                      <td style={styles.td}>{expense.title}</td>
                      <td style={styles.td}>{formatCurrency(expense.amount)}</td>
                      <td style={styles.td}>{expense.category}</td>
                      <td style={styles.td}>{formatDate(expense.date)}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: getStatusColor(expense.status),
                          }}
                        >
                          {expense.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Donations Tab */}
      {activeTab === "donations" && (
        <div style={styles.contentContainer}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Receipt No</th>
                  <th style={styles.th}>Donor Name</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id} style={styles.tr}>
                    <td style={styles.td}>{donation.receiptNumber}</td>
                    <td style={styles.td}>
                      {donation.isAnonymous ? "Anonymous" : donation.donorName}
                    </td>
                    <td style={styles.td}>{formatCurrency(donation.amount)}</td>
                    <td style={styles.td}>{donation.donationType}</td>
                    <td style={styles.td}>{donation.category}</td>
                    <td style={styles.td}>{formatDate(donation.date)}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(donation.status),
                        }}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          style={styles.actionBtn}
                          onClick={() => navigate(`/schoolemy/donation/${donation._id}`)}
                        >
                          View
                        </button>
                        <button
                          style={{ ...styles.actionBtn, backgroundColor: "#17a2b8" }}
                          onClick={() => downloadDonationBill(donation)}
                        >
                          📄 Download
                        </button>
                        {donation.status !== "Verified" && (
                          <button
                            style={{ ...styles.actionBtn, backgroundColor: "#10b981" }}
                            onClick={() => handleVerifyDonation(donation._id)}
                          >
                            Verify
                          </button>
                        )}
                        <button
                          style={styles.editBtn}
                          onClick={() => navigate(`/schoolemy/donation/edit/${donation._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteDonation(donation._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {donationPagination && (
            <div style={styles.pagination}>
              <button
                style={styles.pageBtn}
                disabled={donationPage === 1}
                onClick={() => setDonationPage(donationPage - 1)}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {donationPage} of {donationPagination.pages}
              </span>
              <button
                style={styles.pageBtn}
                disabled={donationPage === donationPagination.pages}
                onClick={() => setDonationPage(donationPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div style={styles.contentContainer}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Invoice No</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id} style={styles.tr}>
                    <td style={styles.td}>{expense.invoiceNumber}</td>
                    <td style={styles.td}>{expense.title}</td>
                    <td style={styles.td}>{formatCurrency(expense.amount)}</td>
                    <td style={styles.td}>{expense.category}</td>
                    <td style={styles.td}>{expense.vendorName || "N/A"}</td>
                    <td style={styles.td}>{formatDate(expense.date)}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(expense.status),
                        }}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          style={styles.actionBtn}
                          onClick={() => navigate(`/schoolemy/expense/${expense._id}`)}
                        >
                          View
                        </button>
                        <button
                          style={{ ...styles.actionBtn, backgroundColor: "#17a2b8" }}
                          onClick={() => downloadExpenseBill(expense)}
                        >
                          📄 Download
                        </button>
                        {expense.status === "Pending" && (
                          <>
                            <button
                              style={{
                                ...styles.actionBtn,
                                backgroundColor: "#10b981",
                              }}
                              onClick={() => handleApproveExpense(expense._id)}
                            >
                              Approve
                            </button>
                            <button
                              style={{
                                ...styles.actionBtn,
                                backgroundColor: "#ef4444",
                              }}
                              onClick={() => handleRejectExpense(expense._id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {expense.status === "Approved" && (
                          <button
                            style={{
                              ...styles.actionBtn,
                              backgroundColor: "#3b82f6",
                            }}
                            onClick={() => handleMarkAsPaid(expense._id)}
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          style={styles.editBtn}
                          onClick={() => navigate(`/schoolemy/expense/edit/${expense._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteExpense(expense._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {expensePagination && (
            <div style={styles.pagination}>
              <button
                style={styles.pageBtn}
                disabled={expensePage === 1}
                onClick={() => setExpensePage(expensePage - 1)}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {expensePage} of {expensePagination.pages}
              </span>
              <button
                style={styles.pageBtn}
                disabled={expensePage === expensePagination.pages}
                onClick={() => setExpensePage(expensePage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "32px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e5e7eb",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1f2937",
    letterSpacing: "-0.5px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
  },
  createButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.25)",
    transform: "translateY(0)",
  },
  filterSection: {
    display: "flex",
    gap: "14px",
    marginBottom: "28px",
    flexWrap: "wrap",
    padding: "12px 20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterInput: {
    padding: "10px 14px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    minWidth: "160px",
    height: "44px",
    transition: "all 0.3s ease",
    outline: "none",
    fontWeight: "500",
  },
  filterActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  resetButton: {
    height: "44px",
    padding: "0 18px",
    background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(107, 114, 128, 0.2)",
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "28px",
    backgroundColor: "#fff",
    padding: "8px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  tab: {
    padding: "12px 24px",
    minHeight: "44px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
  },
  activeTab: {
    color: "#0ea5e9",
    backgroundColor: "#f3f4f6",
    boxShadow: "0 2px 8px rgba(14, 165, 233, 0.15)",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    color: "#6b7280",
    fontWeight: "500",
  },
  overviewContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "8px",
    letterSpacing: "-1px",
  },
  statSubtext: {
    fontSize: "13px",
    color: "#9ca3af",
    fontWeight: "500",
  },
  currencyNote: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#6b7280",
    marginLeft: "8px",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  chartCard: {
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
  },
  chartTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#1f2937",
    letterSpacing: "-0.3px",
  },
  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  categoryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
  },
  categoryName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  categoryAmount: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0ea5e9",
  },
  categoryCount: {
    fontSize: "13px",
    color: "#6b7280",
    marginLeft: "12px",
    fontWeight: "500",
  },
  recentSection: {
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#1f2937",
    letterSpacing: "-0.3px",
  },
  contentContainer: {
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
  },
  th: {
    textAlign: "left",
    padding: "16px",
    background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
    transition: "all 0.2s ease",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#4b5563",
    fontWeight: "500",
    backgroundColor: "#fff",
  },
  statusBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#fff",
    display: "inline-block",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  actionBtn: {
    padding: "8px 16px",
    backgroundColor: "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(14, 165, 233, 0.3)",
    textTransform: "capitalize",
  },
  editBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(245, 158, 11, 0.3)",
  },
  deleteBtn: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(239, 68, 68, 0.3)",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "28px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  pageBtn: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(14, 165, 233, 0.3)",
  },
  pageInfo: {
    fontSize: "15px",
    color: "#4b5563",
    fontWeight: "600",
  },
};

export default FinancialAuditingScreen;
