const path = require('path');
const math = require('remark-math');
const katex = require('rehype-katex');
const versions = require('./versions.json');
const versionsArchived = require('./versionsArchived.json');

const allDocHomesPaths = [
  '/docs/',
  '/docs/next/',
  ...versions.slice(1).map((version) => `/docs/${version}/`),
];

const isDev = process.env.NODE_ENV === 'development';

const isDeployPreview =
  process.env.NETLIFY && process.env.CONTEXT === 'deploy-preview';

const baseUrl = process.env.BASE_URL || '/';

// Special deployment for staging locales until they get enough translations
const isI18nStaging = process.env.I18N_STAGING === 'true';

const isVersioningDisabled = !!process.env.DISABLE_VERSIONING || isI18nStaging;

/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'Syntixi',
  tagline: 'Multi-Cloud Serverless Solution for Kubernetes',
  organizationName: 'syntixi',
  projectName: 'syntixi',
  baseUrl,
  baseUrlIssueBanner: true,
  url: 'https://syntixi.dev',
  trailingSlash: isDeployPreview,
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css',
      integrity:
        'sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc',
      crossorigin: 'anonymous',
    },
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'tsx',
        format: isServer ? 'cjs' : undefined,
        target: isServer ? 'node12' : 'es2017',
      },
    }),
  },
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  customFields: {
    description:
      'A multi-cloud serverless solution for kubernetes. Syntixi helps you to move fast and focuse what matters.',
  },
  themes: ['@docusaurus/theme-live-codeblock'],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        editUrl: ({locale, versionDocsDirPath, docPath}) => {
          return `https://github.com/syntixi/website/edit/main/${versionDocsDirPath}/${docPath}`;
        },
        editCurrentVersion: true,
        sidebarPath: require.resolve('./sidebarsCommunity.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      }),
    ],
    [
      '@docusaurus/plugin-client-redirects',
      /** @type {import('@docusaurus/plugin-client-redirects').Options} */
      ({
        fromExtensions: ['html'],
        createRedirects: function (path) {
          // redirect to /docs from /docs/introduction,
          // as introduction has been made the home doc
          if (allDocHomesPaths.includes(path)) {
            return [`${path}/introduction`];
          }
        },
      }),
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: isDeployPreview,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        // swRegister: false,
        swCustom: path.resolve(__dirname, 'src/sw.js'),
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: 'img/logo.svg',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: 'manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(37, 194, 160)',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#000',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: 'img/logo.svg',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: 'img/logo.svg',
            color: 'rgb(62, 204, 94)',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: 'img/logo.svg',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#000',
          },
        ],
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        debug: true, // force debug plugin usage
        docs: {
          path: 'docs',
          sidebarPath: 'sidebars.js',
          editUrl: ({locale, docPath}) => {
            const nextVersionDocsDirPath = 'docs';
            return `https://github.com/syntixi/website/edit/main/website/${nextVersionDocsDirPath}/${docPath}`;
          },
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [
            math,
            [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
          ],
          rehypePlugins: [katex],
          lastVersion: "current",
          versions: {
            "current": {
              "label": "Latest",
            },
          },
        },
        blog: {
          path: 'blog',
          editUrl: ({locale, blogDirPath, blogPath}) => {
            return `https://github.com/syntixi/website/edit/main/website/${blogDirPath}/${blogPath}`;
          },
          postsPerPage: 5,
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Srcmesh Co., Ltd.`,
          },
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All our posts',
        },
        pages: {
          remarkPlugins: [require('@docusaurus/remark-plugin-npm2yarn')],
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      liveCodeBlock: {
        playgroundPosition: 'bottom',
      },
      hideableSidebar: true,
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        id: 'announcementBar-2',
        content: `⭐️ If you like Syntixi, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/syntixi/syntixi">GitHub</a> ⭐️`,
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
        additionalLanguages: ['java'],
      },
      image: 'img/syntixi-soc.png',
      gtag: !isDeployPreview
        ? {
            trackingID: 'UA-141789564-1',
          }
        : undefined,
      algolia: {
        apiKey: '109ffa458a189c22e657365926579fc5',
        indexName: 'docs_syntixi',
        contextualSearch: true,
      },
      navbar: {
        hideOnScroll: true,
        title: 'Syntixi',
        logo: {
          alt: 'Syntixi Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-white.svg',
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            docId: 'introduction',
            label: 'Docs',
          },
          // {
          //   type: 'doc',
          //   position: 'left',
          //   docId: 'cli',
          //   label: 'API',
          // },
          // {to: 'blog', label: 'Blog', position: 'left'},
          // {to: 'showcase', label: 'Showcase', position: 'left'},
          // {
          //   to: '/community/support',
          //   label: 'Community',
          //   position: 'left',
          //   activeBaseRegex: `/community/`,
          // },
          // right
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
              ...Object.entries(versionsArchived).map(
                ([versionName, versionUrl]) => ({
                  label: versionName,
                  href: versionUrl,
                }),
              ),
              {
                to: '/versions',
                label: 'All versions',
              },
            ],
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/syntixi/syntixi',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Introduction',
                to: 'docs/introduction',
              },
              {
                label: 'Installation',
                to: 'docs/getting-started/installation',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Feature Requests',
                href: 'https://github.com/syntixi/syntixi/issues/new?assignees=&labels=&template=feature_request.md&title=',
              },
              {
                label: 'Help',
                href: 'https://github.com/syntixi/syntixi',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: 'blog',
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/syntixi/syntixi',
              },
              {
                label: 'About Us',
                href: 'https://srcmesh.com/',
              },
            ],
          },
          // {
          //   title: 'Legal',
          //   // Please do not remove the privacy and terms, it's a legal requirement.
          //   items: [
          //     {
          //       label: 'Privacy',
          //       href: 'https://srcmesh.com/legal/privacy/',
          //     },
          //     {
          //       label: 'Terms',
          //       href: 'https://srcmesh.com/legal/terms/',
          //     },
          //     {
          //       label: 'Data Policy',
          //       href: 'https://srcmesh.com/legal/data-policy/',
          //     },
          //     {
          //       label: 'Cookie Policy',
          //       href: 'https://srcmesh.com/legal/cookie-policy/',
          //     },
          //   ],
          // },
        ],
        logo: {
          alt: 'Syntixi Logo',
          src: 'img/srcmesh-horizontal-logo-white.svg',
          href: 'https://srcmesh.com',
        },
        copyright: `Copyright © ${new Date().getFullYear()} Srcmesh Co., Ltd.`,
      },
    }),
});
