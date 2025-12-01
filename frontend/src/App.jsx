import { useState } from "react";
import "./App.css";

function App() {
    const [preferences, setPreferences] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [authStatus, setAuthStatus] = useState("");
    const [selectedHistory, setSelectedHistory] = useState(null);

    function getAuthHeaders() {
        if (!username || !password) {
            return {};
        }
        const token = btoa(`${username}:${password}`);
        return {
            Authorization: `Basic ${token}`,
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setAuthStatus("");
        setSelectedHistory(null);
        setRecommendations([]);
        setLoading(true);

        try {
            const response = await fetch("/api/recommendations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({ preferences }),
            });

            const text = await response.text();

            if (!response.ok) {
                let message = "Er ging iets mis.";

                if (text) {
                    try {
                        const errorData = JSON.parse(text);
                        message =
                            errorData.message ||
                            errorData.error ||
                            message;
                    } catch {
                        message = text;
                    }
                }
                throw new Error(message);
            }

            if (!text) {
                setRecommendations([]);
                return;
            }

            const data = JSON.parse(text);
            setRecommendations(data.recommendations || []);
        } catch (err) {
            setError(err.message || "Onbekende fout.");
        } finally {
            setLoading(false);
        }
    }

    async function loadHistory() {
        setError("");
        setAuthStatus("");
        setLoadingHistory(true);
        setHistory([]);
        setSelectedHistory(null);

        try {
            const response = await fetch("/api/history", {
                headers: {
                    ...getAuthHeaders(),
                },
            });

            const text = await response.text();

            if (!response.ok) {
                let message = "Er ging iets mis bij het ophalen van je geschiedenis.";

                if (text) {
                    try {
                        const errorData = JSON.parse(text);
                        message =
                            errorData.message ||
                            errorData.error ||
                            message;
                    } catch {
                        message = text;
                    }
                }
                throw new Error(message);
            }

            if (!text) {
                setHistory([]);
                return;
            }

            const data = JSON.parse(text);
            const list = Array.isArray(data) ? data : [];
            setHistory(list);
            setSelectedHistory(list.length > 0 ? list[0] : null);
        } catch (err) {
            setError(err.message || "Onbekende fout.");
        } finally {
            setLoadingHistory(false);
        }
    }

    async function handleRegister() {
        setError("");
        setAuthStatus("");

        if (!username || !password) {
            setAuthStatus("Vul een gebruikersnaam en wachtwoord in.");
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const text = await response.text();

            if (!response.ok) {
                let message = "Registratie mislukt.";

                if (text) {
                    try {
                        const errorData = JSON.parse(text);
                        message =
                            errorData.message ||
                            errorData.error ||
                            message;
                    } catch {
                        message = text;
                    }
                }

                throw new Error(message);
            }

            const data = text ? JSON.parse(text) : null;

            setAuthStatus(
                data && data.username
                    ? `Account aangemaakt als "${data.username}".`
                    : "Account aangemaakt."
            );
        } catch (err) {
            setAuthStatus(err.message || "Onbekende fout tijdens registratie.");
        }
    }

    return (
        <div className="page">
            <div className="panel">
                <header className="panel-header">
                    <div className="brand">
                        <span className="brand-dot" />
                        <span className="brand-name">HopAdvisor</span>
                    </div>
                    <p className="panel-subtitle">
                        AI-bieraanbevelingen met een persoonlijk historiek.
                    </p>
                </header>

                <section className="panel-main">
                    {/* LINKERZIJDE: prompt + resultaten */}
                    <div className="panel-left">
                        <section className="panel-search">
                            <h2 className="section-title">Nieuwe aanbeveling</h2>
                            <form className="panel-form" onSubmit={handleSubmit}>
                                <label htmlFor="preferences" className="form-label">
                                    Waar heb je zin in?
                                </label>
                                <textarea
                                    id="preferences"
                                    className="form-input"
                                    placeholder="Bijvoorbeeld: fris blond bier, licht bitter."
                                    rows={3}
                                    value={preferences}
                                    onChange={(e) => setPreferences(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="form-button"
                                    disabled={loading || !preferences.trim()}
                                >
                                    {loading ? "Zoeken..." : "Vraag aanbevelingen"}
                                </button>
                            </form>
                            {error && <div className="panel-alert">{error}</div>}
                        </section>

                        <section className="panel-results">
                            <h3 className="section-subtitle">Resultaten</h3>

                            {loading && (
                                <div className="loader">
                                    <div className="loader-ring">
                                        <div className="loader-inner" />
                                    </div>
                                    <p className="panel-placeholder loader-text">
                                        Aan het zoeken naar passende bieren…
                                    </p>
                                </div>
                            )}

                            {!loading && !error && recommendations.length === 0 && (
                                <p className="panel-placeholder">
                                    Nog geen aanbevelingen. Start met een zoekopdracht hierboven.
                                </p>
                            )}

                            {recommendations.length > 0 && (
                                <div className="results-list">
                                    {recommendations.map((beer, index) => (
                                        <article key={index} className="beer-card">
                                            <div className="beer-header">
                                                <h4 className="beer-name">{beer.name}</h4>
                                                {beer.style && (
                                                    <span className="beer-style">{beer.style}</span>
                                                )}
                                            </div>
                                            {beer.description && (
                                                <p className="beer-description">
                                                    {beer.description}
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RECHTERZIJDE: account + geschiedenis (lijst + detail) */}
                    <aside className="panel-right">
                        <section className="panel-auth">
                            <h2 className="section-title">Account</h2>
                            <div className="auth-fields">
                                <div className="auth-row">
                                    <div className="auth-field">
                                        <label htmlFor="username" className="auth-label">
                                            Gebruikersnaam
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            className="auth-input"
                                            placeholder="bijv. Brent"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="auth-field">
                                        <label htmlFor="password" className="auth-label">
                                            Wachtwoord
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            className="auth-input"
                                            placeholder="wachtwoord"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="auth-buttons">
                                    <button
                                        type="button"
                                        className="auth-button"
                                        onClick={handleRegister}
                                        disabled={!username || !password}
                                    >
                                        Account aanmaken
                                    </button>
                                    <button
                                        type="button"
                                        className="auth-button auth-button-secondary"
                                        onClick={loadHistory}
                                        disabled={!username || !password || loadingHistory}
                                    >
                                        {loadingHistory
                                            ? "Laden..."
                                            : "Mijn geschiedenis"}
                                    </button>
                                </div>

                                {authStatus && (
                                    <p className="auth-status">
                                        {authStatus}
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="history-wrapper">
                            <div className="history-header-row">
                                <h2 className="section-title">Geschiedenis</h2>
                                {history.length > 0 && (
                                    <span className="history-pill">
                                        {history.length}
                                    </span>
                                )}
                            </div>

                            <div className="history-split">
                                <div className="history-list-column">
                                    {!username || !password ? (
                                        <p className="history-placeholder">
                                            Meld je aan om je zoekopdrachten te zien.
                                        </p>
                                    ) : loadingHistory ? (
                                        <p className="history-placeholder">
                                            Geschiedenis wordt geladen...
                                        </p>
                                    ) : history.length === 0 ? (
                                        <p className="history-placeholder">
                                            Nog geen eerdere zoekopdrachten.
                                        </p>
                                    ) : (
                                        <div className="history-list">
                                            {history.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    className={
                                                        "history-item" +
                                                        (selectedHistory &&
                                                        selectedHistory.id === item.id
                                                            ? " history-item--active"
                                                            : "")
                                                    }
                                                    onClick={() => setSelectedHistory(item)}
                                                >
                                                    <div className="history-meta">
                                                        <span className="history-date">
                                                            {item.createdAt}
                                                        </span>
                                                        <span className="history-count">
                                                            {item.recommendationCount}x
                                                        </span>
                                                    </div>
                                                    <p className="history-text">
                                                        {item.preferences}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="history-detail-column">
                                    {!selectedHistory ? (
                                        <p className="history-placeholder">
                                            Kies een zoekopdracht links.
                                        </p>
                                    ) : Array.isArray(selectedHistory.recommendations) &&
                                    selectedHistory.recommendations.length > 0 ? (
                                        <div className="history-detail-list">
                                            {selectedHistory.recommendations.map((beer, index) => (
                                                <article
                                                    key={index}
                                                    className="history-beer-card"
                                                >
                                                    <div className="beer-header">
                                                        <h4 className="beer-name">{beer.name}</h4>
                                                        {beer.style && (
                                                            <span className="beer-style">
                                                                {beer.style}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {beer.description && (
                                                        <p className="beer-description">
                                                            {beer.description}
                                                        </p>
                                                    )}
                                                </article>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="history-placeholder">
                                            Geen aanbevelingen opgeslagen voor deze zoekopdracht.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </aside>
                </section>
            </div>
        </div>
    );
}

export default App;
