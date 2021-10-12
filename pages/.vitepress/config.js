module.exports = {
  title: 'Waasabi — live event framework',
  description: 'Open source framework for custom live streaming events and conferences.',

  themeConfig: {
    repo: 'https://github.com/baytechc/?q=waasabi',
    docsDir: 'pages',

    nav: [
      { text: 'Home', link: '/', activeMatch: '^/$' },
      {
        text: 'Documentation',
        link: '/docs/',
        activeMatch: '^/docs/'
      },
      { text: 'Support Us', link: 'https://opencollective.com/waasabi' },
      { text: 'Chat', link: 'https://matrix.to/#/#waasabi:baytech.community' },
    ],
    sidebar: {
      '/': [
        {
          text: 'Waasabi',
          children: [
            { text: 'About', link: '/docs/' },
            { text: 'Components', link: '/components' },
          ]
        },
        {
          text: 'Documentation',
          children: [
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
          children: [
            { text: 'Waasabi Matrix', link: '/projects/waasabi-matrix' },
            { text: 'Waasabi Captions', link: '/projects/waasabi-captions' },  
            { text: 'Waasabi P2P', link: '/projects/waasabi-p2p' },  
          ]
        },
        { text: 'Architecture', link: '/architecture' },
        { text: 'Join the DevStream!', link: '/devstream' },
      ],
    }
  }
}
