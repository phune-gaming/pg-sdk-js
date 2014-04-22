# Phune Gaming SDK for JavaScript

Build HTML5 games for the Phune Gaming platform.

Please read [Phune Gaming developer's documentation](http://developers.phune.com) for more information.

## Install

Building Phune Gaming SDK requires you to have previously installed [Node.js](http://nodejs.org/) and [Ruby](http://www.ruby-lang.org/).

Install Grunt's command line interface globally:

```
$ npm install -g grunt-cli
```

Install Node.js dependencies:

```
$ npm install
```

Install [Ruby Gems](https://rubygems.org/) dependencies:

```
$ gem install bundler
$ bundle install
```

## Build

Build the SDK:

```
$ grunt build
```

Clean, lint, and build the SDK:

```
$ grunt
```

There are many other tasks that can be run through Grunt. For the complete list of available tasks run:

```
$ grunt --help
```

## API

Generate and deploy the API documentation:

```
$ rake
```

## License

Copyright (c) 2014 Present Technologies

Licensed under the MIT license.
