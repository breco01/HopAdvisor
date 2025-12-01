# HopAdvisor – AI-gebaseerde Bieraanbevelingen

HopAdvisor is een webapplicatie die gepersonaliseerde bieraanbevelingen genereert op basis van gebruikersvoorkeuren.  
De applicatie bestaat uit een **Spring Boot backend** en een **React/Vite frontend**.  
Daarnaast ondersteunt het project gebruikersaccounts, beveiligde geschiedenisopslag en AI-gestuurde aanbevelingen.

---

## 1. Functionaliteiten

### Aanbevelingen
- De gebruiker kan voorkeuren ingeven (bv. "fris en hoppig", "zoet en donker").
- De applicatie genereert drie passende bieraanbevelingen.
- De variatie in stijlen wordt verhoogd via een verfijnde prompt.

### Gebruikersaccounts
- Gebruikers kunnen een nieuw account aanmaken.
- Authenticatie gebeurt via Basic Authentication.

### Zoekgeschiedenis
- Elke aanbeveling wordt opgeslagen wanneer de gebruiker is aangemeld.
- De gebruiker kan zijn persoonlijke geschiedenis ophalen.
- Klikken op een historisch item toont de bijbehorende aanbevelingen.

### AI-integratie
- Aanbevelingen worden gegenereerd via LangChain4j.
- De AI krijgt een instructieprompt waardoor de resultaten gevarieerd zijn.
- Het model retourneert strikt JSON zodat de backend het kan verwerken.

---

## 2. Technologieën

### Backend
- Java 23
- Spring Boot 3 / Spring Security
- JPA / Hibernate (H2 tijdens ontwikkeling)
- LangChain4j (AI-integratie)
- Maven

### Frontend
- React 18
- Vite
- CSS custom design 
- Fetch API met Basic Auth headers

---

## 3. Vereisten

### Software
- Node.js 22+
- npm 10+
- Java 23+
- Maven

### OpenAI API key
Voor AI-functionaliteit is een OpenAI API key vereist.

Deze moet worden toegevoegd in:

```
backend/src/main/resources/application.properties
```

Met de volgende inhoud:

```
hopadvisor.openai.api-key=YOUR_API_KEY_HERE
hopadvisor.openai.model=gpt-4o-mini
hopadvisor.openai.temperature=0.7
```

---

## 4. Project structureren

```
HopAdvisor/
│
├── backend/
│   ├── .idea/
│   ├── .mvn/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── be/hopadvisor/hopadvisor/
│   │       │       ├── auth/
│   │       │       │   └── AuthController.java
│   │       │       ├── config/
│   │       │       │   ├── AiConfig.java
│   │       │       │   └── SecurityConfig.java
│   │       │       ├── controller/
│   │       │       │   ├── HealthController.java
│   │       │       │   └── RecommendationController.java
│   │       │       ├── dto/
│   │       │       │   ├── BeerRecommendation.java
│   │       │       │   ├── ErrorResponse.java
│   │       │       │   ├── RecommendationRequest.java
│   │       │       │   └── RecommendationResponse.java
│   │       │       ├── exception/
│   │       │       │   └── GlobalExceptionHandler.java
│   │       │       ├── history/
│   │       │       │   ├── HistoryController.java
│   │       │       │   ├── SearchHistory.java
│   │       │       │   └── SearchHistoryRepository.java
│   │       │       ├── service/
│   │       │       │   ├── BeerAdvisorAiService.java
│   │       │       │   └── RecommendationService.java
│   │       │       ├── user/
│   │       │       │   ├── CurrentUserService.java
│   │       │       │   ├── User.java
│   │       │       │   └── UserRepository.java
│   │       │       └── BackendApplication.java
│   │       └── resources/
│   │           ├── static/
│   │           ├── templates/
│   │           └── application.properties
│   └── pom.xml
│
└── frontend/
    ├── .idea/
    ├── node_modules/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── assets/
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── README.md

```

---

## 5. Installatie en opstart

### 5.1 Backend installeren en uitvoeren

Ga naar de backend-folder:

```
cd backend
```

Dependencies downloaden:

```
mvn clean install
```

Applicatie starten:

```
mvn spring-boot:run
```

De backend draait op:

```
http://localhost:8080
```

---

### 5.2 Frontend installeren en uitvoeren

Ga naar de frontend-folder:

```
cd frontend
```

Dependencies installeren:

```
npm install
```

Start ontwikkelen:

```
npm run dev
```

De frontend draait op:

```
http://localhost:5173
```

Dankzij de Vite-proxy worden API-calls doorgestuurd naar de backend.

---

## 6. Beschikbare API-endpoints

### Openbare endpoints
| Methode | Endpoint               | Beschrijving                      |
|---------|-------------------------|----------------------------------|
| GET     | /api/health             | Gezondheidscheck                 |
| POST    | /api/recommendations    | Genereert bieraanbevelingen     |
| POST    | /api/auth/register      | Gebruiker registreren           |

### Beveiligde endpoints
Authenticatie via HTTP Basic (`Authorization: Basic <base64>`)

| Methode | Endpoint     | Beschrijving                                |
|---------|---------------|----------------------------------------------|
| GET     | /api/history  | Haalt persoonlijke zoekgeschiedenis op      |

---

## 7. Hoe log je in?

Stappen:

1. Maak een account aan in de UI via het formulier
2. Gebruik dezelfde credentials om je geschiedenis te laden
3. De frontend encodeert automatisch `username:password` naar Base64
4. Er verschijnt geen browser-popup dankzij een custom Security EntryPoint

---

## 8. Prompt voor diversere aanbevelingen

Dit project gebruikt een uitgebreide systeemprompt zodat de AI:

- variatie in stijlen geeft
- echte biernamen gebruikt
- geen herhaalde macro-pils selecteert
- steeds geldige JSON terugstuurt

---

## 9. Toekomstige uitbreidingen

- Favorieten opslaan
- Aanbevelingen delen via permalink
- Meertalige interface
- Geavanceerde filters (alcoholpercentage, bitterheid, kleur)

---

## 10. Licentie

Dit project is ontwikkeld in het kader van **Java Advanced – Short Burst Project**,  
**2025–2026** - **Erasmushogeschool Brussel**.
