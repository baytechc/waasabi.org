# Waasabi Architecture

The Waasabi suite is built from a collection of pluggable and composable components. All of these components are created to be easily customizable and even replaceable, some are built to potentially be used even outside of Waasabi. Waasabi also relies on many third-party open-source projects, providing a single easy-to-use and maintain interface for creating a streaming experience with a low barrier to entry, but also supporting deployment and scaling when that's necessary.

We provide a listing of the currently available, as well as the planned components, with their roles in the Waasabi software stack and third-party dependencies.

> In order to further prepare for the rest of the support work of NGI Zero, it would be great if you could (at your earliest convenience) provide us with a high level overview of how you will approach the project and in particular an overview of any existing technology components you (are likely to) use in your project. The latter is often called a Software Bill of Materials. This will be of great help with the security review, accessіbility audit, the license compliance review and the various other mentoring parts. Likely this will be a living document at your end, so perhaps it is best if instead of sending us a document you prepare something somewhere in a public or private repository.


## Waasabi configurator: `waasabi-init` (Owned, Apache 2.0)

Commandline tool built in JavaScript (node.js) that allows for easy configuration of Waasabi's components to create a customized service for streaming broadcasts. The tool generates configuration files for deployment in a variety of environments, and can provision a local development instance as well.

- [`cloud-init`](https://github.com/canonical/cloud-init) (Apache 2.0 / GNU GPLv3 dual license)  
  *Configuration interface for infrastructure provisioning. Waasabi doesn't directly use the tool itself, but generates configuration files to be used by `cloud-init` on target deployment platforms and inside virtualization environments.*
- [Canonical Multipass](https://github.com/canonical/multipass) (GNU GPLv3)  
  *Currently used for creating local virtual server instances for deployment previews and development.*
- Various MIT-licensed node.js dependencies

**Planned / TBD:**

- [LXC / LXD containers](https://github.com/lxc/lxd) (Apache 2.0)  
  *Currently explored as an alternative to the multipass local runtime and as a potential target deployment architecture*
- [NixOS target](https://nixos.org/)  
  *Currently exploring integrations with NixOS as a potential first-class deployment target for Waasabi service configurations*


## [Waasabi live page](https://github.com/baytechc/waasabi-live) (Owned, Apache 2.0)

Static site generator that provides a default 'stream page', while allowing for deep customization and branding. No server-side components, the stream page is generated as a static webpage + client-side JavaScript bundle that communicates directly with the Waasabi backend (see further below.)

- Various MIT-licensed dependencies
- [Eleventy static site generator (MIT)](https://github.com/11ty/eleventy/) - *used only on the server for producing the HTML pages*
- [Apollo Client (MIT)](https://github.com/apollographql/apollo-client/) - *client-side JavaScript library*
- [Video.js (Apache 2.0)](https://github.com/videojs/video.js)


## Waasabi backend

Building on the open source Strapi content management system the Waasabi backend provides an API interface for the live page, as well as the various internal & external integrations (e.g. video and chat backends). The Waasabi configurator creates a new CMS installation based on the Waasabi template, which will allow for customizing the rest of the experience from the administration page.

- [Waasabi Strapi template (Owned, Apache 2.0)](https://github.com/baytechc/strapi-template-waasabi)
- [Strapi (MIT Expat license)](https://github.com/strapi/strapi)


## Video streaming backends

Currently Waasabi only supports external streaming providers, but various other solutions (including P2P ones) are being explored and implemented as alternatives, to be selectable during configuration. The Waasabi backend acts as a mediator between these components and communicated relevant information to the clients watching the broadcast using realtime signaling.

**Available:**
- [Mux.com service integration](https://github.com/muxinc/mux-node-sdk) (MIT License)


**Planned / TBD:**
- **[NGI0 project]** [PeerTube p2p streaming backend (AGPL 3.0)](https://github.com/Chocobozzz/PeerTube)  
  Integration with the popular PeerTube federated, self-hostable video service that recently launched live streaming support.
- **[NGI0 project]** [Custom p2p streaming backend based on Libp2p](https://github.com/libp2p/libp2p) (MIT License)  
  Custom peer-to-peer live streaming solution based on decentralized technologies implemented by `libp2p`.
- [Owncast self-hosted streaming backend](https://github.com/owncast) (MIT License)  
  Completely independent self-hosted traditional (server-client model) streaming solution.


## Chat backends

**Available:**
- [Waasabi Matrix bot](https://github.com/baytechc/waasabi-matrix/) (Owned, Apache 2.0 / MIT dual license)
    * [Ruma](https://github.com/ruma/ruma) (MIT License) - *Matrix network SDK written in Rust*
    * Various MIT-licensed dependencies

**Planned / TBD:**
- Discord chat integration
- OwnCast direct chat integration

