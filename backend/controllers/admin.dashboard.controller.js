// Mock database calls - Replace with actual DB queries

exports.getAdminSummary = async (req, res) => {
  try {
    // Example: const totalReports = await db.Reports.count();
    
    const summaryData = {
      totalReports: 1240,
      activeUsers: 356,
      diseasesIdentified: 45,
      consultations: 89
    };

    res.status(200).json(summaryData);
  } catch (error) {
    console.error("Admin Summary Error:", error);
    res.status(500).json({ message: "Server error fetching admin summary" });
  }
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    // Example: const trends = await db.Reports.aggregate(...)

    const analyticsData = {
      weeklyTrends: [
        { day: "Mon", reports: 40 },
        { day: "Tue", reports: 65 },
        { day: "Wed", reports: 30 },
        { day: "Thu", reports: 85 },
        { day: "Fri", reports: 50 },
        { day: "Sat", reports: 90 },
        { day: "Sun", reports: 60 }
      ],
      commonAilments: [
        { label: "Flu / Viral", percentage: 75 },
        { label: "Skin Allergy", percentage: 45 },
        { label: "Migraine", percentage: 30 },
        { label: "Food Poisoning", percentage: 20 }
      ]
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Admin Analytics Error:", error);
    res.status(500).json({ message: "Server error fetching admin analytics" });
  }
};