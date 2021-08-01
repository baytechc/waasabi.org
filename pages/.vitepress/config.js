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
      { text: 'Open Collective', link: 'https://opencollective.com/waasabi' },
    ],
    sidebar: {
      '/': [
        {
          text: 'Waasabi',
          children: [
            { text: 'About', link: '/about' },
            { text: 'Architecture', link: '/architecture' },
            { text: 'Components', link: '/components' },
            {
              text: 'Projects',
              link: '/projects',
              children: [
                { text: 'Waasabi Matrix', link: '/projects/waasabi-matrix' },
                { text: 'Waasabi Captions', link: '/projects/waasabi-captions' },  
                { text: 'Waasabi P2P', link: '/projects/waasabi-p2p' },  
              ]
            },
          ]
        },
        {
          text: 'Documentation',
          link: '/docs',
          children: [
            { text: 'Setup', link: '/docs/setup' },
            { text: 'Live UI', link: '/docs/livepage' },
            { text: 'Chat integration', link: '/docs/livepage' },
            { text: 'Streaming backends', link: '/docs/backends' },
          ]
        },
      ],
    }
  }
}
