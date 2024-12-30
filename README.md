Faire un bon npm install pour installer les modules que j'ai ajouté depuis la derniere fois (mongoose principalement)

Lancer un shell pour la base de données mongo avec:
mongod

Pour le fonctionement du reste du backend:
traiter-messages est comme un module separé, jsp si on veut garder ce modalite de tout par module, c'est pas mal, mais en resume pour chaque fonctionalité on va faire comme ca? à voir

S'il marche pas pour vous, il faut aller sur /backend/traiter-messages et faire:
npm link

Puis aller sur /backend et faire:
npm link traiter-messages
