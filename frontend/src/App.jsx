import {useState} from 'react'
import './App.css'

function App() {
    const [preferences, setPreferences] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event){
        event.preventDefault();
        setError("");
        setRecommendations([]);
        setLoading(true);

        try {
            const response = await fetch("/api/recommendations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ preferences }),
            });

            const text = await response.text();
            console.log("RAW response:", response.status, text);

            if (!response.ok) {
                let message = "Er ging iets mis bij het ophalen van aanbevelingen.";

                try {
                    const errorData = JSON.parse(text);
                    message = errorData.error || errorData.message || message;
                } catch {
                    if (text) {
                        message = text;
                    }
                }

                throw new Error(message);
            }

            if (!text) {
                setError("Server gaf een lege respons terug.");
                return;
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                setError("Server gaf geen geldige JSON terug: " + text);
                return;
            }

            setRecommendations(data.recommendations || []);
        } catch (err) {
            console.error(err);
            setError(err.message || "Onbekende fout.");
        } finally {
            setLoading(false);
        }
    }



    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                background: "#0f172a",
                color: "#e5e7eb",
                padding: "1.5rem",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    background: "#020617",
                    borderRadius: "1rem",
                    padding: "1.75rem",
                    boxShadow: "0 20px 45px rgba(0,0,0,0.45)",
                    border: "1px solid #1f2937",
                }}
            >
                <h1 style={{ fontSize: "1.9rem", marginBottom: "0.25rem" }}>HopAdvisor</h1>
                <p style={{ marginBottom: "1.5rem", color: "#9ca3af" }}>
                    Vertel waar je zin in hebt, en krijg AI-gebaseerde bieraanbevelingen.
                </p>

                <form onSubmit={handleSubmit} style={{ marginBottom: "1.25rem" }}>
                    <label
                        htmlFor="preferences"
                        style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}
                    >
                        Waar heb je zin in?
                    </label>
                    <textarea
                        id="preferences"
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        placeholder="Bijvoorbeeld: iets fruitig en hoppig, niet te bitter, ideaal voor op een zomeravond."
                        rows={3}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "0.75rem",
                            border: "1px solid #4b5563",
                            background: "#020617",
                            color: "#e5e7eb",
                            resize: "vertical",
                            marginBottom: "0.75rem",
                            fontFamily: "inherit",
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !preferences.trim()}
                        style={{
                            padding: "0.6rem 1.1rem",
                            borderRadius: "999px",
                            border: "none",
                            fontWeight: 500,
                            cursor: loading || !preferences.trim() ? "not-allowed" : "pointer",
                            opacity: loading || !preferences.trim() ? 0.6 : 1,
                            background:
                                "linear-gradient(135deg, #22c55e, #16a34a)",
                            color: "#020617",
                        }}
                    >
                        {loading ? "Aan het zoeken..." : "Vraag aanbevelingen"}
                    </button>
                </form>

                {error && (
                    <div
                        style={{
                            marginBottom: "1rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "0.75rem",
                            background: "#450a0a",
                            color: "#fecaca",
                            border: "1px solid #b91c1c",
                            fontSize: "0.9rem",
                        }}
                    >
                        {error}
                    </div>
                )}

                {recommendations.length > 0 && (
                    <div>
                        <h2
                            style={{
                                fontSize: "1.3rem",
                                marginBottom: "0.75rem",
                                fontWeight: 600,
                            }}
                        >
                            Aanbevolen bieren
                        </h2>
                        <div
                            style={{
                                display: "grid",
                                gap: "0.75rem",
                            }}
                        >
                            {recommendations.map((beer, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "0.85rem 1rem",
                                        borderRadius: "0.9rem",
                                        background: "#020617",
                                        border: "1px solid #1f2937",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "baseline",
                                            gap: "0.75rem",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: "1.05rem",
                                                margin: 0,
                                            }}
                                        >
                                            {beer.name}
                                        </h3>
                                        {beer.style && (
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    padding: "0.2rem 0.6rem",
                                                    borderRadius: "999px",
                                                    background: "#111827",
                                                    border: "1px solid #374151",
                                                    color: "#d1d5db",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                        {beer.style}
                      </span>
                                        )}
                                    </div>
                                    {beer.description && (
                                        <p
                                            style={{
                                                marginTop: "0.4rem",
                                                marginBottom: 0,
                                                fontSize: "0.9rem",
                                                color: "#d1d5db",
                                            }}
                                        >
                                            {beer.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && !error && recommendations.length === 0 && (
                    <p
                        style={{
                            marginTop: "0.5rem",
                            fontSize: "0.9rem",
                            color: "#9ca3af",
                        }}
                    >
                        Tip: probeer iets als “een zachte, niet te bittere IPA met tropische toetsen” of
                        “een donker bier voor bij dessert”.
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;