const path = require('path');
const { webpackPlugin } = require('./src/plugins/webpack-plugin.cjs');

module.exports = {
  title: 'Syntixi',
  tagline: 'Seamless application deployment and management at your fingertips',
  url: 'https://docs.syntixi.dev',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'syntixi',
  projectName: 'syntixi',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-hant'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      'zh-hant': {
        label: '繁體中文',
      },
    },
  },
  customFields: {
  },
  themeConfig: {
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    prism: {
      theme: require('./src/plugins/prism_themes/github'),
      darkTheme: require('./src/plugins/prism_themes/monokai'),
    },
    colorMode: {
      defaultMode: 'light',
    },
    image: 'img/og_img.png',
    metadata: [
      {name: 'keywords', content: 'syntixi, serverless solution, kubernetes, go, golang'},
      {name: 'twitter:card', content: 'summary'},
    ],
    navbar: {
      title: 'Syntixi',
      hideOnScroll: true,
      logo: {
        alt: 'Syntixi',
        src: 'img/logo.svg',
      },
      items: [
        {to: 'docs', label: 'Docs', position: 'left'},
        // {to: 'cookbooks', label: 'Cookbooks', position: 'left'},
        // {to: 'blog', label: 'Blog', position: 'left'},
        {to: 'releases', label: 'Releases', position: 'left'},
        // {
        //   type: 'dropdown',
        //   label: 'Community',
        //   position: 'left',
        //   items: [
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/syntixi/releases',
        //     },
        //   ],
        // },
        {
          href: 'https://github.com/syntixi/releases',
          position: 'right',
          className: 'header-github-link header-icon-link',
          'aria-label': 'GitHub repository',
        },
        // {to: 'support', label: 'Support', position: 'left'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [],
        },
        {
          type: 'dropdown',
          label: 'REST API',
          position: 'right',
          items: [
            {
              label: 'v1',
              href: '/api/?v=v1',
            },
            {
              label: 'v2',
              href: '/api/?v=v2',
            },
          ],
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Help',
          items: [
            {
              label: 'Support',
              to: 'support',
            },
            {
              label: 'Documentation',
              to: 'docs',
            }
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'See the Code',
              href: 'https://github.com/syntixi/syntixi',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Srcmesh Co., Ltd.`,
    },
    announcementBar: {
      id: 'star_the_dang_repo',
      content: `<strong>⭐️ If you like Syntixi, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/syntixi/syntixi">GitHub</a>!⭐</strong>`,
      backgroundColor: 'var(--ifm-color-primary)',
      textColor: 'var(--ifm-background-color)',
      isCloseable: true,
    },
    algolia: {
      appId: '33LN2FYWPC',
      apiKey: '7f1422ebbc6feb52c611fe8d28bc53ff',
      indexName: 'syntixi',
      contextualSearch: false
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/syntixi/website/edit/main/website/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Next'
            },
          },
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/api-reference.css'),
          ]
        },
        blog: {
          editUrl: 'https://github.com/syntixi/website/edit/main/website/',
          feedOptions: {
            type: 'all',
          },
        },
      },
    ],
  ],
  plugins: [
    webpackPlugin,
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'cookbooks',
        path: 'cookbooks',
        routeBasePath: 'cookbooks',
        include: ['**/*.md'],
        sidebarPath: require.resolve('./sidebars-cookbooks.js'),
        editUrl: 'https://github.com/syntixi/website/edit/main/website/',
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        lastVersion: 'current',
        versions: {
          current: {
            label: 'Next'
          },
        },
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'releases',
        path: 'releases',
        routeBasePath: 'releases',
        include: ['**/*.md'],
        editUrl: 'https://github.com/syntixi/website/edit/main/website/',
      },
    ],
  ],
};

