# Student Task Prioritization Tool (HTML + JavaScript)

Tämä projekti on toteutettu JavaScript/HTML/CSS-pohjaisena ilman backendiä.

## Uutta tässä versiossa

- Sivun oikeassa reunassa on kielenvaihtonappi (FI/EN).
- Sovelluksessa näkyy versionumero oikeassa alakulmassa.
- Värikkäämpi käyttöliittymä (gradient-tausta, värilliset kortit, prioriteettivärit).
- Tilastonäkymä (Total, Active, Completed, Urgent, Overdue).
- Kaksi minigrafiikkaa:
  - Priority Distribution
  - Status Split
- Valmiit tehtävät siirretty erilliseen osioon: **Completed Tasks (Archive)**.

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

- Tehtävät tallennetaan selaimen `localStorage`:en avaimella `student_task_prioritizer_tasks_v1`.
- Kielivalinta tallennetaan avaimella `student_task_prioritizer_lang`.
- Jos tallennus on tyhjä, sovellus luo aloitusdatan automaattisesti.

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
