import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getApiUrl = useCallback((endpoint) => {
    const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceUrl && codespaceUrl.trim()) {
      return `https://${codespaceUrl}-8000.app.github.dev${endpoint}`;
    }
    return `http://localhost:8000${endpoint}`;
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      const codespaceUrl = getApiUrl('/api/activities/');
      console.log('Fetching activities from:', codespaceUrl);
      
      const response = await fetch(codespaceUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let data = await response.json();
      console.log('Raw API response:', data);
      
      // Handle paginated responses (API returns {results: [...]})
      if (data.results && Array.isArray(data.results)) {
        data = data.results;
      } else if (!Array.isArray(data)) {
        // If response is not an array and has no results, treat it as empty
        data = [];
      }
      
      console.log('Processed activities data:', data);
      setActivities(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Failed to load activities: ' + error.message);
      setLoading(false);
    }
  }, [getApiUrl]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (loading) return (
    <div className="spinner-container">
      <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
    </div>
  );
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">🏃 Activities</h2>
      <div className="table-container">
        <Table striped hover>
          <thead>
            <tr>
              <th>User Email</th>
              <th>Activity</th>
              <th className="text-center">Duration (mins)</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <tr key={activity.id || index}>
                  <td>{activity.user_email}</td>
                  <td>{activity.activity}</td>
                  <td className="text-center"><span className="badge bg-success">{activity.duration}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-state">No activities found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default Activities;
