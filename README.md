# Chat-App

Chat-App est une application permettant à n utilisateur de créer un compte et discuter avec d'autres membres via un onglet conversation. 
L'interface est simple, fluide et a été concue pour traiter au mieux l'échange de message 

## Installation du projet 

Le projet se trouve [ici](https://github.com/ibbraba/projet-web)

Clonez le projet sur un dossier de votre ordinateur en utilisant la commande suivante 

```
git clone https://github.com/ibbraba/projet-web
``` 

Puis lancez l'application en utilisant cette commande 
```
docker compose up -d 
``` 





## Architecture de l'application 


### Partie Frontend - Interface utilisateur

### Partie API - Nest.js & GraphQL 

### Broker RabbitMQ 

Le broker RabbitMQ permet d'échager des messages entre l'API et le worker qui effectue des operations en base de données. Il est utilisé pour assurer le découplage entre l'API et la couche de persistance et permet d'initialiser un grand nombre de workers selon la charge de travail de notre application. 
Si l'API a besoin de données, elle emet un message dans une queue qui sera lue par le broker. Le broker executera une requête pour obtenir ou modifier des informations en base de données avant de renvoyer un message de réponse dans une autre queue. L'API se charge ensuite de lire le message de retour pour ensuite renvoyer les information à l'application client.

### Worker Nest.js et base de données 
Le worker consomme des messages du broker ou sont indiqués l'objet et l'operation souhaitée. Il effectue l'operation puis renvoie un message de succès ou d'erreur dans une nouvelle queue.