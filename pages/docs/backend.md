# Streaming backends

Waasabi currently supports two components to provide the video streaming functionality (but integrating further options is already underway).

## Waasabi MUX API backend

[MUX](https://mux.com/) provides a commercial professional streaming backend, suitable for a variety of needs. Small-scale deployments can be used cost-effectively, while more demanding usecases (such as conferences) can count on its reliability, but in those cases plan for having to foot a reasonable, but not cheap bill.

Earlier editions of the [RustFest Global](https://rustfest.global) used the MUX backend to live-stream the whole-day online conference world-wide to hundreds of people, with a final cost of a few dollars per person.

![Screenshot of Waasabi at RustFest Global 2020](/static/screenshot-rustfest.jpg)

## Waasabi PeerTube backend

The PeerTube backend is the first supported streaming backend coming from our recent work in integrating decentralized, peer to peer solutions into Waasabi -- an effort supported by the [NLNet foundation's NGI0 programme](https://nlnet.nl/project/Waasabi/).

Waasabi's PeerTube backend not only provides a self-contained, open source and libre solution for the live stream, but also allows the users to gain access to an emerging [Fediverse](https://fediverse.party/en/fediverse) of independent social media services.

![PeerTube in action on the Waasabi live page](/static/waasabi-peertube.jpg)

While its federated peer-to-peer nature alleviates the need for powerful dedicated hardware, ensuring stability and reliability if PeerTube instances at larger scales becomes a non-trivial issue and for large, mission-critical deployments we recommend to enlist people with sufficient expertise to manage the hardware and software internals of Waasabi & PeerTube.

::: warning PLEASE NOTE
Waasabi's PeerTube integration is [currently available in beta](https://opencollective.com/waasabi/updates/new-waasabi-release-try-the-brand-new-peertube-backend). There are certain limitations to the final featureset offered by Waasabi, but we encourage everyone to give it a shot and provide feedback for further improvements.
:::
