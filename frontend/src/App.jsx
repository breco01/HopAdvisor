import { useState } from "react";
import "./App.css";

function App() {
    const [preferences, setPreferences] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setRecommendations([]);
        setLoading(true);

        try {
            const response = await fetch("/api/recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ preferences }),
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Er ging iets mis.");
            }

            const data = JSON.parse(text);
            setRecommendations(data.recommendations || []);
        } catch (err) {
            setError(err.message || "Onbekende fout.");
        } finally {
            setLoading(false);
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
                    <p className="panel-subtitle">AI-bieraanbevelingen op maat.</p>
                </header>

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

                <section className="panel-results">
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
                            Nog geen aanbevelingen. Doe eerst een zoekopdracht.
                        </p>
                    )}

                    {recommendations.length > 0 && (
                        <div className="results-list">
                            {recommendations.map((beer, index) => (
                                <article key={index} className="beer-card">
                                    <div className="beer-header">
                                        <h3 className="beer-name">{beer.name}</h3>
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
        </div>
    );
}

export default App;
