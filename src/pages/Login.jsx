import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import { login } from "@/features/auth/authSlice";
import { loadTransactions } from "@/features/transactions/transactionsSlice";
import { loadCategories } from "@/features/categories/categoriesSlice";
import { loadPreferences } from "@/features/preferences/preferencesSlice";
import { findUserByEmail } from "@/utils/userStorage";
import "./Auth.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      setError("Invalid email or password");
      return;
    }

    dispatch(login(email));
    dispatch(loadTransactions(user.transactions));
    dispatch(loadCategories(user.categories));
    dispatch(loadPreferences(user.preferences));
    navigate("/dashboard");
  };

  return (
    <div className="login">
      <div className="login__card">
        <h1>Login</h1>
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
          <button type="submit">Login</button>
        </form>
        <p className="login__switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
