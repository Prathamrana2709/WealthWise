import React from 'react';
import '../styles/ConfirmationDialog.css'; // Assuming you'll create a CSS file for styling

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-dialog-overlay">
      <div className="confirmation-dialog">
        <h2>Confirm Action</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="btn-confirm" onClick={onConfirm}>Confirm</button>
          <button className="btn-cancel-con" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
