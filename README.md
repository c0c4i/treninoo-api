# Treninoo API

Treninoo API è il backend di supporto per [Treninoo](https://github.com/c0c4i/treninoo).

## Utilizzo

Il backend è stata scritta con il framework [AdonisJS](https://adonisjs.com/).

Per poter eseguire il codice nel proprio computer è necessario:

1. Clonare la repository
   
   ```bash
   git clone https://github.com/c0c4i/treninoo-api.git
   ```

2. Eseguire il codice
   
   ```bash
   yarn dev
   ```

È necessario avere il file `.env` con le variabili necessarie che sono le seguenti

```env
PORT=3333
HOST=0.0.0.0
BASE_URL=http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno
NODE_ENV=development
APP_KEY=
DRIVE_DISK=local
```





## Endpoints

### Endpoint esistenti

#### Elenco stazioni di partenza dato il numero del treno

```php
GET /departurestation/:traincode
```

La risposta è data nel seguente formato

```json
{
    "url": "http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/35",
    "total": 2,
    "stations": [
        {
            "stationCode": "S01003",
            "stationName": "DOMODOSSOLA",
            "priority": 2
        },
        {
            "stationCode": "N00001",
            "stationName": "MILANO NORD CADORNA",
            "priority": 2
        }
    ]
}
```

Questa chiamata è necessaria perché per conoscere lo stato di un treno è necessario avere il codice della stazione di partenza.

Questo perché alcuni treni in Italia hanno lo stesso numero.

Questa chiamata migliora quella originale restituendo un file JSON con i campi necessari e non una risposta testuale fatta male.

#### Ricerca stazioni

```php
GET /autocomplete/:word
```

La risposta è data nel seguente formato

```php
{
    "url": "http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/autocompletaStazione/verona%20porta",
    "total": 2,
    "stations": [
        {
            "stationCode": "S02430",
            "stationName": "VERONA PORTA NUOVA",
            "priority": 1
        },
        {
            "stationCode": "S02433",
            "stationName": "VERONA PORTA VESCOVO",
            "priority": 3
        }
    ]
}
```

Questa chiamata è stata modificata rispetto alla chiamata originale perché viene fatto un mapping e ordinato per priorità, in questo modo se noi cerchiamo la parola `VER` non avremo come primo risultato `vErGiNeSe` (chissà dov'è questa stazione e se esiste) ma avremo giustamente `VERONA PORTA NUOVA`.

#### Stato treno

```php
GET /details/:departureStation/:trainCode
```

La risposta è data nel seguente formato

```json
{
    "url": "http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/S01003/35/1652026491969",
    "status": {
        "trainType": "EC",
        "trainCode": 35,
        "stops": [
            {
                "stationCode": "S01003",
                "stationName": "DOMODOSSOLA",
                "plannedDepartureTime": 1651990620000,
                "actualDepartureTime": 1651990680000,
                "plannedArrivalTime": null,
                "actualArrivalTime": 1651990140000,
                "plannedDepartureRail": "3",
                "actualDepartureRail": "3",
                "plannedArrivalRail": "3",
                "actualArrivalRail": "3",
                "delay": 1
            },
            {
                "stationCode": "S01016",
                "stationName": "STRESA",
                "plannedDepartureTime": 1651992060000,
                "actualDepartureTime": 1651992120000,
                "plannedArrivalTime": 1651991940000,
                "actualArrivalTime": 1651992000000,
                "plannedDepartureRail": "1",
                "actualDepartureRail": "1",
                "plannedArrivalRail": "1",
                "actualArrivalRail": "1",
                "delay": 1
            },
            {
                "stationCode": "S01700",
                "stationName": "MILANO CENTRALE",
                "plannedDepartureTime": null,
                "actualDepartureTime": null,
                "plannedArrivalTime": 1651995600000,
                "actualArrivalTime": 1651995180000,
                "plannedDepartureRail": null,
                "actualDepartureRail": null,
                "plannedArrivalRail": "3",
                "actualArrivalRail": "3",
                "delay": -7
            }
        ]
    }
}
```

Questa risposta è una ristrutturazione dell'originale togliendo tutti i campi inutili.

> È ancora in sviluppo per l'aggiunta di altri campi necessari per lo stato del treno. Un esempio è il `currentDelay` che non è ancora presente.

### Endpoint futuri

#### Ricerca soluzioni

```php
GET /solutions/:departureCode/:arrivalCode/:date
```

#### Dettaglio stazione con partenze e arrivi

```php
GET /stations/:stationCode
```

#### Stato treno

```php
GET /details/:departureStation/:trainCode
```

Endpoint già esistente ma da sistemare per avere tutti i dati necessari.

## Funzionalità avanzate

È in fase di sviluppo la funzionalità per poter seguire un treno e riceve una notifica in app.

## Contributors

Nessuno ma se volete aiutare siete i benvenuti, scrivetemi pure una [email](mailto:samuele.besoli.sb@gmail.com).

## Copyright and License

Copyright 2023 Samuele Besoli. Code released under the MIT license.
