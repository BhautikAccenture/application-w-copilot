import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';

function Workouts() {
  // API endpoint: https://{CODESPACE_NAME}-8000.app.github.dev/api/workouts/
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getApiUrl = useCallback((endpoint) => {
    const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceUrl && codespaceUrl.trim()) {
      return `https://${codespaceUrl}-8000.app.github.dev${endpoint}`;
    }
    return `http://localhost:8000${endpoint}`;
  }, []);

  const fetchWorkouts = useCallback(async () => {
    try {
      const codespaceUrl = getApiUrl('/api/workouts/');
      console.log('Fetching workouts from:', codespaceUrl);
      
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
      
      console.log('Processed workouts data:', data);
      setWorkouts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to load workouts: ' + error.message);
      setLoading(false);
    }
  }, [getApiUrl]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  if (loading) return (
    <div className="spinner-container">
      <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
    </div>
  );
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">💪 Workouts</h2>
      <div className="table-container">
        <Table striped hover>
          <thead>
            <tr>
              <th>User Email</th>
              <th>Workout</th>
              <th className="text-center">Reps</th>
            </tr>
          </thead>
          <tbody>
            {workouts.length > 0 ? (
              workouts.map((workout, index) => (
                <tr key={workout.id || index}>
                  <td>{workout.user_email}</td>
                  <td>{workout.workout}</td>
                  <td className="text-center"><span className="badge bg-info">{workout.reps}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-state">No workouts found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default Workouts;
