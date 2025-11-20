# StageKaart

Een interactieve kaart applicatie die studenten stages in Nederland toont. Gebouwd met React, Leaflet.js en TailwindCSS.

## Functies

- 🗺️ **Interactieve Kaart** - Volledige kaart van Nederland met zoom en pan besturing
- 📍 **Bedrijfspins** - Klikbare markers die stage locaties tonen
- 🔍 **Zoekfunctionaliteit** - Zoek naar bedrijven op naam
- 🏷️ **Tag Filtering** - Filter bedrijven op technologie focus (Software, Web, Mobile, XR, Game, Applied, Research)
- 📊 **Real-time Statistieken** - Bekijk bedrijf, stage en stad aantallen
- 📱 **Responsief Ontwerp** - Werkt op desktop en mobiele apparaten
- 🎯 **Vloeiende Interacties** - Kaart positie behouden tijdens filtering

## Technologie Stack

- **React 18** - Frontend framework
- **Leaflet.js** - Interactieve kaart bibliotheek
- **TailwindCSS** - Utility-first CSS framework
- **Leaflet.markercluster** - Marker clustering voor betere gebruikerservaring

## Aan de Slag

### Vereisten

- Node.js (versie 14 of hoger)
- npm of yarn

### Installatie

1. Clone the repository:
```bash
git clone https://github.com/fvugt/stagekaart.github.io.git
cd stagekaart.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment

### GitHub Pages

1. The `homepage` field in `package.json` is already configured:
```json
"homepage": "https://stagekaart.github.io"
```

2. Push your code to the existing repository:
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/fvugt/stagekaart.github.io.git
git push -u origin main
```

3. Deploy to GitHub Pages:
```bash
npm run deploy
```

4. Go to your repository settings and enable GitHub Pages from the `gh-pages` branch.

## Project Structuur

```
src/
├── components/
│   ├── Map.js              # Hoofdkaart component met Leaflet
│   ├── SearchBar.js        # Zoekfunctionaliteit
│   ├── TagFilter.js        # Technologie tag filtering
│   └── InternshipPanel.js  # Bedrijfsdetails panel
├── data/
│   └── internships.json    # Bedrijf en stage data
└── App.js                  # Hoofdapplicatie component
```

## Data Formaat

De applicatie gebruikt een JSON bestand (`src/data/internships.json`) met de volgende structuur:

```json
{
  "id": 1,
  "companyName": "Company Name",
  "coordinates": [52.3676, 4.9041],
  "address": "Company Address",
  "description": "Company description",
  "city": "City Name",
  "website": "company-website",
  "email": "contact-email",
  "phone": "contact-phone",
  "tags": ["Software", "Web", "Mobile"],
  "students": [
    {
      "name": "Student Name",
      "duration": "6 months",
      "year": 2023,
      "role": "Stage Role",
      "description": "What the student did"
    }
  ]
}
```

## Nieuwe Bedrijven Toevoegen

1. Open `src/data/internships.json`
2. Voeg een nieuw bedrijf object toe volgens de structuur hierboven
3. Voeg geldige coördinaten toe (latitude, longitude)
4. Voeg passende technologie tags toe
5. Voeg student stage details toe
6. Logo's zijn optioneel en niet meer vereist

## Beschikbare Technologie Tags

- **Software** - Software ontwikkeling
- **Web** - Web ontwikkeling
- **Mobile** - Mobiele app ontwikkeling
- **XR** - Extended Reality (VR/AR)
- **Game** - Game ontwikkeling
- **Applied** - Applied game ontwikkeling
- **Research** - Onderzoek & ontwikkeling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Leaflet.js for the mapping functionality
- TailwindCSS for the styling framework
- OpenStreetMap for the map tiles 