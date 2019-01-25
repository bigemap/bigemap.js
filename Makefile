CLEANCSS = node_modules/.bin/cleancss
BROWSERIFY = node_modules/.bin/browserify

# the default rule when someone runs simply `make`
all: \
	dist/bigemap.js \
	dist/bigemap.uncompressed.js \
	dist/bigemap.internals.js \
	dist/bigemap.standalone.js \
	dist/bigemap.standalone.uncompressed.js \
	dist/bigemap.css \
	dist/bigemap.standalone.css \
	dist/images/icons-404040.png

node_modules/.install: package.json
	npm install && touch node_modules/.install

bigemap%js:
	@cat $(filter %.js,$^) > $@

dist:
	mkdir -p dist

dist/bigemap.css: dist/bigemap.uncompressed.css
	$(CLEANCSS) dist/bigemap.uncompressed.css -o dist/bigemap.css

dist/bigemap.uncompressed.css: theme/style.css
	cat theme/style.css > dist/bigemap.uncompressed.css

dist/bigemap.standalone.css: theme/style.css
	cat theme/style.css | $(CLEANCSS) > dist/bigemap.standalone.css

theme/images: theme/images/icons.svg
	./theme/images/render.sh

dist/images/icons-404040.png: theme/images
	cp -r theme/images/ dist/images
	cp -r node_modules/@bigemap/leaflet/dist/images/ dist/images
	rm -f dist/images/render.sh

# assemble a complete library for development
dist/bigemap.js: node_modules/.install dist $(shell $(BROWSERIFY) --list src/index.js)
	$(BROWSERIFY) src/index.js --debug -p [minifyify --map bigemap.js.map --output dist/bigemap.js.map] > $@

# assemble an uncompressed but complete library for development
dist/bigemap.uncompressed.js: node_modules/.install dist $(shell $(BROWSERIFY) --list src/index.js)
	$(BROWSERIFY) src/index.js --debug > $@

# assemble a library without bundled leaflet
dist/bigemap.standalone.js: node_modules/.install dist $(shell $(BROWSERIFY) --list src/bigemap.js)
	$(BROWSERIFY) src/bigemap.js --debug -p [minifyify --map bigemap.standalone.js.map --output dist/bigemap.standalone.js.map] > $@

# assemble an uncompressed library without bundled leaflet
dist/bigemap.standalone.uncompressed.js: node_modules/.install dist $(shell $(BROWSERIFY) --list src/bigemap.js)
	$(BROWSERIFY) src/bigemap.js --debug > $@

# assemble an uncompressed but complete library for development
dist/bigemap.internals.js: node_modules/.install dist $(shell $(BROWSERIFY) --list src/internals.js)
	$(BROWSERIFY) src/internals.js --debug  > $@

clean:
	rm -rf dist/*
