/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Docusaurus blog only!',
  tagline: 'Build optimized websites quickly, focus on your content',
  organizationName: 'syntixi',
  projectName: 'syntixi',
  baseUrl: '/blog-only/',
  url: 'https://syntixi.dev',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  themes: ['@docusaurus/theme-live-codeblock'],
  plugins: [],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        pages: false,
        blog: {
          routeBasePath: '/',
          path: 'blog',
          editUrl: 'https://github.com/syntixi/syntixi/edit/main/website/',
          postsPerPage: 3,
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Srcmesh Co., Ltd.`,
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    image: 'img/syntixi-soc.png',
    algolia: {
      apiKey: '47ecd3b21be71c5822571b9f59e52544',
      indexName: 'docusaurus-2',
      contextualSearch: true,
    },
    navbar: {
      hideOnScroll: true,
      title: 'Docusaurus',
      logo: {
        alt: 'Syntixi Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-white.svg',
      },
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Syntixi Logo',
        src: 'img/srcmesh-horizontal-logo-white.svg',
        href: 'https://srcmesh.com',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Srcmesh Co., Ltd.`,
    },
  },
};
