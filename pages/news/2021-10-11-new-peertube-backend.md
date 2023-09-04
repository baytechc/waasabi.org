# 2021-10-11-new-peertube-backend

* https://opencollective.com/waasabi/updates/new-waasabi-release-try-the-brand-new-peertube-backend

New Waasabi release: try the brand new Peertube backend!
===

There is a whole host of updates in the revamped Waasabi Configurator and the Installer that was re-built from the ground up, read on for the highlights!


## Peertube backend now in beta

Our work on Waasabi's built-in, peer-to-peer streaming option is bearing fruit: the new [Peertube](https://joinpeertube.org/) streaming backend can now be set up & installed in new instances through [Waasabi'd configurator](https://www.npmjs.com/package/waasabi).

The Peertube integration is currently in Beta, which comes with certain limitations. The out-of-the-box experience focuses on setting up a dedicated Peertube instance for Waasabi's live streaming, but there's nothing stopping anyone from using an existing Peertube installation together with Waasabi. In the latter case, some of the configuration needs to happen manually, including installing and configuring Waasabi's [Peertube integration plugin](https://www.npmjs.com/package/peertube-plugin-waasabi) on the instance.

![image alt][reference]

This work is [supported by the NLNet Foundation](https://nlnet.nl/project/Waasabi/) and is far from over! Besides improving on the Peertube-integration, we are also exploring other ways to make the resource-intensive task of live streaming more sustainable for individuals and small communities with the help of decentralized, distributed technologies.

## Brand new installer

The Waasabi Installer is the part of the Waasabi suite that takes a Waasabi configuration file and creates a living-and-breathing Waasabi instance out of it - be that in a container, on VPS or physical server. The installer has been re-built from the ground up and now features a Web interface that allows the creator to track the deployment of the instance:

![image alt](https:// "title" =WidthxHeight)

The simple logging iinterface is just a start, we have plans for making the installer configurable via a full-blown web interface in the future!

## Waasabi.org

We are still waiting for the final designs but the Waasabi website is now live. You can find the [documentation](https://waasabi.org/docs/) on the new site as well as more information and news about the ongoing work. Some of the docs for the new tools are still work-in-progress so please check back in a couple days for more updates. In the second half of October the [live.waasabi.org](https://live.waasabi.org) devstreams will also return so keep an eye out for the news on that!

## Chat integrations

The new configurator now also integrates the Waasabi Matrix chatbot installation. This means you can now configure the Matrix chat integration and have Matrix messages show up on the stream in real time. For details on the setup, please visit the [Chat documentation](https://waasabi.org/docs/livepage).

![image alt](https:// "title")

For now this integration requires an existing Matrix server (e.g. Synapse) and account, but we are also looking into Waasabi instances provisioning their own Matrix service. We also keep exploring the best way to integrate with other services as well, such as Discord and Slack, stay tuned for more updates on these on a later date.

## Thank you!

Thank you for checkin out Waasabi! Please check out the Peertube beta and let us know what you think. Join our [Matrix channel](https://matrix.to/#/#waasabi:baytech.community) to chat about Waasabi, and if you'd like to support our work you can do that on [Open Collective](https://opencollective.com/waasabi).
