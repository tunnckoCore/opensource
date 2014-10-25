
install:
	npm install

lint:
	$(MAKE) install
	./node_modules/.bin/jshint **/*.js

test:
	$(MAKE) lint
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--harmony-generators

test-cov:
	$(MAKE) lint
	@NODE_ENV=test node --harmony-generators \
		node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		-- -u exports \
		--require should

test-travis:
	$(MAKE) lint
	@NODE_ENV=test node --harmony-generators \
		node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		--require should

.PHONY: test lint

NODE_ENV=test node --harmony-generators node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha --report lcovonly -- -u exports --require should
