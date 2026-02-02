import React, { useState, useEffect } from "react";
import axios from "../../../Utils/api";

const DecisionsList = () => {
  const [decisions, setDecisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      const response = await axios.get("/decision-get");
      setDecisions(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch decisions");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading decisions...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="decisions-container">
      <style>{`
        .decisions-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 20px;
        }

        .decisions-header {
          text-align: center;
          margin-bottom: 2.5rem;
          position: relative;
          padding-bottom: 1rem;
        }

        .decisions-title {
          color: #2c3e50;
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }

        .title-underline {
          height: 4px;
          width: 80px;
          background: linear-gradient(90deg, #3498db, #f1c40f, #e91e63);
          margin: 10px auto 0;
          border-radius: 2px;
        }

        .decisions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          padding: 20px 0;
        }

        .decision-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #eee;
        }

        .decision-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
        }

        .decision-id {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 10px;
          padding: 4px 8px;
          background: #f8f9fa;
          border-radius: 4px;
          display: inline-block;
        }

        .decision-title {
          font-size: 1.25rem;
          color: #2c3e50;
          margin: 10px 0;
          font-weight: 600;
        }

        .decision-details {
          color: #666;
          margin: 10px 0;
          line-height: 1.5;
        }

        .decision-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          font-size: 0.9rem;
          color: #666;
        }

        .decision-status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .status-approved {
          background-color: #d4edda;
          color: #155724;
        }

        .status-rejected {
          background-color: #f8d7da;
          color: #721c24;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: #666;
        }

        .error-message {
          text-align: center;
          padding: 40px;
          color: #721c24;
          background-color: #f8d7da;
          border-radius: 8px;
        }

        .no-decisions {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 1.1rem;
        }
      `}</style>

      <div className="decisions-header">
        <h2 className="decisions-title">Recent Decisions</h2>
        <div className="title-underline"></div>
      </div>

      {decisions.length === 0 ? (
        <div className="no-decisions">No decisions found</div>
      ) : (
        <div className="decisions-grid">
          {decisions.map((decision) => (
            <div key={decision.decision_id} className="decision-card">
              <div className="decision-id">{decision.decision_id}</div>
              <h3 className="decision-title">{decision.decisionTitle}</h3>
              <p className="decision-details">{decision.decisionDetails}</p>
              <div className="decision-meta">
                <span>Created by: {decision.createdBy}</span>
                <span className={`decision-status status-${decision.status}`}>
                  {decision.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DecisionsList;
