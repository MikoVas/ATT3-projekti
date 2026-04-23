# Student Task Prioritization Tool (HTML + JavaScript)

Tämä projekti on toteutettu JavaScript/HTML/CSS-pohjaisena ilman backendiä.

## Uutta tässä versiossa (v1.3.0)

- Sivun reunassa on kielenvaihtonappi (FI/EN).
- Versionumero näkyy käyttöliittymässä (ylhäällä ja oikeassa alakulmassa).
- Värikäs käyttöliittymä (gradient-tausta, värilliset kortit, prioriteettivärit).
- Tilastonäkymä + grafiikat:
  - Priority Distribution
  - Status Split
  - Course Distribution
- Valmiit tehtävät omassa erillisessä luettelossa: **Completed Tasks (Archive)**.

## Ominaisuudet

- Lisää uusi tehtävä (title, description, course, deadline, priority)
- Näytä aktiiviset tehtävät omassa listassaan
- Näytä valmiit tehtävät erillisessä arkistossa
- Automaattinen lajittelu deadlinen ja prioriteetin mukaan
- Merkitse tehtävä valmiiksi
- Poista tehtävä
- Korosta kiireelliset tehtävät (deadline 0–3 päivän sisällä)
- Tallenna data selaimen `localStorage`:en

## Käynnistys

1. Avaa projektikansio.
2. Avaa `index.html` selaimessa.
3. Sovellus toimii heti ilman asennuksia.

## Tallennus

- Tehtävät: `student_task_prioritizer_tasks_v1`
- Kielivalinta: `student_task_prioritizer_lang`

## Projektirakenne

```text
student-task-prioritizer/
├─ index.html
├─ README.md
├─ data/
│  └─ tasks.json
└─ static/
   ├─ script.js
   └─ style.css
```
