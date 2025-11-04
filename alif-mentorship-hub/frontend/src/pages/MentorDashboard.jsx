import { useEffect, useState } from "react";
import api from "../services/axios";
import DashboardNavbar from "../components/DashboardNavbar";

const MentorDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // to show status update in progress

  const fetchApplications = async () => {
    try {
      const res = await api.get("student/applications/");
      setApplications(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (appId, status, consultationDate = null) => {
    try {
      setUpdatingId(appId);
      await api.post(`student/applications/${appId}/update_status/`, {
        status,
        consultation_date: consultationDate,
      });
      alert(`Application ${status} successfully!`);
      fetchApplications();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="p-4">Loading applications...</p>;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white">
      <DashboardNavbar userType="mentor" userName="Mentor" />
      
      <div className="max-w-5xl mx-auto p-4 pt-24">
        <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>

      {applications.length === 0 ? (
        <p>No student applications assigned yet.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li
              key={app.id}
              className="border p-4 mb-4 rounded shadow bg-white"
            >
              <p>
                <strong>Name:</strong> {app.first_name} {app.last_name}
              </p>
              <p>
                <strong>Course:</strong> {app.course}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              <p>
                <strong>Feedback:</strong> {app.feedback || "No feedback yet"}
              </p>
              <p>
                <strong>Consultation Date:</strong>{" "}
                {app.consultation_date || "Not scheduled"}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  disabled={updatingId === app.id}
                  onClick={() =>
                    handleUpdateStatus(
                      app.id,
                      "Approved",
                      new Date().toISOString()
                    )
                  }
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve & Schedule
                </button>
                <button
                  disabled={updatingId === app.id}
                  onClick={() => handleUpdateStatus(app.id, "Rejected")}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
};

export default MentorDashboard;
