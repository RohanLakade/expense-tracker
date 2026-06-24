import { FiX } from "react-icons/fi";
import "./DemoInfoModal.scss";

function DemoInfoModal({ onClose }) {
  return (
    <div className="demo-info-overlay">
      <div className="demo-info">
        <button
          className="demo-info__close"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>
        <h2>About This App</h2>
        <p>
          This is a frontend portfolio project demonstrating React, Redux
          Toolkit, and related skills — there is no real backend or database
          behind it.
        </p>
        <ul>
          <li>
            All accounts and data live only in <strong>this browser</strong>,
            stored via LocalStorage.
          </li>
          <li>
            Registering on one device or browser does not carry over to another
            — each one has its own separate set of accounts, with no way to sync
            between them.
          </li>
          <li>
            Passwords are stored in plain text locally, purely to demonstrate
            the authentication pattern. This is <strong>not</strong> real
            security — please avoid reusing a real password here.
          </li>
          <li>
            Clearing your browser's site data will permanently erase everything
            stored here.
          </li>
        </ul>
        <p className="demo-info__tip">
          Tip: you can back up your data anytime from the Transactions page
          using "Export to Excel" — keep that file safe, or use it to view your
          data outside the app.
        </p>
      </div>
    </div>
  );
}

export default DemoInfoModal;
