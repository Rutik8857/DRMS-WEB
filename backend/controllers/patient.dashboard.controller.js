// const db = require("../db");
// const axios = require("axios");
// const redisClient = require("../config/redis");
// const { fetchHealthSummary, fetchAnalytics } = require("../services/analytics.service");

// // utility: return null if invalid date string
// function safeParseDate(str) {
//   if (!str) return null;
//   const d = new Date(str);
//   return isNaN(d.getTime()) ? null : d;
// }

// // GET /patient/dashboard/summary
// exports.getPatientSummary = async (req, res) => {
//   try {
//     const { country, state, disease, from, to } = req.query;

//     // ignore unsupported geo/diagnosis filters for DB-based summary
//     if (state || disease) {
//       console.warn('Ignoring unsupported filters for summary', { state, disease });
//     }

//     // validate dates
//     if (from && !safeParseDate(from)) {
//       return res.status(400).json({ message: 'from must be a valid date' });
//     }
//     if (to && !safeParseDate(to)) {
//       return res.status(400).json({ message: 'to must be a valid date' });
//     }

//     // if country provided we return live external data
//     if (country) {
//       if (country.length < 3) {
//         return res.status(400).json({ message: 'country must be at least 3 characters' });
//       }

//       const key = `live-summary:${country.toLowerCase()}`;

//       if (redisClient?.get) {
//         try {
//           const cached = await redisClient.get(key);
//           if (cached) {
//             return res.status(200).json(JSON.parse(cached));
//           }
//         } catch (e) {
//           console.warn('Redis GET failed', e.message);
//         }
//       }

//       let data;
//       try {
//         const resp = await axios.get(
//           `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`,
//           { timeout: 10000 }
//         );
//         data = resp.data || {};
//       } catch (e) {
//         console.error('Live summary fetch error', e.message);
//         if (e.response) {
//           return res.status(502).json({
//             message: 'External summary service error',
//             details: e.response.data || e.message
//           });
//         }
//         return res.status(500).json({ message: 'Live data service unavailable', details: e.message });
//       }

//       const formatted = {
//         totalReports: data.cases ?? 0,
//         activeUsers: data.active ?? 0,
//         diseasesIdentified: data.todayCases ?? 0,
//         consultations: data.recovered ?? 0
//       };

//       if (redisClient?.setEx) {
//         try {
//           await redisClient.setEx(key, 600, JSON.stringify(formatted));
//         } catch (e) {
//           console.warn('Redis SETEX failed', e.message);
//         }
//       }

//       return res.status(200).json(formatted);
//     }

//     // otherwise fall back to database summary
//     // const userId = req.user?.id || req.user?.userId;
//     // if (!userId) {
//     //   return res.status(401).json({ message: 'Invalid user token' });
//     // }
//     return res.status(400).json({
//   message: "country query parameter required for live summary"
// });

//     if (!db) {
//       console.error('Database connection not available');
//       return res.status(500).json({ message: 'Database connection not available' });
//     }

//     const conditions = ['user_id = ?'];
//     const params = [userId];

//     if (from && to) {
//       conditions.push('created_at BETWEEN ? AND ?');
//       params.push(from, to);
//     } else if (from) {
//       conditions.push('created_at >= ?');
//       params.push(from);
//     } else if (to) {
//       conditions.push('created_at <= ?');
//       params.push(to);
//     }

//     const sql = `SELECT COUNT(*) as count FROM health_reports WHERE ${conditions.join(' AND ')}`;
//     let reports = [{ count: 0 }];
//     try {
//       const [r] = await db.query(sql, params);
//       reports = r;
//     } catch (err) {
//       console.error('DB reports query failed', err.message);
//       return res.status(500).json({ message: 'Database query error', details: err.sqlMessage || err.message });
//     }

//     const total = reports?.[0]?.count ?? 0;
//     return res.status(200).json({
//       totalReports: total,
//       activeUsers: 1,
//       diseasesIdentified: 0,
//       consultations: 0
//     });
//   } catch (err) {
//     console.error('Patient Summary Error:', err);
//     return res.status(500).json({ message: err.message || 'Server error fetching summary' });
//   }
// };

// // GET /patient/dashboard/analytics
// exports.getPatientAnalytics = async (req, res) => {
//   try {
//     const { country, state, disease, from, to } = req.query;

//     if (!country) {
//       return res.status(400).json({ message: 'country query parameter is required' });
//     }

//     if (from && !safeParseDate(from)) {
//       return res.status(400).json({ message: 'from must be a valid date' });
//     }
//     if (to && !safeParseDate(to)) {
//       return res.status(400).json({ message: 'to must be a valid date' });
//     }

//     const key = `analytics:${country}:${state || ''}:${disease || ''}:${from || ''}:${to || ''}`;

//     if (redisClient?.get) {
//       try {
//         const cached = await redisClient.get(key);
//         if (cached) {
//           return res.status(200).json(JSON.parse(cached));
//         }
//       } catch (e) {
//         console.warn('Redis GET failed', e.message);
//       }
//     }

//     let analytics;
//     try {
//       analytics = await fetchAnalytics({ country, state, disease, from, to });
//     } catch (err) {
//       console.error('getPatientAnalytics fetchAnalytics error', err.message);
//       if (err.response) {
//         return res.status(502).json({
//           message: 'External analytics service error',
//           details: err.response.data || err.message
//         });
//       }
//       return res.status(500).json({ message: 'Analytics computation failed', details: err.message });
//     }

//     if (redisClient?.setEx) {
//       try {
//         await redisClient.setEx(key, 600, JSON.stringify(analytics));
//       } catch (e) {
//         console.warn('Redis SETEX failed', e.message);
//       }
//     }

//     return res.status(200).json(analytics);
//   } catch (err) {
//     console.error('Patient Analytics Error:', err);
//     return res.status(500).json({ message: err.message || 'Server error fetching analytics' });
//   }
// };










const axios = require("axios");
const redisClient = require("../config/redis");

// Utility: safe date validation
function safeParseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/* ===================================================
   GET /patient/dashboard/summary
   Live country summary (Public)
=================================================== */
exports.getPatientSummary = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country || country.length < 3) {
      return res.status(400).json({ message: "Valid country required" });
    }

    const cacheKey = `live-summary:${country.toLowerCase()}`;

    // Check Redis cache
    if (redisClient?.get) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
    }

    // Fetch live data from disease.sh
    const response = await axios.get(
      `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`,
      { timeout: 10000 }
    );

    const data = response.data || {};

    const formatted = {
      totalReports: data.cases ?? 0,
      activeUsers: data.active ?? 0,
      diseasesIdentified: data.todayCases ?? 0,
      consultations: data.recovered ?? 0
    };

    // Store in Redis (10 minutes)
    if (redisClient?.setEx) {
      await redisClient.setEx(cacheKey, 600, JSON.stringify(formatted));
    }

    return res.status(200).json(formatted);

  } catch (error) {
    console.error("Live Summary Error:", error.message);
    return res.status(500).json({
      message: "Live data service unavailable"
    });
  }
};


/* ===================================================
   GET /patient/dashboard/analytics
   Live historical data (Public)
=================================================== */
exports.getPatientAnalytics = async (req, res) => {
  try {
    const { country, from, to } = req.query;

    if (!country || country.length < 3) {
      return res.status(400).json({ message: "Valid country required" });
    }

    if (from && !safeParseDate(from)) {
      return res.status(400).json({ message: "Invalid from date" });
    }

    if (to && !safeParseDate(to)) {
      return res.status(400).json({ message: "Invalid to date" });
    }

    const cacheKey = `analytics:${country}:${from || ""}:${to || ""}`;

    // Check cache
    if (redisClient?.get) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
    }

    // Fetch historical timeline
    const response = await axios.get(
      `https://disease.sh/v3/covid-19/historical/${encodeURIComponent(country)}?lastdays=30`
    );

    const timeline = response.data?.timeline?.cases || {};

    // Convert to chart format
    const weeklyTrends = Object.entries(timeline)
      .slice(-7)
      .map(([date, value]) => ({
        day: date,
        reports: value
      }));

    const analytics = {
      weeklyTrends,
      commonAilments: [
        { label: "COVID-19", percentage: 100 }
      ]
    };

    // Cache for 10 minutes
    if (redisClient?.setEx) {
      await redisClient.setEx(cacheKey, 600, JSON.stringify(analytics));
    }

    return res.status(200).json(analytics);

  } catch (error) {
    console.error("Analytics Error:", error.message);
    return res.status(500).json({
      message: "Analytics service unavailable"
    });
  }
};