import { useEffect, useState } from "react";
import api from "../services/axios";
import ApplicationForm from "../components/ApplicationForm";
import DashboardNavbar from "../components/DashboardNavbar";

const StudentDashboard = () => {
  const [application, setApplication] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchApplication = async () => {
    try {
      // Fetch student's application
      const res = await api.get("student/applications/");
      const app = res.data[0] || null;
      setApplication(app);

      if (app) setStudentName(app.first_name);
      else {
        const userRes = await api.get("auth/user/");
        setStudentName(userRes.data.first_name);
      }
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white">
      <DashboardNavbar userType="student" userName={studentName} />
      
      <div className="max-w-7xl mx-auto p-6 pt-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Welcome back, {studentName}! 👋</h1>
          <p className="text-gray-600">Access mentorship, training, and resources to achieve your goals</p>
        </div>

        {/* Key Components Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-1">Career Guidance</h3>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100 text-center">
            <div className="text-3xl mb-2">👨‍🎓</div>
            <h3 className="font-semibold text-gray-800 mb-1">Mentor</h3>
            <span className="text-sm text-gray-500 font-medium">None</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100 text-center">
            <div className="text-3xl mb-2">💻</div>
            <h3 className="font-semibold text-gray-800 mb-1">Tech Training</h3>
            <span className="text-sm text-blue-600 font-medium">Available</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100 text-center">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold text-gray-800 mb-1">Resources</h3>
            <span className="text-sm text-purple-600 font-medium">4</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100 text-center">
            <div className="text-3xl mb-2">🌐</div>
            <h3 className="font-semibold text-gray-800 mb-1">Events</h3>
            <span className="text-sm text-orange-600 font-medium">4</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {!application ? (
              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-blue-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h2 className="text-3xl font-bold mb-3 text-gray-800">Start Your Mentorship Journey</h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    Join our comprehensive program offering career guidance, mentorship connections, 
                    technology training, and community engagement opportunities.
                  </p>
                  <ApplicationForm onSuccess={fetchApplication} />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Application Status */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Application Status</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Program:</span>
                      <span className="text-gray-800">{application.program}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-semibold text-gray-700">Applied:</span>
                      <span className="text-gray-800">{new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Available Mentorship Programs */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Mentorship Programs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: "💻", title: "Software Engineering Mentorship", description: "Connect with industry professionals" },
                      { icon: "💼", title: "Business Mentorship", description: "Learn entrepreneurship skills" },
                      { icon: "📱", title: "Technology Training", description: "Coding and digital literacy workshops" },
                      { icon: "🎓", title: "Higher Education Guidance", description: "University applications and scholarships" }
                    ].map((program, index) => (
                      <div key={index} className="border-2 border-green-200 rounded-lg p-4 hover:border-green-400 transition">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">{program.icon}</div>
                          <h3 className="font-semibold text-gray-800">{program.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{program.description}</p>
                        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium">
                          Open
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Community Events */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-orange-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>🌐</span> Community Events
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Career Consultation Session", type: "Workshop", date: "2025-01-25", time: "10:00 AM", location: "Online" },
                  { title: "Digital Skills Training", type: "Training", date: "2025-01-27", time: "2:00 PM", location: "Community Center" },
                  { title: "Scholarship Opportunities Webinar", type: "Webinar", date: "2025-01-30", time: "11:00 AM", location: "Online" },
                  { title: "Mentor-Student Meetup", type: "Meetup", date: "2025-02-02", time: "3:00 PM", location: "University Campus" }
                ].map((event, index) => (
                  <div key={index} className="border-l-4 border-orange-400 pl-4">
                    <h3 className="font-semibold text-gray-800 text-sm">{event.title}</h3>
                    <p className="text-xs text-gray-600">{event.type}</p>
                    <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Achievements */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>🏆</span> Your Achievements
              </h2>
              <div className="space-y-3">
                {[
                  { id: 1, title: "Completed Career Assessment", date: "1/15/2025", icon: "📊" },
                  { id: 2, title: "Finished Digital Skills Module", date: "1/10/2025", icon: "💻" },
                  { id: 3, title: "Connected with Mentor", date: "1/05/2025", icon: "🤝" }
                ].map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <div className="text-xl">{achievement.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{achievement.title}</p>
                      <p className="text-xs text-gray-600">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Information */}
            {application && application.mentor && (
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <span>👨‍🎓</span> Your Mentor
                </h2>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">
                    {application.mentor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{application.mentor}</p>
                  <p className="text-xs text-gray-600 mb-3">Mentorship Specialist</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                    Contact Mentor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;