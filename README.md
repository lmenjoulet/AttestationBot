# AttestationBot
## Développer
### Prérequis

* nodejs 12 
* npm
* un token discord de bot (à creer sur le [discord developper portal](https://discordapp.com/developers/applications))

### Installer le projet
```console
$ git clone https://github.com/lmenjoulet/AttestationBot.git
```
coller le token discord dans ressources/token_discord.js
```
$ cd ./AttestationBot
$ npm install
$ npm start
```

## Crédits

Le code de génération du pdf est un fork du dépôt [deplacement-covid-19](https://github.com/LAB-MI/deplacement-covid-19)

il utilise les projets suivants :

- [discord.js](https://discord.js.org/#/)
- [pdf-lib](https://pdf-lib.js.org/)
- [node-qrcode](https://github.com/soldair/node-qrcode)
