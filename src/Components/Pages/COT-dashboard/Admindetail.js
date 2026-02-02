import React, { useEffect, useState } from "react";
import axios from "../../../Utils/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ViewAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/get-admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filter admins based on search and role filter
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         admin.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || admin.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Delete admin
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Admin deleted successfully");
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin");
    }
  };

  // Open modal for editing
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ ...admin });
  };

  // Close modal
  const handleClose = () => setEditingAdmin(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture upload (base64)
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      setFormData((prev) => ({
        ...prev,
        profilePictureUpload: reader.result.split(",")[1],
      }));
    reader.readAsDataURL(file);
  };

  // Handle ID proof image change
  const handleIdImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newProofs = [...formData.govtIdProofs];
      newProofs[index].documentImage = reader.result.split(",")[1];
      setFormData((prev) => ({ ...prev, govtIdProofs: newProofs }));
    };
    reader.readAsDataURL(file);
  };

  // Add new ID proof
  const handleAddIdProof = () => {
    setFormData((prev) => ({
      ...prev,
      govtIdProofs: [
        ...(prev.govtIdProofs || []),
        { idType: "", idNumber: "", documentImage: "" },
      ],
    }));
  };

  // Remove ID proof
  const handleRemoveIdProof = (index) => {
    const newProofs = formData.govtIdProofs.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, govtIdProofs: newProofs }));
  };

  // Update ID proof fields
  const handleIdProofChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProofs = [...formData.govtIdProofs];
    updatedProofs[index][name] = value;
    setFormData((prev) => ({ ...prev, govtIdProofs: updatedProofs }));
  };

  // Save updated admin
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/update/${editingAdmin._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Admin updated successfully");
      setEditingAdmin(null);
      fetchAdmins();
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Failed to update admin");
    }
  };

    // Create print content
    const createPrintContent = (admin) => {
      return `
        <div class="print-card">
          <div class="header">
            <h1>Admin Profile Details</h1>
          </div>
          <div class="profile-section">
            ${admin.profilePictureUpload ? 
                      `<img src="data:image/jpeg;base64,${admin.profilePictureUpload}" alt="${admin.name}" class="profile-image" style="width:120px;height:120px;object-fit:cover;border-radius:10px;margin-right:20px;"/>` :
                      `<div class="profile-placeholder" style="width:120px;height:120px;border-radius:10px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:48px;margin-right:20px;">${admin.name?.charAt(0)?.toUpperCase() || "A"}</div>`
                    }
            <div class="name-section">
              <h2>${admin.name}</h2>
              <span class="role">${admin.role?.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          </div>
          <div class="info-section">
            <div class="info-item">
              <strong>Email:</strong> ${admin.email}
            </div>
            <div class="info-item">
              <strong>Mobile:</strong> ${admin.mobilenumber}
            </div>
            <div class="info-item">
              <strong>Gender:</strong> ${admin.gender} • ${admin.age || "N/A"} years
            </div>
            ${admin.designationInBoard ? 
              `<div class="info-item">
                <strong>Designation:</strong> ${admin.designationInBoard}
              </div>` : ''
            }
            ${admin.permanentAddress ? 
              `<div class="info-item">
                <strong>Permanent Address:</strong> ${admin.permanentAddress}
              </div>` : ''
            }
            ${admin.tempAddress ? 
              `<div class="info-item">
                <strong>Temporary Address:</strong> ${admin.tempAddress}
              </div>` : ''
            }
          </div>
          ${admin.govtIdProofs && admin.govtIdProofs.length > 0 ? `
            <div class="id-proofs-section">
              <h3>Government ID Proofs</h3>
              <div class="id-proofs-grid">
                ${admin.govtIdProofs.map(idp => `
                  <div class="id-proof-item">
                    <strong>${idp.idType}:</strong> ${idp.idNumber}
                    ${idp.documentImage ? `
                      <img src="data:image/jpeg;base64,${idp.documentImage}" alt="${idp.idType}" class="id-image" style="max-width:200px;max-height:150px;margin-top:10px;border-radius:4px;display:block;object-fit:cover;"/>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    };

    // Wait for all images inside a document or element to load
    const waitForImages = (root, timeout = 7000) => {
      return new Promise((resolve) => {
        try {
          const imgs = root.querySelectorAll ? root.querySelectorAll('img') : root.getElementsByTagName('img');
          if (!imgs || imgs.length === 0) return resolve();
          let loaded = 0;
          const done = () => {
            loaded += 1;
            if (loaded >= imgs.length) resolve();
          };
          Array.from(imgs).forEach((img) => {
            // If image already loaded
            if (img.complete && img.naturalWidth !== 0) return done();
            // Otherwise listen for load/error
            img.addEventListener('load', done);
            img.addEventListener('error', done);
          });
          // Fallback timeout to avoid hanging forever
          setTimeout(() => resolve(), timeout);
        } catch (e) {
          // In case of any unexpected error, resolve to continue
          resolve();
        }
      });
    };

    // Handle downloading as PDF
    const handleDownloadPDF = async (admin) => {
      // Create a temporary container for the print content
      const container = document.createElement('div');
      container.innerHTML = createPrintContent(admin);
      // ensure container is visible to the browser layout engine
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.background = '#ffffff';
      container.style.padding = '12px';
      document.body.appendChild(container);

      try {
        // wait for images to load inside container
        await waitForImages(container);

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: container.scrollWidth,
          windowWidth: container.scrollWidth,
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;

        pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        const safeName = (admin.name || 'admin').replace(/[^a-z0-9\-_.]/gi, '_');
        pdf.save(`admin-profile-${safeName}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      } finally {
        document.body.removeChild(container);
      }
    };
  // Get role badge color
  const getRoleColor = (role) => {
    const colors = {
      superadmin: "#dc2626",
      admin: "#059669",
      boscontroller: "#7c3aed",
      bosmembers: "#db2777",
      datamaintenance: "#ea580c",
      coursecontroller: "#0891b2",
      markettingcontroller: "#ca8a04",
    };
    return colors[role] || "#6b7280";
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading admins...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Admin Management</h1>
          <p style={styles.subtitle}>Manage and monitor all administrator accounts</p>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{admins.length}</span>
            <span style={styles.statLabel}>Total Admins</span>
          </div>
           <div style={styles.actionButtons}>
             <button
               style={styles.downloadAllButton}
               onClick={() => {
                 filteredAdmins.forEach((admin, index) => {
                   setTimeout(() => handleDownloadPDF(admin), index * 1000);
                 });
               }}
             >
               <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
               Download All PDFs
             </button>
           </div>
        </div>
      </div>

      {/* Filters Section */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchBox}>
          <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={styles.roleFilter}
        >
          <option value="all">All Roles</option>
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="boscontroller">BOS Controller</option>
          <option value="bosmembers">BOS Members</option>
          <option value="datamaintenance">Data Maintenance</option>
          <option value="coursecontroller">Course Controller</option>
          <option value="markettingcontroller">Marketing Controller</option>
        </select>
      </div>

      {/* Admins Grid */}
      <div style={styles.grid}>
        {filteredAdmins.map((admin) => (
          <div key={admin._id} id={`admin-card-${admin._id}`} style={styles.card}>
            {/* Card Header */}
            <div style={styles.cardHeader}>
              <div style={styles.avatarSection}>
                {admin.profilePictureUpload ? (
                  <img
                    src={`data:image/jpeg;base64,${admin.profilePictureUpload}`}
                    alt={admin.name}
                    style={styles.avatar}
                  />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    {admin.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
                <div style={styles.nameSection}>
                  <h3 style={styles.name}>{admin.name}</h3>
                  <span 
                    style={{
                      ...styles.roleBadge,
                      backgroundColor: getRoleColor(admin.role)
                    }}
                  >
                    {admin.role?.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              </div>
              <div style={styles.menuButton}>⋯</div>
            </div>

            {/* Admin Info */}
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <svg style={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span style={styles.infoText}>{admin.email}</span>
              </div>
              <div style={styles.infoItem}>
                <svg style={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span style={styles.infoText}>{admin.mobilenumber}</span>
              </div>
              <div style={styles.infoItem}>
                <svg style={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span style={styles.infoText}>{admin.gender} • {admin.age || "N/A"} years</span>
              </div>
              {admin.designationInBoard && (
                <div style={styles.infoItem}>
                  <svg style={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span style={styles.infoText}>{admin.designationInBoard}</span>
                </div>
              )}
            </div>

            {/* ID Proofs Section */}
            {admin.govtIdProofs && admin.govtIdProofs.length > 0 && (
              <div style={styles.idProofsSection}>
                <h4 style={styles.idProofsTitle}>Government IDs</h4>
                <div style={styles.idProofsGrid}>
                  {admin.govtIdProofs.map((idp, index) => (
                    <div key={index} style={styles.idProofBadge}>
                      <span style={styles.idType}>{idp.idType}</span>
                      <span style={styles.idNumber}>{idp.idNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button
                style={styles.downloadButton}
                onClick={() => handleDownloadPDF(admin)}
              >
                <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
              <button
                style={styles.editButton}
                onClick={() => handleEdit(admin)}
              >
                <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(admin._id)}
              >
                <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAdmins.length === 0 && (
        <div style={styles.emptyState}>
          <svg style={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 style={styles.emptyTitle}>No admins found</h3>
          <p style={styles.emptyText}>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingAdmin && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Admin Profile</h2>
              <button onClick={handleClose} style={styles.closeButton}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={styles.closeIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={styles.modalContent}>
              {/* Profile Section */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Profile Information</h3>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input 
                      name="name" 
                      value={formData.name || ""} 
                      onChange={handleChange} 
                      style={styles.input} 
                      placeholder="Enter full name"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email Address</label>
                    <input 
                      name="email" 
                      type="email"
                      value={formData.email || ""} 
                      onChange={handleChange} 
                      style={styles.input} 
                      placeholder="Enter email address"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Mobile Number</label>
                    <input 
                      name="mobilenumber" 
                      value={formData.mobilenumber || ""} 
                      onChange={handleChange} 
                      style={styles.input} 
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Gender</label>
                    <select name="gender" value={formData.gender || ""} onChange={handleChange} style={styles.input}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Age</label>
                    <input 
                      name="age" 
                      type="number" 
                      value={formData.age || ""} 
                      onChange={handleChange} 
                      style={styles.input} 
                      placeholder="Enter age"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Role</label>
                    <select name="role" value={formData.role || ""} onChange={handleChange} style={styles.input}>
                      <option value="superadmin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="boscontroller">BOS Controller</option>
                      <option value="bosmembers">BOS Members</option>
                      <option value="datamaintenance">Data Maintenance</option>
                      <option value="coursecontroller">Course Controller</option>
                      <option value="markettingcontroller">Marketing Controller</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Address Information</h3>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Permanent Address</label>
                    <input 
                      name="permanentAddress" 
                      value={formData.permanentAddress || ""} 
                      onChange={handleChange} 
                      style={styles.input} 
                      placeholder="Enter permanent address"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Temporary Address</label>
                    <input 
                      name="tempAddress" 
                      value={formData.tempAddress || ""} 
                      onChange={handleChange} 
                      style={styles.input} 
                      placeholder="Enter temporary address"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Board Designation</label>
                    <input 
                      name="designationInBoard" 
                      value={formData.designationInBoard || ""} 
                      onChange={handleChange} 
                      style={styles.input} 
                      placeholder="Enter board designation"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Picture */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Profile Picture</h3>
                <div style={styles.uploadArea}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileImageChange} 
                    style={styles.fileInput} 
                    id="profile-upload"
                  />
                  <label htmlFor="profile-upload" style={styles.uploadLabel}>
                    <svg style={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Click to upload profile picture</span>
                    <span style={styles.uploadHint}>JPG, PNG up to 2MB</span>
                  </label>
                  {formData.profilePictureUpload && (
                    <img
                      src={`data:image/jpeg;base64,${formData.profilePictureUpload}`}
                      alt="Profile Preview"
                      style={styles.uploadPreview}
                    />
                  )}
                </div>
              </div>

              {/* Government ID Proofs */}
              <div style={styles.formSection}>
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>Government ID Proofs</h3>
                  <button onClick={handleAddIdProof} style={styles.addButton}>
                    <svg style={styles.addIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add ID Proof
                  </button>
                </div>
                
                {(formData.govtIdProofs || []).map((proof, index) => (
                  <div key={index} style={styles.idProofForm}>
                    <div style={styles.idProofHeader}>
                      <h4 style={styles.idProofTitle}>ID Proof #{index + 1}</h4>
                      {formData.govtIdProofs.length > 1 && (
                        <button 
                          onClick={() => handleRemoveIdProof(index)}
                          style={styles.removeButton}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>ID Type</label>
                        <select
                          name="idType"
                          value={proof.idType}
                          onChange={(e) => handleIdProofChange(index, e)}
                          style={styles.input}
                        >
                          <option value="">Select ID Type</option>
                          <option value="Aadhar">Aadhar</option>
                          <option value="PAN">PAN</option>
                          <option value="Passport">Passport</option>
                          <option value="VoterID">Voter ID</option>
                          <option value="DrivingLicense">Driving License</option>
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>ID Number</label>
                        <input
                          name="idNumber"
                          value={proof.idNumber}
                          onChange={(e) => handleIdProofChange(index, e)}
                          style={styles.input}
                          placeholder="Enter ID number"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Document Image</label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleIdImageChange(index, e)} 
                          style={styles.fileInput}
                          id={`id-upload-${index}`}
                        />
                        <label htmlFor={`id-upload-${index}`} style={styles.uploadLabel}>
                          <svg style={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          </svg>
                          <span>Upload document</span>
                        </label>
                        {proof.documentImage && (
                          <img
                            src={`data:image/jpeg;base64,${proof.documentImage}`}
                            alt="ID Preview"
                            style={styles.idPreview}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.modalActions}>
              <button onClick={handleClose} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleUpdate} style={styles.saveButton}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modern, professional styles
const styles = {
  container: {
    padding: "32px",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    color: "#6b7280",
    fontSize: "16px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    fontWeight: "500",
  },
  statsCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
     display: "flex",
     flexDirection: "column",
     gap: "16px",
  },
    headerActions: {
      background: "white",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },

    downloadAllButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px 20px",
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%",
    },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  filtersContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px",
    alignItems: "center",
  },
  searchBox: {
    position: "relative",
    flex: 1,
    maxWidth: "400px",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    color: "#9ca3af",
  },
  searchInput: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    backgroundColor: "white",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease",
  },
  roleFilter: {
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    backgroundColor: "white",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    minWidth: "160px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f3f4f6",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    objectFit: "cover",
    border: "3px solid #f3f4f6",
  },
  avatarPlaceholder: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "18px",
    fontWeight: "600",
    border: "3px solid #f3f4f6",
  },
  nameSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  name: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
  },
  roleBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "white",
    textTransform: "capitalize",
    alignSelf: "flex-start",
  },
  menuButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#9ca3af",
    cursor: "pointer",
    padding: "4px",
  },
  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  infoIcon: {
    width: "16px",
    height: "16px",
    color: "#6b7280",
    flexShrink: 0,
  },
  infoText: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  idProofsSection: {
    marginBottom: "20px",
  },
  idProofsTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "12px",
  },
  idProofsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  idProofBadge: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  idType: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
  },
  idNumber: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  downloadButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "120px",
  },
  editButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  deleteButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  buttonIcon: {
    width: "16px",
    height: "16px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#6b7280",
  },
  emptyIcon: {
    width: "64px",
    height: "64px",
    margin: "0 auto 16px",
    color: "#d1d5db",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#374151",
  },
  emptyText: {
    fontSize: "14px",
    color: "#6b7280",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "white",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "32px 32px 0",
    marginBottom: "24px",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    padding: "8px",
    cursor: "pointer",
    borderRadius: "8px",
    color: "#6b7280",
    transition: "all 0.2s ease",
  },
  closeIcon: {
    width: "24px",
    height: "24px",
  },
  modalContent: {
    flex: 1,
    overflowY: "auto",
    padding: "0 32px",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    padding: "24px 32px 32px",
    borderTop: "1px solid #f3f4f6",
  },
  cancelButton: {
    flex: 1,
    padding: "12px 24px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    backgroundColor: "white",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  saveButton: {
    flex: 1,
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#3b82f6",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  formSection: {
    marginBottom: "32px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  addIcon: {
    width: "16px",
    height: "16px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "14px",
    backgroundColor: "white",
    transition: "all 0.2s ease",
  },
  uploadArea: {
    border: "2px dashed #d1d5db",
    borderRadius: "12px",
    padding: "32px",
    textAlign: "center",
    transition: "all 0.2s ease",
    position: "relative",
  },
  fileInput: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    border: 0,
  },
  uploadLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    color: "#6b7280",
  },
  uploadIcon: {
    width: "48px",
    height: "48px",
    color: "#9ca3af",
  },
  uploadHint: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  uploadPreview: {
    marginTop: "16px",
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  idProofForm: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    backgroundColor: "#fafafa",
  },
  idProofHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  idProofTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
  },
  removeButton: {
    padding: "6px 12px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
  },
  idPreview: {
    marginTop: "12px",
    maxWidth: "150px",
    maxHeight: "150px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #e5e7eb",
  },
};

// Add CSS animation for spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export default ViewAdmins;