# Battle Royale Online

Tämä on pieni reaaliaikainen selainmoninpeli. Pelaajat liittyvät samaan palvelimeen nimimerkillä.
Mukana on liikkuminen, tähtäys, osumat, tappolaskuri sekä paikalliset Aimbot- ja Wallhack-kytkimet.
Peli on kevyt 2D-areena, ei vielä täysimittainen 3D Fortnite.

## Pelaa omalla tietokoneella

1. Asenna Node.js 18 tai uudempi: https://nodejs.org/
2. Pura ZIP-tiedosto.
3. Avaa komentorivi tässä kansiossa.
4. Suorita `npm install`
5. Suorita `npm start`
6. Avaa selaimessa http://localhost:3000

Samassa lähiverkossa muut laitteet voivat liittyä tietokoneen lähiverkko-osoitteella ja portilla 3000, jos palomuuri sallii yhteyden.

## Julkaise internetiin

Palvelin tarvitsee Node.js-palvelun, joka tukee WebSocket-yhteyksiä (esim. Render Web Service tai vastaava).

1. Lataa tämän projektin tiedostot GitHub-repositorioon.
2. Luo palveluntarjoajassa uusi **Web Service** ja yhdistä repositorio.
3. Build command: `npm install`
4. Start command: `npm start`
5. Avaa palveluntarjoajan antama HTTPS-osoite. HTTPS-sivulla WebSocket käyttää automaattisesti WSS-yhteyttä.

Huom: en ole julkaissut palvelinta internetiin puolestasi. Julkaiseminen vaatii hosting-tilin ja projektin lataamisen palveluntarjoajalle. Älä jaa palvelimen ylläpitotunnuksia.
