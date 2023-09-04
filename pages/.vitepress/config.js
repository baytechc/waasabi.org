export default {
  title: 'Waasabi',
  description: 'Open source framework for custom live streaming events and conferences.',

  themeConfig: {
    logo: '/public/static/waasabi256.png',
    repo: 'https://github.com/baytechc/?q=waasabi',
    docsDir: 'pages',

    footer: {
      message: 'Waasabi components are licensed under the Apache 2.0 License',
      copyright: 'Copyright © 2020-present Bay Area Tech Club'
    },

    nav: [
      { text: 'Home', link: '/', activeMatch: '^/$' },
      {
        text: 'News',
        link: '/news/'
      },
      {
        text: 'Documentation',
        link: '/docs/',
        activeMatch: '^/docs/'
      },
      { text: 'Support Us', link: 'https://opencollective.com/waasabi' },
      { text: 'Chat', link: 'https://matrix.to/#/#waasabi:baytech.community' },
    ],

    sidebar: [
        {
          text: 'About Waasabi',
          link: '/docs/',
          items: [
            { text: 'Components', link: '/components' },
            { text: 'Architecture', link: '/architecture' },
          ]
        },
        {
          text: 'Documentation',
          items: [
            { text: 'Setup', link: '/docs/setup' },
            { text: 'Live UI', link: '/docs/livepage' },
            { text: 'CMS', link: '/docs/cms' },
            { text: 'Chat integrations', link: '/docs/chat' },
            { text: 'Streaming backends', link: '/docs/backend' },
          ]
        },
        {
          text: 'Projects',
          link: '/projects',
          items: [
            { text: 'Waasabi Matrix', link: '/projects/waasabi-matrix' },
            { text: 'Waasabi Captions', link: '/projects/waasabi-captions' },  
            { text: 'Waasabi P2P', link: '/projects/waasabi-p2p' },  
          ]
        },
        { text: 'Join the DevStream!', link: '/devstream' },
      ],
  }
}
