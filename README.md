# Student Task Prioritization Tool (HTML + JavaScript)

Tämä projekti on nyt toteutettu **kokonaan JavaScript/HTML/CSS-pohjaisena** ilman Pythonia tai Flaskia.

## Arvolupaus

Sovelluksen arvolupaus on tarjota opiskelijalle selkeä ja helppokäyttöinen työkalu opiskelutehtävien hallintaan.

Käyttäjä pystyy näkemään kaikki tehtävänsä yhdessä näkymässä sekä tunnistamaan nopeasti, mitkä tehtävät ovat kiireisimpiä. Sovellus auttaa priorisoimaan tehtäviä deadlinen ja tärkeyden perusteella.

Keskeinen arvo käyttäjälle on parempi ajanhallinta sekä vähentynyt riski unohtaa tehtäviä.

## Ominaisuudet

- Lisää uusi tehtävä (title, description, course, deadline, priority)
- Näytä kaikki tehtävät listassa
- Automaattinen lajittelu deadlinen ja prioriteetin mukaan
- Merkitse tehtävä valmiiksi
- Poista tehtävä
- Korosta kiireelliset tehtävät (deadline 0–3 päivän sisällä)
- Tallennus selaimen `localStorage`:en

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

## Käynnistysohjeet (kokonaisuutena)

1. Avaa projektikansio.
2. Tuplaklikkaa `index.html` **tai** avaa se selaimessa.
3. Sovellus on heti käytettävissä.

## Tallennus

- Tehtävät tallennetaan selaimen `localStorage`:en avaimella `student_task_prioritizer_tasks_v1`.
- Jos localStorage on tyhjä, sovellus lisää automaattisesti esimerkkitehtäviä ensimmäisellä käynnistyskerralla.

## Huomio

Tiedosto `data/tasks.json` on mukana esimerkkidatana, mutta varsinainen käyttöversio tallentaa tehtävät selaimen localStorageen.
