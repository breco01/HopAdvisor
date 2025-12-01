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
        setLoadingHistory(true);
        setHistory([]);

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
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Onbekende fout.");
        } finally {
            setLoadingHistory(false);
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
                        AI-bieraanbevelingen op maat, met jouw persoonlijke geschiedenis.
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
                                                <p className="beer-description">{beer.description}</p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RECHTERZIJDE: login + geschiedenis */}
                    <aside className="panel-right">
                        <section className="panel-auth">
                            <h2 className="section-title">Aanmelden</h2>
                            <div className="auth-fields">
                                <div className="auth-field">
                                    <label htmlFor="username" className="auth-label">
                                        Gebruikersnaam
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        className="auth-input"
                                        placeholder="bijv. Max"
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
                                <button
                                    type="button"
                                    className="auth-button"
                                    onClick={loadHistory}
                                    disabled={!username || !password || loadingHistory}
                                >
                                    {loadingHistory
                                        ? "Geschiedenis laden..."
                                        : "Laad mijn geschiedenis"}
                                </button>
                                <p className="auth-hint">
                                    Gebruik dezelfde gegevens als in de backend-configuratie.
                                </p>
                            </div>
                        </section>

                        <section className="history-section">
                            <h2 className="section-title">Geschiedenis</h2>

                            {!username || !password ? (
                                <p className="history-placeholder">
                                    Meld je hierboven aan om je persoonlijke zoekgeschiedenis te zien.
                                </p>
                            ) : loadingHistory ? (
                                <p className="history-placeholder">
                                    Je geschiedenis wordt geladen...
                                </p>
                            ) : history.length === 0 ? (
                                <p className="history-placeholder">
                                    Nog geen eerdere zoekopdrachten gevonden.
                                </p>
                            ) : (
                                <div className="history-list">
                                    {history.map((item) => (
                                        <div key={item.id} className="history-item">
                                            <div className="history-meta">
                                                <span className="history-date">
                                                    {item.createdAt}
                                                </span>
                                                <span className="history-count">
                                                    {item.recommendationCount} aanbevelingen
                                                </span>
                                            </div>
                                            <p className="history-text">{item.preferences}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </aside>
                </section>
            </div>
        </div>
    );
}

export default App;
