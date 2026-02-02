import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import icon from "../../../assets/icon.png";

const ParticipantCertificate = () => {
  const [formData, setFormData] = useState({
    participantName: "Priya Sharma",
    participantId: "PART2023001",
    eventId: "EVT101",
    eventName: "Siddha Healing Workshop",
    eventDate: "2023-06-15",
    organizerName: "schoolemy Academy",
    directorName: "Abubakar Siddhik",
  });

  const events = [
    { id: "SID101", name: "Siddha Healing Workshop" },
    { id: "AYUR101", name: "Ayurvedic Wellness Seminar" },
    { id: "YOGA101", name: "Yoga Therapy Conference" },
    { id: "VARMA101", name: "Varma Kalai Demonstration" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEventChange = (e) => {
    const selectedEvent = events.find((event) => event.id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      eventId: e.target.value,
      eventName: selectedEvent ? selectedEvent.name : "",
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Styles
  const styles = {
    app: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Times New Roman', serif",
      background: "#f8f9fa",
    },
    formContainer: {
      flex: 1,
      minWidth: "300px",
      background: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      border: "2px solid #4cc9f0",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#4361ee",
    },
    input: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      boxSizing: "border-box",
      backgroundColor: "#f8f9fa",
    },
    certificateContainer: {
      flex: 2,
      minWidth: "500px",
    },
    certificate: {
      position: "relative",
      background: "white",
      padding: "40px",
      border: "15px double",
      borderImage:
        "linear-gradient(45deg, #4361ee, #4cc9f0, #f72585, #ffd166) 1",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
      marginBottom: "20px",
      textAlign: "center",
      backgroundImage:
        "linear-gradient(to bottom, rgba(255,209,102,0.1), rgba(76,201,240,0.1))",
    },
    topLeftIcon: {
      position: "absolute",
      top: "20px",
      left: "20px",
      width: "60px",
      height: "60px",
      objectFit: "contain",
      zIndex: 1,
      background: "white",
      borderRadius: "50%",
      padding: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      border: "2px solid #e5e7eb",
    },
    header: {
      marginBottom: "30px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    logo: {
      width: "120px",
      height: "auto",
      marginBottom: "20px",
      objectFit: "contain",
    },
    headerH1: {
      background: "linear-gradient(90deg, #4361ee, #f72585)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "32px",
      marginBottom: "10px",
      borderBottom: "2px solid #ffd166",
      paddingBottom: "10px",
    },
    intro: {
      fontSize: "18px",
      marginBottom: "10px",
      color: "#4361ee",
    },
    participantName: {
      background: "linear-gradient(90deg, #f72585, #4cc9f0)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "36px",
      margin: "20px 0",
      textDecoration: "underline wavy #ffd166",
    },
    details: {
      fontSize: "16px",
      margin: "10px 0",
      color: "#4361ee",
    },
    eventName: {
      color: "#f72585",
      fontSize: "26px",
      margin: "20px 0",
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    },
    eventDate: {
      fontSize: "16px",
      margin: "20px 0",
      fontStyle: "italic",
      color: "#4cc9f0",
      fontWeight: "bold",
    },
    signatures: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: "50px",
      background:
        "linear-gradient(90deg, rgba(255,209,102,0.2), rgba(76,201,240,0.2))",
      padding: "30px 20px",
      borderRadius: "8px",
      gap: "40px",
    },
    signature: {
      textAlign: "center",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "250px",
    },
    signatureContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    signatureLine: {
      width: "200px",
      height: "2px",
      background: "linear-gradient(90deg, #4361ee, #f72585)",
      margin: "0 auto 12px",
      position: "relative",
      display: "block",
    },
    signatureName: {
      fontSize: "1.8rem",
      fontFamily: "'Brush Script MT', 'Lucida Handwriting', 'Dancing Script', cursive",
      color: "#1a202c",
      fontWeight: "normal",
      marginBottom: "10px",
      transform: "rotate(-1.5deg)",
      letterSpacing: "2px",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.15)",
      position: "relative",
      display: "block",
      padding: "5px 10px",
      fontStyle: "italic",
      textAlign: "center",
      margin: "0 auto 10px",
      width: "fit-content",
    },
    signatureTitle: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#4361ee",
      marginTop: "10px",
      letterSpacing: "0.5px",
    },
    signatureUnderline: {
      width: "180px",
      height: "2px",
      background: "#f72585",
      margin: "8px auto 0",
      display: "block",
    },
    seal: {
      width: "180px",
      height: "180px",
      margin: "0 auto 15px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    sealCircle: {
      width: "180px",
      height: "180px",
      borderRadius: "50%",
      position: "relative",
      background: "white",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    sealRing1: {
      position: "absolute",
      width: "180px",
      height: "180px",
      borderRadius: "50%",
      border: "2px solid #4361ee",
      top: "0",
      left: "0",
    },
    sealRing2: {
      position: "absolute",
      width: "165px",
      height: "165px",
      borderRadius: "50%",
      background: "white",
      border: "3px solid white",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    sealRing3: {
      position: "absolute",
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      background: "white",
      border: "2px solid #4361ee",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    sealRing4: {
      position: "absolute",
      width: "135px",
      height: "135px",
      borderRadius: "50%",
      border: "2px solid #f72585",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    sealRing5: {
      position: "absolute",
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      background: "white",
      border: "3px solid white",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    sealCenter: {
      position: "absolute",
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background: "white",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
      padding: "8px",
      boxSizing: "border-box",
    },
    sealContent: {
      textAlign: "center",
      width: "100%",
    },
    sealIcon: {
      width: "35px",
      height: "35px",
      objectFit: "contain",
      marginBottom: "4px",
    },
    sealSchooolemy: {
      fontSize: "0.6rem",
      fontWeight: "600",
      color: "#4361ee",
      marginBottom: "1px",
      lineHeight: "1.1",
      letterSpacing: "0.5px",
    },
    sealAcademy: {
      fontSize: "0.6rem",
      fontWeight: "600",
      color: "#4361ee",
      marginBottom: "2px",
      lineHeight: "1.1",
      letterSpacing: "0.5px",
    },
    sealOfficial: {
      fontSize: "0.5rem",
      fontWeight: "bold",
      color: "#f72585",
      lineHeight: "1.1",
      letterSpacing: "0.3px",
    },
    sealDot: {
      position: "absolute",
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      background: "#4361ee",
    },
    sealDotPink: {
      position: "absolute",
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      background: "#f72585",
    },
    footer: {
      marginTop: "40px",
      fontSize: "14px",
      color: "#4361ee",
      borderTop: "1px dashed #ffd166",
      paddingTop: "10px",
    },
    printButton: {
      display: "block",
      width: "100%",
      padding: "12px",
      background: "linear-gradient(90deg, #4361ee, #4cc9f0)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "10px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(90deg, #f72585, #ffd166)",
      },
    },
    "@media print": {
      formContainer: {
        display: "none",
      },
      printButton: {
        display: "none",
      },
      certificate: {
        border: "none",
        boxShadow: "none",
        padding: "0",
        margin: "0",
        width: "100%",
        height: "100%",
        backgroundImage: "none",
      },
    },
  };

  return (
    <div style={styles.app}>
      <div style={styles.formContainer}>
        <h2>Certificate Generator</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Participant Name:</label>
          <input
            type="text"
            name="participantName"
            value={formData.participantName}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Participant ID:</label>
          <input
            type="text"
            name="participantId"
            value={formData.participantId}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Event:</label>
          <select
            name="eventId"
            value={formData.eventId}
            onChange={handleEventChange}
            style={styles.input}
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} ({event.id})
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Event Date:</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Organizer Name:</label>
          <input
            type="text"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Director Name:</label>
          <input
            type="text"
            name="directorName"
            value={formData.directorName}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.certificateContainer}>
        <div style={styles.certificate}>
          <img src={icon} alt="Schoolemy Icon" style={styles.topLeftIcon} />
          <div style={styles.header}>
            <img src={logo} alt="Schoolemy Logo" style={styles.logo} />
            <h1 style={styles.headerH1}>Certificate of Participation</h1>
          </div>
          <div>
            <p style={styles.intro}>This is to certify that</p>
            <h2 style={styles.participantName}>{formData.participantName}</h2>
            <p style={styles.details}>
              (Participant ID: {formData.participantId}) has successfully
              participated in
            </p>
            <h3 style={styles.eventName}>{formData.eventName}</h3>
            <p style={styles.details}>(Event ID: {formData.eventId})</p>
            <p style={styles.eventDate}>
              Held on{" "}
              {new Date(formData.eventDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div style={styles.signatures}>
              <div style={styles.signature}>
                <div style={styles.signatureContainer}>
                  <div style={styles.signatureLine}></div>
                  <div style={styles.signatureName}>{formData.directorName}</div>
                  <div style={styles.signatureUnderline}></div>
                  <p style={styles.signatureTitle}>Director</p>
                </div>
              </div>
              <div style={styles.signature}>
                <div style={styles.seal}>
                  <div style={styles.sealCircle}>
                    {/* Outer blue ring */}
                    <div style={styles.sealRing1}></div>
                    
                    {/* White ring */}
                    <div style={styles.sealRing2}></div>
                    
                    {/* Blue dots ring */}
                    {[...Array(24)].map((_, i) => {
                      const angle = (i * 15) * (Math.PI / 180);
                      const radius = 75;
                      const x = 90 + radius * Math.cos(angle) - 2;
                      const y = 90 + radius * Math.sin(angle) - 2;
                      return (
                        <div
                          key={`blue-${i}`}
                          style={{
                            ...styles.sealDot,
                            left: `${x}px`,
                            top: `${y}px`,
                          }}
                        />
                      );
                    })}
                    
                    {/* Blue border ring */}
                    <div style={styles.sealRing3}></div>
                    
                    {/* Pink border ring */}
                    <div style={styles.sealRing4}></div>
                    
                    {/* White ring */}
                    <div style={styles.sealRing5}></div>
                    
                    {/* Pink dots ring */}
                    {[...Array(20)].map((_, i) => {
                      const angle = (i * 18) * (Math.PI / 180);
                      const radius = 60;
                      const x = 90 + radius * Math.cos(angle) - 2;
                      const y = 90 + radius * Math.sin(angle) - 2;
                      return (
                        <div
                          key={`pink-${i}`}
                          style={{
                            ...styles.sealDotPink,
                            left: `${x}px`,
                            top: `${y}px`,
                          }}
                        />
                      );
                    })}
                    
                    {/* Center white circle with content */}
                    <div style={styles.sealCenter}>
                      <div style={styles.sealContent}>
                        <img src={icon} alt="Seal Icon" style={styles.sealIcon} />
                        <div style={styles.sealSchooolemy}>SCHOOLEMY</div>
                        <div style={styles.sealAcademy}>ACADEMY</div>
                        <div style={styles.sealOfficial}>OFFICIAL SEAL</div>
                      </div>
                    </div>
                  </div>
                </div>
                <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#4361ee', fontSize: '1rem', marginBottom: '4px' }}>Institute Seal</p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>{formData.organizerName}</p>
              </div>
            </div>
          </div>
          <div style={styles.footer}>
            <p>
              Certificate ID: {formData.participantId}-{formData.eventId}-
              {formData.eventDate.replace(/-/g, "")}
            </p>
          </div>
        </div>
        <button onClick={handlePrint} style={styles.printButton}>
          Print Certificate
        </button>
      </div>
    </div>
  );
};

export default ParticipantCertificate;
