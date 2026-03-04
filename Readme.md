# Crearea unei Aplicații de Pixel Art în React

## Cerințe Generale

### Configurare Proiect
- Creează un proiect `React` folosind `Vite`.
- Folosește fișiere `.json` pentru a stoca paleta de culori disponibile.

### Interfață Utilizator (UI) & Experiență
- Stilizarea se poate face cu CSS/modulare sau biblioteci externe (e.g., Tailwind, Material-UI).

## Funcționalități

### 1. Grid-ul de Desen și Selectarea Culorilor

- Afișează un **grid NxN** (e.g., 20×20) de celule care servește drept canvas de desen.
- Utilizatorul poate **colora celule** prin click.
- Desenare e posibilă prin **click și drag** (ținând mouse-ul apăsat și deplasându-l peste celule).
- Afișează o **paletă de culori** (minim 10 culori, încărcate din fișier `.json`).
- Culoarea selectată curentă trebuie **evidențiată vizual**.
- Buton de **Reset** care curăță întregul canvas.

> **Indicații:** Pentru drag-to-paint, veți avea nevoie de evenimentele `onMouseDown`, `onMouseEnter` și `onMouseUp`.

### 2. Galerie — Salvare și Încărcare Desene

- Buton de **Save** care salvează desenul curent în galerie.
- **Galeria** afișează **thumbnail-uri** (miniaturi) ale tuturor desenelor salvate.
- Click pe un thumbnail sau buton **Load** — încarcă desenul în canvas pentru editare.
- Buton de **Delete** pentru ștergerea unui desen din galerie.
- Afișează **numărul total** de desene salvate.

## Barem de notare

| Punctaj | Sarcina |
|---------|---------|
| 1 | Crearea corectă a proiectului |
| 1 | Utilizarea fișierelor `JSON` pentru paleta de culori |
| 1 | UI Neoribil |
| 1 | Utilizarea corectă a state-urilor |
| 2 | Grid-ul de desen cu selectarea culorilor și reset |
| 2 | Galeria de desene cu salvare/încărcare/ștergere |
| 2 | Funcționalitatea de desenare prin click & drag |

### Link de exemplu de soluție: [Pixel Art App Example](https://pixel-draw-amber.vercel.app/)

## !! BAREM-UL DE MAI SUS ESTE PENTRU VERIFICAREA INIȚIALĂ A LABORATORULUI — LA ÎNCĂRCAREA ACESTUIA PE GITHUB. NOTA FINALĂ POATE FI MODIFICATĂ ÎN DEPENDENȚA APĂRĂRII LABORATORULUI ÎN CADRUL ORELOR !!

## !! NU SE ACCEPTĂ ÎNTÂRZIERI !!
