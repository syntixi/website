# Website

### Installation

```
$ yarn
```

### Local Development

Currently, Docusaurus supports rendering documentation in only one language at a time. Before launching the Docusaurus 
daemon, you need to choose one of the available locale options.

Support locales:

* `en`
* `zh-hant`

```
$ yarn start --locale <locale>
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Cut A New Version

```
$ yarn docver <semver>
```

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
$ GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
