# VacaTrack

## Übersicht

VacaTrack ist ein persönlicher Reisebegleiter als Progressive Web App (PWA). Die App funktioniert vollständig offline und bietet vier Kernmodule: Inventar-Tracker (Foto-Checkliste), Aktivitäten-Planer, Budget-Manager und Reise-Logbuch (Timeline).

## Kernmodule

### 1. Inventar-Tracker (Foto-Checkliste)

- **Features**:
  - Fotos von Kleidung/Gegenständen aufnehmen
  - Vor der Abreise den Bestand erfassen
  - Beim Packen für die Rückreise abhaken
  - Nichts vergessen dank visueller Checkliste

### 2. Aktivitäten-Planer

- **Features**:
  - Dynamische To-Do-Liste für Urlaubserlebnisse
  - Tagesansicht als Timeline
  - Kartenansicht für Aktivitäts-Orte

### 3. Budget-Manager

- **Features**:
  - Gesamtbudget eingeben
  - Ausgaben mit Datum, Ort/Laden, Betrag und optionaler Uhrzeit erfassen
  - Automatische Restbudget-Berechnung
  - Währungsumrechnung für internationale Reisen
  - Visualisierung per Diagramm

### 4. Reise-Logbuch (Timeline)

- **Features**:
  - Chronologische Anzeige besuchter Orte (Hotel, Restaurant, Museum etc.)
  - Zeitstempel und Datum pro Eintrag
  - Export als JSON

## Technische Basis

- **Framework**: React 18 + TypeScript
- **Build-Tool**: Vite 6
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Offline-Speicherung**: IndexedDB (via `idb`)
- **Service Worker**: Workbox (via vite-plugin-pwa)
- **Testing**: Vitest + React Testing Library

## Installation

1. Repository klonen:
   ```
   git clone <repository-url>
   cd VacaTrack
   ```
2. Dependencies installieren:
   ```
   npm install
   ```
3. Entwicklungsserver starten:
   ```
   npm run dev
   ```
4. Production Build:
   ```
   npm run build
   npm run preview
   ```

## Nutzung

- Im Browser öffnen oder als PWA auf dem Gerät installieren
- Funktioniert vollständig offline – ideal für Reisen ohne Internet
- Navigation über die untere Leiste zu allen Modulen

## Lizenz

MIT
