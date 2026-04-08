import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';

function Users() {
  // API endpoint for users data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getApiUrl = useCallback((endpoint) => {
    const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME;
    if (codespaceUrl && codespaceUrl.trim()) {
      return `https://${codespaceUrl}-8000.app.github.dev${endpoint}`;
    }
    return `http://localhost:8000${endpoint}`;
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const codespaceUrl = getApiUrl('/api/users/');
      console.log('Fetching users from:', codespaceUrl);
      
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
      
      console.log('Processed users data:', data);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users: ' + error.message);
      setLoading(false);
    }
  }, [getApiUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return (
    <div className="spinner-container">
      <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
    </div>
  );
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">👥 Users</h2>
      <div className="table-container">
        <Table striped hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge bg-primary">{user.team}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="empty-state">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default Users;
