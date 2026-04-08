import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';

function Teams() {
  // API endpoint: https://{CODESPACE_NAME}-8000.app.github.dev/api/teams/
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getApiUrl = useCallback((endpoint) => {
    const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceUrl && codespaceUrl.trim()) {
      return `https://${codespaceUrl}-8000.app.github.dev${endpoint}`;
    }
    return `http://localhost:8000${endpoint}`;
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const codespaceUrl = getApiUrl('/api/teams/');
      console.log('Fetching teams from:', codespaceUrl);
      
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
      
      console.log('Processed teams data:', data);
      setTeams(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to load teams: ' + error.message);
      setLoading(false);
    }
  }, [getApiUrl]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  if (loading) return (
    <div className="spinner-container">
      <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
    </div>
  );
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">👫 Teams</h2>
      <div className="table-container">
        <Table striped hover>
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Members ({teams.length})</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 ? (
              teams.map((team, index) => (
                <tr key={team.id || index}>
                  <td><strong>{team.name.toUpperCase()}</strong></td>
                  <td>{Array.isArray(team.members) ? team.members.join(', ') : team.members}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="empty-state">No teams found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default Teams;
