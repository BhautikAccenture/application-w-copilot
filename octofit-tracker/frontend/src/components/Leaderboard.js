import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';

function Leaderboard() {
  // API endpoint: https://{CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getApiUrl = useCallback((endpoint) => {
    const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceUrl && codespaceUrl.trim()) {
      return `https://${codespaceUrl}-8000.app.github.dev${endpoint}`;
    }
    return `http://localhost:8000${endpoint}`;
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const codespaceUrl = getApiUrl('/api/leaderboard/');
      console.log('Fetching leaderboard from:', codespaceUrl);
      
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
      
      // Sort by points descending
      data.sort((a, b) => b.points - a.points);
      
      console.log('Processed leaderboard data:', data);
      setLeaderboard(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard: ' + error.message);
      setLoading(false);
    }
  }, [getApiUrl]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (loading) return (
    <div className="spinner-container">
      <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
    </div>
  );
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">🏆 Leaderboard</h2>
      <div className="table-container">
        <Table striped hover>
          <thead>
            <tr>
              <th className="text-center" style={{width: '60px'}}>Rank</th>
              <th>Team</th>
              <th className="text-center">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr key={entry.id || index} className={index === 0 ? 'table-success' : ''}>
                  <td className="text-center">
                    <strong>
                      {index === 0 && '🥇 '}
                      {index === 1 && '🥈 '}
                      {index === 2 && '🥉 '}
                      {index + 1}
                    </strong>
                  </td>
                  <td><strong>{entry.team.toUpperCase()}</strong></td>
                  <td className="text-center"><span className="badge bg-warning text-dark" style={{fontSize: '1rem'}}>{entry.points}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-state">No leaderboard data found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default Leaderboard;
