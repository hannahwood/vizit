make dockerbashall:
	eslint server/app/routes/pt/index.js && npm start

# start both http and https servers
prod:
	eslint server/app/routes/pt/index.js && forever -l cokapi.log start server/app/routes/pt/index.js &
	eslint server/app/routes/pt/index.js && forever -l cokapi-https.log start server/app/routes/pt/index.js https &

docker:
	docker build -t="jasonunger/vizit:v1" .

dockerbash:
	docker run -t -i --rm --user=netuser --net=none --cap-drop all jasonunger/vizit:v1 bash

test:
	@echo 'JS'
	@time --portability docker run --rm vizit:v1 node --expose-debug-as=Debug /tmp/javascript/jslogger.js --jsondump=true --code="var x=1; var y=2; var z=x+y;"