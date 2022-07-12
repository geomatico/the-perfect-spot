# plantilla-visor-react

Template for a simple viewer, to use it, go to https://github.com/geomatico/plantilla-visor-react and click on 'Use this template', a new repository will be created based on this template.
If you want to add functionalities, you can see more components here: https://labs.geomatico.es/geocomponents/

## First steps

Rename project in the following files:

- package.json:
    - name
    - repository.url
    - bugs.url
    - homepage
- package-lock.json:
    - name
- template.html:
    - Etiqueta `<title>`

## i18n

We use **i18next** framework to localize our components:

- Web: [https://www.i18next.com/](https://www.i18next.com/)
- React integration: [https://react.i18next.com/](https://react.i18next.com/)

Usage example on functional component:

```js
import { useTranslation } from 'react-i18next';

const FunctionalComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>
}
```

The applied language will be determined by:

1. The `lang` query string. For instance, use [http://localhost:8080/?lang=es](http://localhost:8080/?lang=es).
2. The browser language preferences.
3. If detection fails, will default to `es`.

There are other detection strategies available, see
[https://github.com/i18next/i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector).
