const axios = require('axios');

async function fetchHealthSummary(country) {
  if (!country || country.length < 3) {
    throw new Error('country must be at least 3 characters');
  }

  const url = `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`;
  
  try {
    const resp = await axios.get(url, { timeout: 10000 });
    
    if (!resp.data) {
      throw new Error('Empty response from API');
    }

    const data = resp.data;
    const confirmed = data.cases || 0;
    const deaths = data.deaths || 0;
    const recovered = data.recovered || 0;

    const activeUsers = Math.ceil((confirmed + deaths + recovered) / 1000000);
    const diseasesIdentified = confirmed > 0 ? 1 : 0;

    return {
      totalReports: confirmed,
      activeUsers: Math.max(1, activeUsers),
      diseasesIdentified: diseasesIdentified,
      consultations: Math.ceil(deaths * 0.5)
    };
  } catch (err) {
    console.error('Health summary API error:', err.message);
    throw err;
  }
}

async function fetchAnalytics({ country, state, disease, from, to }) {
  if (!country || country.length < 3) {
    throw new Error('country must be at least 3 characters');
  }

  let url;
  if (state) {
    url = `https://disease.sh/v3/covid-19/historical/${encodeURIComponent(country)}/${encodeURIComponent(state)}?lastdays=all`;
  } else {
    url = `https://disease.sh/v3/covid-19/historical/${encodeURIComponent(country)}?lastdays=all`;
  }

  try {
    const resp = await axios.get(url, { timeout: 10000 });

    if (!resp.data) {
      throw new Error('Empty response from API');
    }

    const timeline = resp.data.timeline || resp.data;
    const casesObj = timeline.cases || {};

    if (!casesObj || typeof casesObj !== 'object' || Object.keys(casesObj).length === 0) {
      return {
        weeklyTrends: [],
        commonAilments: [{ label: disease || 'COVID-19', percentage: 0 }]
      };
    }

    const allDates = Object.keys(casesObj)
      .filter(d => typeof d === 'string' && d.includes('/'))
      .map(d => {
        const parts = d.split('/');
        if (parts.length !== 3) return null;
        const month = parts[0]?.padStart(2, '0');
        const day = parts[1]?.padStart(2, '0');
        const year = `20${parts[2]}`;
        if (!month || !day) return null;
        return `${year}-${month}-${day}`;
      })
      .filter(d => d !== null && !isNaN(new Date(d).getTime()))
      .sort();

    if (allDates.length === 0) {
      return {
        weeklyTrends: [],
        commonAilments: [{ label: disease || 'COVID-19', percentage: 0 }]
      };
    }

    const filteredDates = allDates.filter(dateStr => {
      if (from && dateStr < from) return false;
      if (to && dateStr > to) return false;
      return true;
    });

    let targetDates = filteredDates.length > 0 ? filteredDates : allDates;
    if (!from && !to && targetDates.length > 7) {
      targetDates = targetDates.slice(-7);
    }

    const weeklyTrends = [];
    for (let i = 0; i < targetDates.length; i++) {
      const current = targetDates[i];
      const previous = targetDates[i - 1];
      const currentVal = casesObj[convertToMDY(current)] || 0;
      const prevVal = previous ? casesObj[convertToMDY(previous)] || 0 : 0;
      const diff = Math.max(0, currentVal - prevVal);
      const dayName = new Date(current).toLocaleDateString('en-US', { weekday: 'short' });
      weeklyTrends.push({ day: dayName, reports: diff });
    }

    const commonAilments = [{ label: disease || 'COVID-19', percentage: 100 }];

    return { weeklyTrends, commonAilments };
  } catch (err) {
    console.error('Analytics API error:', err.message);
    throw err;
  }
}

function convertToMDY(isoDate) {
  try {
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) {
      throw new Error('Invalid date format');
    }
    return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year.slice(2)}`;
  } catch (e) {
    console.error('Date conversion error for:', isoDate, e.message);
    return null;
  }
}

module.exports = { fetchHealthSummary, fetchAnalytics };
