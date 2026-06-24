import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import { login } from "@/features/auth/authSlice";
import { loadTransactions } from "@/features/transactions/transactionsSlice";
import { loadCategories } from "@/features/categories/categoriesSlice";
import { loadPreferences } from "@/features/preferences/preferencesSlice";
import { findUserByEmail, createUser } from "@/utils/userStorage";
import DemoInfoModal from "@/components/DemoInfoModal";
import "./Auth.scss";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (findUserByEmail(email)) {
      setError("An account with this email already exists");
      return;
    }

    const newUser = createUser({ email, password });
    dispatch(login(email));
    dispatch(loadTransactions(newUser.transactions));
    dispatch(loadCategories(newUser.categories));
    dispatch(loadPreferences(newUser.preferences));
    navigate("/dashboard");
  };

  return (
    <div className="login">
      <div className="login__card">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="login__error">{error}</p>}
          <button type="submit">Register</button>
        </form>
        <p className="login__switch">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
      <p className="login__demo-note">
        This is a portfolio demo — data is stored only in this browser.{" "}
        <button type="button" onClick={() => setIsInfoOpen(true)}>
          Learn more
        </button>
      </p>

      {isInfoOpen && <DemoInfoModal onClose={() => setIsInfoOpen(false)} />}
    </div>
  );
}

export default Register;
