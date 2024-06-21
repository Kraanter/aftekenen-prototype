# Webcomponent

Prototype voor het maken van een qr-code webcomponent. De webcomponent kan worden geïmporteerd in een HTML bestand en kan worden aangeroepen met een opdracht ID. De webcomponent genereert een qr-code met de opdracht ID en zorgt ervoor dat de naam en het studentnummer van de student wordt opgehaald.

## Features

- [X] Genereren van een qr-code met JSON paylaod
- [X] Ophalen van de naam en het studentnummer van de student
- [X] QR-code wordt gegenereerd met de opdracht ID en student gegevens
- [X] QR-code wordt rechtsboven in de hoek van de pagina geplaatst

## Gebruik

### QR-code webcomponent

Om de qr-code webcomponent te gebruiken, importeer je de webcomponent in een HTML bestand en roep je de webcomponent met de properties die je in je JSON payload wilt hebben.

```html
<qr-code prop1="value1" prop2="value2"></qr-code>
```

De JSON payload wordt gegenereerd met de properties die je meegeeft in de webcomponent. De QR-code hierboven wordt gegenereerd met de payload:

```json
{
  "prop1": "value1",
  "prop2": "value2"
}
```

### Afteken component

Om de afteken component te gebruiken, importeer je de webcomponent in een HTML bestand en geef je de opdracht mee als property.

```html
<afteken-component opdracht="race-simulator"></qr-code>
```

De afteken component haalt de naam en het studentnummer van de student op en genereert een qr-code met de opdracht ID en student gegevens.

## Installatie

1. Clone de repository
2. Open index.html in de browser
