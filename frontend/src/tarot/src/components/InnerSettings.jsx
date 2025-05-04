import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const InnerSettings = ({ setBias }) => {
  const [newBias, setNewBias] = useState('the answer will include the topic');
  const [selectedBias, setSelectedBias] = useState('');

  const handleBiasChange = (event) => {
    const value = event.target.value;
    setSelectedBias(value); // Track selected radio button

    if (value === 'good') {
      setBias('the answer will give ONLY good and optimistic results');
    } else if (value === 'bad') {
      setBias('the answer will give ONLY bad and pessimistic results');
    } else if (value === 'custom') {
      setBias(''); // Reset bias when custom is selected
    } else if (value === 'neutral') {
      setBias('')
    }
  };

  const handleCustomBiasChange = (event) => {
    setNewBias(event.target.value);
  };

  const handleSubmitCustomBias = (event) => {
    event.preventDefault();
    // Submit the custom bias with the prefix only once
    setBias(`the answer will include the topic: ${newBias.replace(/^the answer will include the topic\s*/, '')}`);
  };

  return (
    <div>
      <h3>Settings</h3>
      <div>
        <h4>Set Bias</h4>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            id="good"
            name="bias"
            value="good"
            className="form-check-input"
            onChange={handleBiasChange}
            checked={selectedBias === 'good'}
          />
          <label htmlFor="good" className="form-check-label">G</label>
        </div>

        <div className="form-check form-check-inline">
          <input
            type="radio"
            id="bad"
            name="bias"
            value="bad"
            className="form-check-input"
            onChange={handleBiasChange}
            checked={selectedBias === 'bad'}
          />
          <label htmlFor="bad" className="form-check-label">B</label>
        </div>

        <div className="form-check form-check-inline">
          <input
            type="radio"
            id="neutral"
            name="bias"
            value="neutral"
            className="form-check-input"
            onChange={handleBiasChange}
            checked={selectedBias === 'neutral'}
          />
          <label htmlFor="neutral" className="form-check-label">Neutral</label>
        </div>

        <div className="form-check form-check-inline">
          <input
            type="radio"
            id="custom"
            name="bias"
            value="custom"
            className="form-check-input"
            onChange={handleBiasChange}
            checked={selectedBias === 'custom'}
          />
          <label htmlFor="custom" className="form-check-label">Custom</label>
        </div>

        {/* Only show the custom input when the "custom" option is selected */}
        {selectedBias === 'custom' && (
          <div>
            <textarea
              type="text"
              value={newBias}
              onChange={handleCustomBiasChange}
              className="form-control mt-2"
              placeholder="Type custom bias"
              rows={3}
            />
            <button
              onClick={handleSubmitCustomBias}
              className="btn btn-primary mt-2"
            >
              Submit Custom Bias
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InnerSettings;
