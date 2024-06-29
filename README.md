## Back-End

# Paso 1: La aplicación cliente inicia una solicitud de transacción
# Paso 2: La solicitud se envía al peer que realiza la validación (endorsing peer)
El peer que realiza la validación valida y respalda la transacción
Se ejecuta el chaincode para verificar las reglas de la transacción
# Paso 3: La transacción respaldada se envía al ordenante (orderer)
El ordenante valida y ordena las transacciones
# Paso 4: Las transacciones ordenadas se transmiten a los peers para ser registradas en el ledger

# Pasos:

Clonar el repositorio

Ejecutar los servicios de la Autoridad de Certificados (CA) para todas las organizaciones

Crear materiales criptográficos para todas las organizaciones

Crear artefactos del canal usando la MSP de la organización

Crear el canal y unir los peers

Desplegar el chaincode

Instalar todas las dependencias

Empaquetar el chaincode

Instalar el chaincode en todos los peers que realizan la validación

Aprobar el chaincode según la política de endoso del ciclo de vida

Confirmar la definición del chaincode

Crear perfiles de conexión

Iniciar el servidor de la API

Registrar al usuario usando la API

Invocar la transacción del chaincode

Consultar la transacción del chaincode

# Step 1

git clone https://github.com/KaisGitHub02/TFG-BlockChain-HyperLedger-P2P/

# Step 2-6

cd FabricNetwork-2.x/

cd artifacts/channel/create-certificate-with-ca

docker-compose up -d

docker ps

./create-certificate-with-ca.sh

cd ..

./create-artifacts.sh

cd ..

docker-compose up -d

docker ps

cd ..

./createChannel.sh

./deployTransactionCC.sh

# Backend - Proceso de configuración realizado

Iniciar PostMan y UI

# Crear otra chainCode (Escalabilidad de Ejemplo)

cd artifacts/src/github.com/fabcar/go/

go mod tidy

cd ../../../../..

./depolyChaincode.sh


# Step 7-9

cd api-2.0/

npm install

cd config/

./generate-ccp.sh

cd ..

nodemon app.js

ssh -L 4000:127.0.0.1:4000

## Front-End

En el directorio del proyecto, puedes ejecutar:

npm start
Ejecuta la aplicación en modo de desarrollo.
Abre http://localhost:3000 para verlo en tu navegador.

La página se recargará cuando hagas cambios.
También puedes ver cualquier error de lint en la consola.
