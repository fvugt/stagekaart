# StageKaart

An interactive map application showing student internships in the Netherlands. Built with React, Leaflet.js, and TailwindCSS.

## Features

- 🗺️ **Interactive Map** - Full map of the Netherlands with zoom and pan controls
- 📍 **Company Pins** - Clickable markers showing internship locations
- 🔍 **Search Functionality** - Search for companies by name
- 🏷️ **Tag Filtering** - Filter companies by technology focus (Software, Web, Mobile, XR, Game, Applied, Research)
- 📊 **Real-time Stats** - View company, internship, and city counts
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎯 **Smooth Interactions** - Map position preserved during filtering

## Technology Stack

- **React 18** - Frontend framework
- **Leaflet.js** - Interactive mapping library
- **TailwindCSS** - Utility-first CSS framework
- **Leaflet.markercluster** - Marker clustering for better UX

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

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

## Project Structure

```
src/
├── components/
│   ├── Map.js              # Main map component with Leaflet
│   ├── SearchBar.js        # Search functionality
│   ├── TagFilter.js        # Technology tag filtering
│   └── InternshipPanel.js  # Company details panel
├── data/
│   └── internships.json    # Company and internship data
└── App.js                  # Main application component
```

## Data Format

The application uses a JSON file (`src/data/internships.json`) with the following structure:

```json
{
  "id": 1,
  "companyName": "Company Name",
  "coordinates": [52.3676, 4.9041],
  "address": "Company Address",
  "description": "Company description",
  "logo": "logo-url",
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
      "role": "Internship Role",
      "description": "What the student did"
    }
  ]
}
```

## Adding New Companies

1. Open `src/data/internships.json`
2. Add a new company object following the structure above
3. Include valid coordinates (latitude, longitude)
4. Add appropriate technology tags
5. Include student internship details

## Available Technology Tags

- **Software** - Software development
- **Web** - Web development
- **Mobile** - Mobile app development
- **XR** - Extended Reality (VR/AR)
- **Game** - Game development
- **Applied** - Applied game development
- **Research** - Research & development

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