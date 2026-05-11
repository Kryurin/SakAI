import React, { useState, useRef } from 'react';
import '../style.css';

export default function SearchBar({ onSearch, loading }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [passengerType, setPassengerType] = useState('regular');
  const originInputRef = useRef(null);
  const destInputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (origin && destination) {
      onSearch({
        origin,
        destination,
        passengerType,
      });
    }
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="origin">From:</label>
          <input
            ref={originInputRef}
            id="origin"
            type="text"
            placeholder="Enter origin address..."
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="button"
          className="swap-button"
          onClick={handleSwap}
          disabled={loading}
          title="Swap origin and destination"
        >
          ⇄
        </button>

        <div className="form-group">
          <label htmlFor="destination">To:</label>
          <input
            ref={destInputRef}
            id="destination"
            type="text"
            placeholder="Enter destination address..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="passenger-type">Passenger Type:</label>
          <select
            id="passenger-type"
            value={passengerType}
            onChange={(e) => setPassengerType(e.target.value)}
            disabled={loading}
          >
            <option value="regular">Regular</option>
            <option value="student">Student</option>
            <option value="senior_citizen">Senior Citizen</option>
            <option value="pwd">PWD</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !origin || !destination}
        >
          {loading ? 'Searching...' : 'Find Route'}
        </button>
      </form>
    </div>
  );
}
