# Student Task Prioritization Tool

Yksinkertainen Flask-pohjainen web-sovellus opiskelutehtävien hallintaan ja priorisointiin.

## Arvolupaus

Sovelluksen arvolupaus on tarjota opiskelijalle selkeä ja helppokäyttöinen työkalu opiskelutehtävien hallintaan.

Käyttäjä näkee kaikki tehtävänsä yhdessä näkymässä sekä tunnistaa nopeasti, mitkä tehtävät ovat kiireisimpiä. Sovellus auttaa priorisoimaan tehtäviä deadlinen ja tärkeyden perusteella.

Keskeinen arvo käyttäjälle on parempi ajanhallinta sekä vähentynyt riski unohtaa tehtäviä.

## Ominaisuudet

- Lisää uusi tehtävä: otsikko, kuvaus, kurssi, deadline, prioriteetti.
- Näytä kaikki tehtävät samassa listassa.
- Automaattinen lajittelu deadlinen ja prioriteetin mukaan.
- Tehtävän merkitseminen valmiiksi.
- Tehtävän poistaminen.
- Kiireellisten tehtävien korostus (deadline 0–3 päivän sisällä).
- REST-tyyliset API-reitit JSON-tietovarastolla.

## Projektin rakenne

```text
student-task-prioritizer/
├─ app.py
├─ requirements.txt
├─ README.md
├─ templates/
│  └─ index.html
├─ static/
│  ├─ style.css
│  └─ script.js
└─ data/
   └─ tasks.json
```

---

## Sovelluksen käynnistysohjeet (kokonaisuutena)

### 1) Esivaatimukset

Varmista, että koneellasi on:

- **Python 3.10+** (suositus)
- **pip** (tulee yleensä Pythonin mukana)
- selain (Chrome, Firefox, Edge tms.)

Tarkista versiot:

```bash
python --version
pip --version
```

> Joissakin ympäristöissä komento on `python3` ja `pip3`.

### 2) Siirry projektihakemistoon

```bash
cd student-task-prioritizer
```

(Tai käytä hakemistoa, johon olet projektin kloonannut/purkanut.)

### 3) Luo virtuaaliympäristö

**Linux / macOS**

```bash
python -m venv .venv
source .venv/bin/activate
```

**Windows (PowerShell)**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Kun virtuaaliympäristö on aktiivinen, komentorivillä näkyy yleensä `(.venv)`.

### 4) Asenna riippuvuudet

```bash
pip install -r requirements.txt
```

### 5) Käynnistä sovellus

```bash
python app.py
```

Sovellus käynnistyy oletuksena osoitteeseen:

```text
http://127.0.0.1:5000
```

Avaa osoite selaimessa.

### 6) Sovelluksen pysäyttäminen

Paina terminaalissa:

```text
Ctrl + C
```

### 7) Sovelluksen uudelleenkäynnistys myöhemmin

Joka kerta uudella terminaalisessiolla:

1. Siirry projektihakemistoon
2. Aktivoi virtuaaliympäristö
3. Käynnistä sovellus

Esim. Linux/macOS:

```bash
cd student-task-prioritizer
source .venv/bin/activate
python app.py
```

---

## API-reitit

- `GET /tasks` – hakee tehtävät (järjestettynä + metadata `days_left`, `is_urgent`)
- `POST /tasks` – luo uuden tehtävän
- `DELETE /tasks/<id>` – poistaa tehtävän
- `PUT /tasks/<id>/complete` – merkitsee tehtävän valmiiksi

### Esimerkkipyyntö (POST /tasks)

```json
{
  "title": "Read biology chapter",
  "description": "Summarize pages 44-60",
  "course": "Biology",
  "deadline": "2026-04-30",
  "priority": "medium"
}
```

---

## Vianmääritys

### `ModuleNotFoundError: No module named 'flask'`

Et ole asentanut riippuvuuksia oikeaan ympäristöön.

Ratkaisu:

```bash
source .venv/bin/activate   # Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Portti 5000 on jo käytössä

Sulje toinen prosessi, joka käyttää porttia 5000, tai muuta porttia `app.py`:ssä.

### `data/tasks.json` puuttuu

Sovellus luo tiedoston automaattisesti käynnistyksen yhteydessä.

---

## Huomioita

- Data tallennetaan tiedostoon `data/tasks.json`.
- Tiedostopohjainen tallennus sopii paikalliseen harjoituskäyttöön.
- Jos data rikkoutuu, voit palauttaa tiedoston varmuuskopiosta tai alustaa sen tyhjäksi listaksi: `[]`.
