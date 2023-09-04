<!--

# 2021-11-01-ipfs-live-streaming

* https://opencollective.com/waasabi/updates/on-waasabi-ipfs-live-streaming

-->

# On Waasabi IPFS Live Streaming

<small>

*2021-11-01, originally published on [Open Collective](https://opencollective.com/waasabi/updates/on-waasabi-ipfs-live-streaming)*

</small>

The last two months (and, in & out, the last two years) I've spent on video technology, in no small part out of motivation for improving the status quo of online events (especially for RustFest, but anyone who'd care, really). But this two months were explicitly dedicated to researching the feasibility and specifics of one task: building a peer-to-peer live streaming component for [Waasabi](https://opencollective.com/redirect?url=https%3A%2F%2Fwaasabi.org), the framework underlying [RustFest Global's online infrastructure](https://opencollective.com/redirect?url=https%3A%2F%2Frustfest.global), using [IPFS](https://opencollective.com/redirect?url=https%3A%2F%2Fipfs.tech) / libp2p.

This blogpost marks the release of the first [proof-of-concept](https://github.com/baytechc/waasabi-ipfs-poc), the conclusion of our [NLNet NGI0 grant](https://opencollective.com/redirect?url=https%3A%2F%2Fnlnet.nl%2Fproject%2FWaasabi%2F) that supported this research, and mapping out the way forward.

### Technology primer: segmented video

_Note: there might be some big simplifications here, the goal is to set some baseline understanding about video streaming technology that is useful for understanding the rest of this post._

Generally speaking, there are two fundamentally different ways to streaming live video:

* **Real-time media streams** — two peers establish a persistent connection, a continuous stream of realtime video is piped through this connection from one machine to another. Latencies are practically around wire speed, that is, the delay roughly equals of the transmission delay of the network. RTMP is one frequent example.

* **Segmented video** — live video is chopped up into short video _segments_, which are deployed on a server (often a plain dumb HTTP server) alongside a _manifest_ file that describes the properties of the video. _VOD manifests_ already contain a list of all video segments, start to finish, while _live manifests_ update continuously as new segments are published for an ongoing broadcast.

Real time streams rely on a direct connection to efficiently stream video at minimal latency, but in the baseline case are not a great fit for 1:N broadcast scenarios (having to maintain direct connections to all N clients), and the stream itself is sensitive to network speed fluctuations. Segmented video has many favorable properties in broadcasting at the expense of encoding efficiency and increased latency. Segmented streams can respond to change in network conditions, (ideally ) seamlessly switching lower-bandwidth renditions, and make much more effective use of resources by publishing video segments on low-maintenance infrastructure (and usually distributing these via global CDN-s). This comes at the expense of simulating liveness, clients must be able to buffer segments of the broadcast and fetch newly published segments continuously to maintain a semblance of live video, all of which increase the glass-to-glass latency of the broadcast. The biggest technical challenge in segmented video broadcasts is making the right trade-offs in video quality, stream latency and distribution efficiency.

### The what and why of IPFS

So what is IPFS and what makes it a compelling choice for this particular workload?

IPFS is various standards around content-addressed, p2p storage. The bundle of technologies later evolved into [libp2p](https://github.com/libp2p/), a complete modular peer-to-peer networking stack with support for many popular languages, from Rust to JS, Python and Go.

There are two aspects in which this technology is interesting for us, and we are going to be talking about both today: video **recordings** of content (talks, artist performances and more) and video **broadcasts**, or live streams. These two, of course, are tightly interwoven (at least conceptually), and in particular in a world of online and hybrid events, so when back in 2020 we set out to re-imagine RustFest in the online space we were baffled by the lack of tooling and innovation in this space.

I won't recount our whole journey here (I've done it once [before](./2021-08-09-webmonetization-grant-report.md) for those interested), but enough to say that some of IPFS's properties seems well-suited to solve not only some of the technical challenges we were facing in the past years, but also improve on the dynamics of online communities.

Before I go into these properties, let's address the Alphabet in the room.

### Whose tube is it anyway?

Pretty much the entire video archive of the Rust community [is on YouTube](https://www.youtube.com/rustvideos). While the 40K+ followers of that account has certainly contributed to the reach and visibility of the content, not a day goes by that I don't think of the drawbacks of such an enormous centralization. We have seen it before, entire _decades_ worth of data and content, disappear in a puff of smoke, due to T&S violations, IP takedowns, mishaps in automation, simple misunderstandings, and even seemingly completely random, out-of-the blue, unwarranted suspensions.

While I _don't think_ the account is in danger of vanishing overnight, one can never be sure of course. But that's not all of course, YouTube being so ubiquitous to the western eye, it's easy to forget it's not, in fact, accessible _everywhere_. Whether it's sanctions, local politics or authoritarian governments, there are many, significant global regions deprived of the freely available knowledge these videos are supposed to represent. And on that note, just how free is free in this case? People are constantly subjected to invasive tracking, surveillance and rampant advertising in the middle of the content they are viewing. Of course, infrastructure and bandwidth have costs, content production too, but is it truly the YouTubes and Twitches that are best equipped to provide the infrastructure for these events and this content? Can we do better? 

### Now you see me

The internet lives in the quantum-superposition of two, seemingly orthogonal states: all content is ephemeral and may disappear at moment's notice; while, conversely, it seems that the internet also never forgets and anything that ever was published may resurface, or come back to haunt you at any point.

_IPFS itself is a bit like this, also._

P2P sharing, content addressing and mesh networking means anything that ever gets shared on the network is identified by the hash of the package's contents and is openly accessible to anyone who is in possession of this identifier -- as long as the network maintains a copy, somewhere. Which it probably does, as everything published on the network may be instantly disseminated around the world through peer-to-peer connections making up the global network. But none of these machines are _storing_ this content indefinitely, and may, at their own discretion purge it from existence, so here we see this above-mentioned duality represented: anything that is published may be immediately available to anyone, for any timespan long into the future, but one cannot **depend** on this being the case and, unless acted upon, content will routinely be swallowed by the abyss.

Unless acted upon is a load-bearing phrase in the above, which brings us to...

### A global CDN where everyone gets to be a POP

Content published on the IPFS network may be accessed by _anyone_, and the package itself may pass through infinitely many nodes. Integrity and privacy of the **information** contained within can be secured by encrypting the package (and transmitting the decryption key through separate channels) and hashing the resulting container's contents, so the client on the receiving end may verify its authenticity.

This property already enables some interesting usecases, but it's [pinning](https://docs.ipfs.tech/concepts/persistence/#garbage-collection) that makes it all truly fascinating.

Nodes on the network may _pin_ certain data, meaning that they volunteer not to _garbage-collect_ it, and keep it around to serve it to users interested in it (=requesting its Content ID). That said, pinning across nodes may be **orchestrated** (by some agreement between node owners, or simply, by spinning up a cluster of nodes all maintained by the same actors).

This makes IPFS networks really powerful content distribution channels as the users may ensure the content is _seeded_ (in Bittorrent terminology) by multiple dedicated owners while others may cache it and pass it around, ephemerally.

What does that imply for RustFest and video content? **We intend to publish the entire historical RustFest archive of recordings (hundreds of gigabytes of videos) on the IPFS network and host them for the foreseeable future.** Others may choose to take these datasets and pin them on their own nodes to improve redundancy, or make geologically distributed copies available to everyone, everywhere.

How is this different from, say, the Internet Archive or some other organization or non-profit making a backup of Rust videos on YouTube? Let's say YouTube goes down or suspends the account. People who would normally be accessing these videos through YouTube's system will need to _look for and find_ the redundant copies on the IA website. Whereas, for IPFS, the hosted data is **the same**. As long as the user has the pointers (CID listing associated with the videos), they will be able to access the content without issue, or having to think about where to look for it.

RustFest has always been a from-the-community, for-the-community event, and all RustFest content is available after the events for the community, so this approach meshes perfectly with our ingrained principles and we are extremely excited to finalize the details of this project and get started.

Before we get into the nitty-gritty of p2p streaming on IPFS, let's briefly talk about another option we have [explored earlier](./2021-10-11-new-peertube-backend.md) for this project:

### Peertube

Peertube, like other fediverse systems were built to provide an open (source) alternative to existing systems. Peertube is a complete system, complex and unruly, and definitely not intended to be a component, embedded in another system.

While on the face of it, I agree that integrating with the fediverse is a great idea (I am an ardent fedi person myself who hosts their own Peertube & Mastodon instances), but that shouldn't mean we need to take the entire system wholesale, and instead might make more sense in the future to integrate Waasabi itself with the fediverse through Activity Pub.

Furthermore, with RustFest we have been looking to experiment with new ideas _precisely_ because the existing platforms were explicitly set in their ways -- ways we had no interest in replicating, which was another thing we didn't align on with Peertube. This is not to say Peertube, or Mastodon are not interested in innovating and improving on their non-free counterparts, its simply that our approach is a lot more deliberate and radical in this matter.

> _"PeerTube provides a custom loader to hls.js that downloads segments from HTTP but also from P2P via WebRTC"_  
> — [chocobozzz/p2p-media-loader](https://github.com/chocobozzz/p2p-media-loader), a fork of [p2p-media-loader by Novage](https://github.com/Novage/p2p-media-loader)

Unsurprisingly, under the hood Peertube's revamped video transmissions also build on the contemporary HLS and DASH segmented streaming formats, while also utilizing P2P file shares over WebRTC in the browser. Unfortunately, nether of these libraries are particularly maintained, nor are they tested/benchmarked heavily against the live streaming use case (particularly, towards low-latency streaming), which has been something we have been keeping a close eye on (and through our testing, Peertube has had really bad G2G, glass-to-glass latencies during live streams, approaching and even exceeding one minute).

> _"P2P Media Loader starts to download initial media segments over HTTP(S) from source server or CDN. This allows beginning media playback faster. Also, in case of no peers, it will continue to download segments over HTTP(S) that will not differ from traditional media stream download over HTTP."_

With the research done around Waasabi's P2P streaming I am now convinced that P2P live streaming is not (simply) technically challenging, but requires carefully aligning incentives — and any implementation wherein the centralized use case (=downloading from an HTTP server) provides the users with a better experience will find that the odds are stacked against the incentivization of P2P sharing (a classic example of [the tragedy of commons](https://en.wikipedia.org/wiki/Tragedy_of_the_commons)).

Hence, for an ideal solution it would not only need to be technically superior or at the very least competitive with the state of the art in centralized technology (low latency HLS, LHLS, LL-DASH), but it would need to be imperative that it balances the necessarily higher barrier-of-entry of the peer-to-peer medium and providing low-barrier fallbacks for the traditional medium that doesn't ruin the system's incentives and throws the baby out with the bathwater when it tries to accomplish the original goal of reducing our reliance of centralized services & reducing the load on centrally-provisioned infrastructure.

### Why so peer-to-peer??

So what are these goals then that I mention?

1.  **Reduce the technical expertise, infrastructure & investment required for running live streaming events** — for all event sizes, from small meetups to large online conferences
2.  **Reduce the cost of running events with an online component, scale events automatically with their audience** — especially when the online component or live stream is provided free-of-charge
3.  **Improve the experience and accessibility of online, hybrid and in-person events with an online component** — the new IPFS infrastructure is built with many RustFest Global events' experiece under our belt to enable inclusivity features such as free live streams, instant replays, watch togethers, multi-streamed extra content (sketchnoting, etc.) and multi-language streams with live translation
4.  **Reduce broadcast latency to enable even more interactivity features and connect the online audience better with the presenters** — significantly reducing livestreaming latencies (to the several-seconds range) enables next-level interactivity and user experiences

So let's see how we are planning to accomplish these, through the current proof-of-concept, and the work laid out through the last couple months of digging and planning.

### The current proof-of-concept

We have released an [initial proof of concept](https://github.com/baytechc/waasabi-ipfs-poc/blob/main/hlsrtmp.js) earlier today. It doesn't do _much_, but it's honest, good work focusing on some of the features we _wished_ we had (even with commercial providers), but didn't over the past years. I'm talking about the ability of being able to programmatically start and stop RTMP ingest servers (=a server that can receive an incoming stream from a live studio, or OBS Studio or other streaming software), live broadcast them using HLS, and **immediately** make the recording available after the stream ends.

> _One of the core features of Waasabi and RustFest Global was that all talks, presentations and performances were but a single, short-lived video broadcast. You can read more about this in the article linked above, but this has been a surprisingly hard to achieve/implement feature in the past and the current PoC makes it trivially easy to accomplish._

### Living on the edge

We proud ourselves of the fact that RustFest Global events in the past couple years have been living on the edge when it came to experimentation with novel ideas, trying to feel out the strengths of the online medium. We don't often talk about this, but it's important to note here that this seemingly quite YOLO approach was much more careful experimentation than it initially seemed:

* We had paid a large professional live streaming provider to provide us with a livestream API to use as the ingest and broadcast medium
* We used an online studio provider to make sure nobody's machine, OBS Studio crashing or internet connection going down would be interrupting the show
* At some point, we even had an unlisted YouTube livestream, simultaneously running in case something went sideways that we weren't prepared for

The reason I'm bringing this up here, is that I wanted to point out that while we are interested in, what's more **excited to** experiment with novel ideas, at the end of the day we _still have an event to deliver to our attendees & audience_, who trust us to do so, many of them (including sponsors) pay us to do so... and so whatever risky business we endeavor on, we always have to make sure we try to mitigate any potentially arising issues well ahead of time.

**This** is why I find it so important that the end of the day (and the current proof-of-concept level) Waasabi's IPFS service is merely a _fancy HLS server_ that **also** publishes on IPFS. Should anything go wrong, we could spin up a couple extra servers on short notice, load balance them, make the source IPFS server syndicate the incoming pinned segments onto them and voilá, we have a fully HTTP-based fallback until we work out the issues we were facing.

In fact, we have it on our future roadmap to explore spinning up new cloud nodes automatically and _on-demand_, in areas where we have lots of viewers to help reduce latencies and improve distribution. When we say we're living on the edge, we certainly mean it you see...

So that's all the things we already have, let's talk about the things we don't (but we want them still, the known-unknowns, if you will):

### Does this come in other sizes?

One of the main reasons [HLS](https://www.rfc-editor.org/rfc/rfc8216.html) was invented in the first place was to support multiple renditions, alternate versions of the same content (be that a different resolution, or e.g. a language). This feature is notably missing from the PoC, mostly because in a P2P world renditions are highly, highly problematic.

Here's the issue: the default live stream of the server is 480p resolution. This is not ideal, so after people's complaints we want to add an alternate resolution, say 720p. 720p is a real crowd pleaser but we run into an issue that we split our audience up: some people are watching a 480p stream and thus requesting, downloading and re-sharing the 480p segments. Another group within our audience is playing the 720p segments. The two group rarely meets, except when one of the clients up or drowngrades in resolution.

This practically means that people watching the 720p live stream are not helping with the distribution of the 480p stream and vice versa. This is a problem because we reduce the efficiency of the swarm in distributing the content.

One potential (and frankly really neat) solution to this problem could be upgrade packs. Think of the following configuration instead: **everyone** receives the baseline resolution (e.g. 480p) segments, and thus can re-share across the entire farm. The trick comes as additional upgrade pack-s, e.g. extra compressed image data to enhance the baseline stream to upgrade or refine the lower-resolution segments to higher-resolution footage. What's more, these upgrade packs would work after the event, too: imagine live-streaming in 720p resolution, but after the broadcast ended, generating an upgrade pack to improve the broadcast resolution to 1080p or even 4K for the VOD viewers.

If all this sounds too good to be true, it's because it probably is. This needs exploratory heavy codec-level work to deduce if it's even _feasible_, much less if it's actually worthwhile doing. The motivation is probably clear: data published on IPFS is immutable, and is already distributed to clients, so reducing redundancy (in the form of renditions) is favorable.

### Let's talk, like a peer to a peer

Another feature that may seem to be conspicuously missing from the PoC are the actual peers. Browsers in the demo act as mere consumers of data published on the web gateway, and do not interact with the IPFS network, or other peers.

P2P communication of IPFS nodes most commonly happens over TCP, or UDP, or sometimes QUIC. None of these are available [to browsers](https://blog.ipfs.tech/2021-06-10-guide-to-ipfs-connectivity-in-browsers/) so the options we are left with are:

*   **Websockets** — these connections may be used server-to-browser communication. The complexities (publicly accessible IP address and TLS certificates (wss) requirement) don't make this too ideal of an option for intra-peer communication
*   **WebRTC with signalling** — in this case, peers only use a central server as a guiding post for finding each other through [webrtc-star](https://github.com/cretz/webrtc-ipfs-signaling). After a WebRTC connection is established between peers, communication happens in a peer-to-peer fashion (this is very similar to Peertube)
*   **TURN or central relays (p2p-circuit)** — these don't make a lot of sense in this case, since we could just be using them to distribute content
*   **The** [**WebTransport**](https://web.dev/webtransport/) **protocol** — truly a holy grail in browser-interconnectivity that exposes low-level QUIC connections to the web platform. QUIC (itself using UDP under the hood) is an excellent match for fast P2P connectivity, the only drawback here is [the poor browser support](https://caniuse.com/?search=webtransport) as this is a very recent feature, but [browser libp2p support](https://github.com/libp2p/js-libp2p-webtransport) is already being heavily worked on.

The current plan is to use all three viable interfaces (WebSockets for server connections, WebRTC+signalling as a baseline for inter-peer communication and WebTransport for supporting browsers) going forward and further decentralize by switching the current centralized live streaming architecture over to pubsub.

### True peer-to-peer live streams with pubsub

The proof-of-concept uses standard HLS mechanics for updating the playlists. At a high level what this means is that our browser will poll a constantly-updating HLS manifest endpoint that tells the browser when new video segments are available, so the browser may request those. There are ways to improve this in a centralized manner (e.g. push updates through the WebRTC message subscription Waasabi already maintains), but that would again put a bottleneck on central infrastructure, so instead we could use peer-to-peer mesh networks to our advantage here through [libp2p pubsub](https://docs.libp2p.io/concepts/publish-subscribe/).

Pubsub enables us to get best of both worlds performance of segmented and real-time streaming:

*   **Reduce the length of a segment significantly** — instead of individual segments of e.g. 4 seconds of video, the segments are e.g 250ms, or even just couple frames long
*   **Peers watching subscribe to messages concerning the broadcast** — each new video segment propagates through the entire mesh as new segments are published
*   **Greatly reduced latency & improved reliability** — segments reach every subscriber quickly, efficiently and reliably

_⚠️ IPFS deep-dive warning ⚠️_

In terms of IPFS large segments have their own inherent issues: bundling every individual segment into its own monolithic (1 chunk) DAG node limits the upper size boundary of a segment in 1 megabyte, and reducing peering efficiency as downloading of a single chunk cannot be further parallelized. By bundling the segment subdivided into [multiple chunks](https://dag.ipfs.tech/), peer efficiency improves but we added extra overhead for resolving the individual chunks.

By reducing segment sizes significantly, we can publish them as single-chunk DAG nodes, and can improve propagation by using pubsub where both metadata and full message content (=the video segment) is efficiently distributed by the network. What's more, efficiency can be further increased using gossip-based pubsub, in particular [episub, a proximity-aware pubsub variant](https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/episub.md). In these cases the mesh network of peers continously self-improves, taking hop counts and peer latencies into account, automatically adjusting the underlying network for minimizing latency and improving reliability.

### Are we there yet?!

Through the blunt instrument of IPFS publication and public HTTP gateway access (as demonstrated in the first PoC), we can already achieve <30s broadcast latencies which is competitive with basic untuned HLS. This is our baseline for all devices and maximum reach (as this method, as described earlier, is basically equivalent to standard HLS from the perspective of the client's requirements), but we already gain multiple advantages in the form of instant replays, IPFS resiliency for published content and more.

With smart use of IPFS features (e.g. spinning up relay nodes for impromptu CDNs), and tuning stream parameters it's possible to reliably reduce this latency to under 20s, often marketed as reduced latency HLS by industry vendors.

Achieving LL-HLS territory, sub-10s latencies is then possible by implementing mesh networks through pubsub/episub and high-performance client connectivity provided by WebTransport, while still keeping and even improving on IPFS-provided resiliency, network efficiency, and a significant reduction in centralized infrastructure requirements.

All of the above will take time, and a lot of experimentation and testing, but we are confident enough in the outlined step-by-step approach to say: **we intend to use this new infrastructure for RustFest Global events in 2023**, and if anyone is interested furthering this effort we [always welcome](mailto:team@rustfest.global) contributors and collaborators as we forge our path forward.

### A note on restricting access to content and incentives

On a closing note, let us address a question that may have formed during the above read:  
_How about private content?_

All of the above assumes that live streams more-or-less freely available to anyone. This is not an issue for RustFest, as, similarly to all previous RustFest and RustFest Global events, we intend to make the live streams accessible to anyone.

When it comes to options of restricting access to content distributed via IPFS, the following come to mind:

*   **Security-by-obscurity** — restricting access to the list of newly published segments (e.g. the HLS manifest)
*   **Encrypted segments** — encrypting the published segments, with simple symmetric encryption (and distributing the decryption key to people with access), a rolling key, or going full loco and using some DRM mechanism with client support
*   [**Private IPFS networks**](https://docs.ipfs.tech/concepts/privacy-and-encryption/#creating-a-private-network) — isolating the IPFS network hosting the live stream segments from the public IPFS network and only giving access to specific clients 

All of those above would represent some sort of trade-off in user experience, network efficiency and security (whereas security in most of these cases means the amount of additional effort is required to access the live stream which can also be interpreted as a degradation in user experience/accessibility, and not really security).

From the perspective of the live stream RustFest Global previously have [differentiated](https://2020.rustfest.global/information/how-to-watch/#differences-between-public-and-paid-streams) on two features for free and paying viewers:

*   Stream resolution/quality
*   The availability of [Replay](https://2020.rustfest.global/information/how-to-watch/#replay) feature

As for the Replay feature, as described above, this feature will now be **by design** part of the live stream experience in the IPFS infrastructure, and we do not intend to limit or restrict access to it in any way. The stream quality on the other hand is another story, and here we need to talk about incentives a bit more.

### Free as in free lunch

When we say [the broadcast is free for anyone to watch on the website](https://twitter.com/RustFest/status/1497632348703277059), what we mean of course is the cost of making the stream available is borne by _someone else_ but the viewer. Who that someone else is depends on the event: it could be sponsors, the paying ticket holders, or the infrastructure provider making the viewer [the product](https://bryanalexander.org/digital-literacy/you-are-the-product-one-interesting-source-for-the-meme/). RustFest has always been vehemently opposed to that last one, but the first two were quite alright as we consider it a form of redistribution, paying it forward and giving back to the community.

Now, in the IPFS era things are a bit different. After all, we are going into all this trouble to reduce the live stream's reliance on centralized infrastructure, and we do this by making You, Dear Viewer, the _sponsor_. In this new architecture the cost of free viewers are largely born by the viewers themselves — by participating in the distribution of the live stream, viewers contribute processing power and bandwidth to make the live stream accessible to others. In this setting, rather than _who pays for the free viewers_, _how do we incentivize contributing to p2p redistribution, reduce incentives for freeloading to keep the network healthy but not end up being too strict to a point where it limits access_ becomes the question. And if anything, this question is a _whole lot harder_ to solve and balance sufficiently than the previous one, and it will need a lot of research and experimentation before we can even attempt to provide a satisfactory answer.

_But we will never stop trying._

### Thank you!

Thank you Dear Reader for reading through this gargantuan exposé into the expansive underbelly of Waasabi & RustFest's infrastructure! As always, we always welcome feedback on social media or email:

*   [RustFest Twitter](https://twitter.com/rustfest)
*   [RustFest email](mailto:team@rustfest.global)
*   [Waasabi Twitter (Bay Area Tech Club)](https://twitter.com/bayareatechclub)
*   [Waasabi email (Bay Area Tech Club)](mailto:contact@baytech.community)
*   [Waasabi Open Collective](https://opencollective.com/waasabi)

We would also like to thank all our RustFest supporters who helped us over the years, and gave us the means & motivation to continue our work in supporting the Rust community.

<div style="margin: 2rem 0; display: flex; gap: 1rem">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 449 168" style="height: 4rem; object-fit: contain">
  <title>NLNet Foundation logo</title>
  <path fill="#98bf00" d="m446.6 73.88 2.5-13.65h-12.9l3.76-20.08-15.45 6.04-2.5 14.04h-9.4l-2.5 13.65h9.25l-3.15 17.3c-.14.94-.4 2.34-.64 4.14-.25 1.8-.4 3.4-.4 4.75.04 6.25 1.54 11.4 4.5 15.45 2.94 4.14 7.74 6.59 14.44 7.34l6.44-13.3c-3.44-.44-6.04-1.8-7.89-4.1-1.85-2.34-2.75-5.3-2.75-8.89 0-.7.1-1.7.25-3.05.15-1.35.3-2.45.45-3.3l3-16.34h13Zm-135.9-1.55c2.4-.85 4.5-1.3 6.26-1.3 1.9 0 3.5.55 4.8 1.65 1.24 1.05 1.84 2.6 1.84 4.75 0 .6-.1 1.5-.3 2.75-.2 1.15-.35 2.2-.5 3.1l-3.6 16.89-.75 4.05c-.25 1.45-.34 2.7-.34 3.75 0 4.05 1.1 7.44 3.34 10.14 2.15 2.7 6 4.3 11.55 4.75l6.35-12.84c-2.16-.35-3.7-1.15-4.65-2.4-1-1.2-1.5-2.9-1.5-5.05 0-.5.05-1.1.15-1.75.05-.65.15-1.2.2-1.6l3.64-17.2c.3-1.44.56-2.9.75-4.34.2-1.4.3-2.8.3-4.15 0-4.95-1.44-8.94-4.34-11.9-2.95-2.94-7.05-4.44-12.3-4.44-3.05 0-5.94.5-8.8 1.5-2.8.95-6.2 2.54-10.14 4.9a17.35 17.35 0 0 0-2.8-6.75l-13.4 5.75a20.5 20.5 0 0 1 2.6 5.5 21.16 21.16 0 0 1 .56 8.4c-.1 1.14-.25 2.04-.4 2.69l-7.95 42.33h14.4l8.44-45.68a23.33 23.33 0 0 1 6.6-3.5Z"/>
  <path fill="#98bf00" d="M350.74 80.08c-1.55 4.6-2.3 9.5-2.3 14.64 0 4.5.6 8.5 1.75 12s2.8 6.44 4.9 8.8a20.1 20.1 0 0 0 7.55 5.44 25.05 25.05 0 0 0 9.84 1.9c4.35 0 8.65-.8 12.95-2.4a30.3 30.3 0 0 0 11.4-7.44l-5.4-12.5c-2.5 2.8-5.25 4.9-8.3 6.35a21.07 21.07 0 0 1-9.1 2.15c-3.5 0-6.24-1.1-8.24-3.3a12.35 12.35 0 0 1-2.95-8.35v-.95c0-.4.05-.8.15-1.2a203.42 203.42 0 0 0 19.19-3.5c3.45-.84 6.8-1.8 10.1-2.8 3.24-1 6.14-2.05 8.6-3.1v-5.74c0-3.55-.56-6.75-1.66-9.6a23.32 23.32 0 0 0-4.6-7.2c-1.94-2-4.3-3.5-6.94-4.5a22.59 22.59 0 0 0-8.5-1.6c-4.45 0-8.6 1-12.34 2.96a28.48 28.48 0 0 0-9.7 8.1 38.55 38.55 0 0 0-6.4 11.84Zm21.64-10.1c1.55-.85 3.3-1.25 5.25-1.25 2.65 0 4.85.85 6.6 2.6 1.75 1.7 2.65 4.25 2.65 7.7-1.45.45-3.15 1-5.15 1.55-2.05.5-4.1 1-6.2 1.45-2.15.45-4.2.9-6.24 1.3l-5.3.9c.24-2.1.7-4.1 1.4-5.95.75-1.85 1.7-3.5 2.84-4.9a15.7 15.7 0 0 1 4.15-3.4Z" fill-rule="evenodd"/>
  <path d="M404.17 140.45c0-1.25-.2-2.4-.6-3.4-.4-1-.95-1.84-1.6-2.6-.7-.7-1.5-1.24-2.45-1.6-.95-.34-2-.54-3.1-.54a9.95 9.95 0 0 0-7.34 3.2 11.49 11.49 0 0 0-3.1 7.9c0 1.24.2 2.34.6 3.4.35 1 .9 1.84 1.6 2.54a6.6 6.6 0 0 0 2.44 1.7c.95.35 2 .55 3.15.55a9.87 9.87 0 0 0 7.3-3.2c.95-.95 1.7-2.15 2.25-3.5s.85-2.84.85-4.45Zm-13.9-.05c.3-.9.7-1.7 1.2-2.4.55-.7 1.2-1.25 1.96-1.7a4.66 4.66 0 0 1 2.5-.64c1.44 0 2.5.45 3.24 1.34.75.86 1.15 2.1 1.15 3.65 0 .95-.15 1.9-.45 2.85a6.75 6.75 0 0 1-3.15 4.1c-.75.4-1.6.6-2.5.6-1.45 0-2.5-.45-3.24-1.3a5.5 5.5 0 0 1-1.16-3.65c0-.94.16-1.9.46-2.85Z" fill-rule="evenodd"/>
  <path d="M434.56 132.56H431l-1.9 11.04c-.05.15-.1.4-.1.75v.85h-.15l-6.4-12.64h-3.35l-3.34 18.74h3.6l2-11.3c.04-.14.04-.4.04-.64v-.86h.15l6.55 12.95 3.2-.3 3.25-18.6Zm-60.18 0h-3.65l-3.34 18.74h3.7l3.3-18.74Z"/>
  <path d="M328.95 132.56h-4.25c-.8 1.35-1.65 2.9-2.6 4.55a151.3 151.3 0 0 0-5.19 9.99c-.75 1.6-1.36 3-1.8 4.2h3.84c.16-.35.3-.8.5-1.25.2-.45.4-.95.66-1.4l.6-1.35c.2-.45.4-.85.54-1.2h6.5c.05.45.05.9.1 1.4l.15 1.45.15 1.35c.05.45.05.8.05 1.15l3.7-.3c0-.7-.05-1.5-.15-2.45-.05-.95-.2-1.95-.35-3-.15-1.05-.3-2.2-.5-3.35-.15-1.15-.35-2.3-.6-3.44-.2-1.16-.4-2.25-.65-3.35-.25-1.05-.45-2.05-.7-3Zm-2.35 5.55.3 1.8c.1.6.2 1.2.25 1.74.1.55.15.95.2 1.3h-4.65c.25-.45.5-.95.75-1.5.3-.55.6-1.14.9-1.75.35-.6.65-1.14.95-1.7.3-.55.55-1.04.8-1.4h.2c.1.4.2.9.3 1.5Z" fill-rule="evenodd"/>
  <path d="m357.64 135.96.55-3.4h-12.8l-.55 3.4h4.55l-2.65 15.34h3.65l2.7-15.34h4.55Z"/>
  <path d="M297.46 132.3c-1.05 0-2.1.06-3.15.16-1.04.15-2.04.3-3 .55l-3.14 17.84c.95.25 2.04.4 3.24.55 1.16.15 2.25.2 3.3.2a11.19 11.19 0 0 0 7.85-2.95c1-.95 1.8-2.1 2.4-3.45.55-1.35.85-2.9.85-4.6 0-1.35-.2-2.5-.6-3.54a7.4 7.4 0 0 0-1.75-2.6 7.56 7.56 0 0 0-2.65-1.6 10.5 10.5 0 0 0-3.35-.55Zm-.8 3.4c.75 0 1.45.1 2.1.26.65.15 1.2.45 1.65.84.5.4.9.9 1.15 1.56.25.6.4 1.34.4 2.3 0 1.2-.15 2.24-.5 3.2a5.79 5.79 0 0 1-3.5 3.85 7.1 7.1 0 0 1-2.8.49c-.45 0-.9 0-1.45-.05-.55-.05-1.05-.1-1.4-.15l2.15-12.1 1.15-.15c.45-.04.8-.04 1.05-.04Z" fill-rule="evenodd"/>
  <path d="M185.8 62.59a20.53 20.53 0 0 1 2.6 5.5 21.16 21.16 0 0 1 .56 8.4c-.1 1.14-.25 2.04-.4 2.69l-7.95 42.33H195l8.44-45.68a23.33 23.33 0 0 1 6.6-3.5c2.4-.85 4.5-1.3 6.25-1.3 1.9 0 3.5.55 4.8 1.65 1.24 1.05 1.84 2.6 1.84 4.75 0 .6-.1 1.5-.3 2.75-.2 1.15-.35 2.2-.5 3.1l-3.6 16.89-.75 4.05c-.24 1.45-.34 2.7-.34 3.75 0 4.05 1.1 7.44 3.34 10.14 2.15 2.7 6 4.3 11.55 4.75l6.35-12.84c-2.15-.35-3.7-1.15-4.65-2.4-1-1.2-1.5-2.9-1.5-5.05 0-.5.05-1.1.15-1.75.05-.65.15-1.2.2-1.6l3.65-17.2c.3-1.44.55-2.9.75-4.34.2-1.4.3-2.8.3-4.15 0-4.95-1.45-8.94-4.35-11.9-2.95-2.94-7.05-4.44-12.3-4.44-3.04 0-5.94.5-8.8 1.5-2.8.95-6.2 2.54-10.14 4.9a17.35 17.35 0 0 0-2.8-6.75l-13.4 5.75Zm91.02-31.04h-14.14l-10.8 58.47c-.45 1.95-.8 4-1.05 6.15-.25 2.1-.4 4.05-.4 5.85 0 5.8 1.1 10.55 3.35 14.24 2.25 3.7 6.05 5.9 11.4 6.6l6.5-13.3a18.96 18.96 0 0 1-2.8-1.64 7.2 7.2 0 0 1-2.1-2.15 8.1 8.1 0 0 1-1.3-3.05c-.25-1.2-.4-2.7-.4-4.45 0-.85.05-1.8.15-2.8l.45-3.2 11.14-60.72Zm-30.39 101.01h-3.65l-2.4 13.69a5.7 5.7 0 0 1-4.3 1.95c-.9 0-1.6-.2-2.1-.6-.54-.45-.8-1.15-.8-2.2 0-.2.06-.5.1-.9.06-.35.06-.7.1-1l2-10.94h-3.7l-1.94 10.9-.15 1.34c-.05.45-.05.8-.05 1.15 0 1 .15 1.85.45 2.6a4.55 4.55 0 0 0 3 2.75 7.94 7.94 0 0 0 7.15-1.4c0 .25 0 .55.05.85 0 .25 0 .5.04.75l3.65-.25c-.04-.25-.04-.5-.04-.8-.06-.25-.06-.55-.06-.9 0-.6.06-1.25.1-1.9.05-.7.1-1.35.25-1.95l2.3-13.14Zm30.19 0h-3.55l-1.9 11.04c-.05.15-.1.4-.1.75v.85h-.15l-6.4-12.64h-3.34l-3.35 18.74h3.6l2-11.3c.05-.14.05-.4.05-.64v-.86h.14l6.56 12.95 3.2-.3 3.24-18.6Z"/>
  <path d="M214.8 134.46c-.7-.7-1.5-1.25-2.45-1.6-.95-.35-2-.55-3.1-.55a9.97 9.97 0 0 0-7.35 3.2 11.5 11.5 0 0 0-3.1 7.9c0 1.24.2 2.34.6 3.4.35 1 .9 1.84 1.6 2.54.65.75 1.5 1.3 2.45 1.7.95.35 2 .55 3.15.55a9.87 9.87 0 0 0 7.3-3.2 10.5 10.5 0 0 0 2.25-3.5c.54-1.35.85-2.84.85-4.45 0-1.25-.2-2.4-.6-3.4a9.1 9.1 0 0 0-1.6-2.6ZM204.3 138c.55-.7 1.2-1.25 1.95-1.7a4.68 4.68 0 0 1 2.5-.64c1.45 0 2.5.45 3.25 1.34.75.86 1.15 2.1 1.15 3.65 0 .95-.15 1.9-.46 2.85a6.75 6.75 0 0 1-3.14 4.1c-.75.4-1.6.6-2.5.6-1.45 0-2.5-.45-3.25-1.3a5.5 5.5 0 0 1-1.15-3.65 8.99 8.99 0 0 1 1.65-5.25Z" fill-rule="evenodd"/>
  <path d="M188.26 132.56h-10.3l-3.35 18.74h3.7l1.25-7.15h6.75l.6-3.4h-6.75l.85-4.8h6.65l.6-3.4Z"/>
  <path fill="#98bf00" d="M127.08 44.9c1.35-10.95-1.4-20.8-8.2-29.5C112.08 6.7 103.2 1.66 92.25.3c-10.95-1.34-20.8 1.41-29.5 8.2-8.04 6.25-12.94 14.3-14.69 24.15-.15.85-.3 1.65-.4 2.5-.1.85-.15 1.65-.2 2.44-.35 4.6.1 9 1.3 13.2a39.3 39.3 0 0 0 7.1 13.84 40.1 40.1 0 0 0 11.75 10.3 37.9 37.9 0 0 0 12.44 4.4c.8.15 1.6.25 2.45.4l1.35.15A42.3 42.3 0 0 1 89 67.53a38 38 0 0 1-4.75-.15c-.1-.05-.15-.05-.2-.05-1.85-.25-3.65-.6-5.3-1.15a26.51 26.51 0 0 1-13.04-9.24 26.5 26.5 0 0 1-5.6-20.24v-.2a26.5 26.5 0 0 1 10.34-18.15c6-4.65 12.75-6.55 20.3-5.6a26.2 26.2 0 0 1 18.29 10.35c4.65 6 6.55 12.74 5.65 20.3a35.7 35.7 0 0 1-1 4.84 41.3 41.3 0 0 1 13.2-2c.04-.45.14-.9.2-1.35Z"/>
  <path fill="#98bf00" d="M132.33 51.49c-.85-.1-1.65-.2-2.5-.25-4.6-.3-9 .15-13.2 1.3a39.42 39.42 0 0 0-13.84 7.15 38.4 38.4 0 0 0-14.7 24.14c4.36.74 8.36 2 12.05 3.85a26.53 26.53 0 0 1 10.35-18.14 26.59 26.59 0 0 1 20.3-5.66h.14c7.44.96 13.5 4.45 18.14 10.4 4.7 5.95 6.6 12.7 5.65 20.24a26.77 26.77 0 0 1-10.34 18.34 26.42 26.42 0 0 1-20.15 5.6c.85 4.05 1.1 8.3.8 12.7 9.95.65 18.94-2.2 26.99-8.45 8.7-6.8 13.75-15.7 15.1-26.64 1.34-10.94-1.4-20.79-8.2-29.49-6.3-8.05-14.35-12.94-24.14-14.69-.85-.15-1.65-.3-2.45-.4Z"/>
  <path d="M128.93 78.73c-3.45-.4-6.5.45-9.25 2.6a11.9 11.9 0 0 0-4.7 8.3c-.45 3.44.4 6.5 2.55 9.24a11.9 11.9 0 0 0 8.35 4.7c3.4.45 6.45-.4 9.2-2.55 2.75-2.15 4.3-4.9 4.74-8.35.4-3.4-.44-6.44-2.6-9.2a12.15 12.15 0 0 0-8.29-4.74Z"/>
  <path fill="#98bf00" d="M12.83 73.63c.95-7.55 4.4-13.7 10.4-18.34a26.12 26.12 0 0 1 20.09-5.6 44.33 44.33 0 0 1-.8-12.7c-9.95-.65-18.95 2.16-27 8.45C6.79 52.24 1.79 61.14.44 72.08c-1.35 10.95 1.35 20.74 8.2 29.49 6.24 8.05 14.3 12.95 24.14 14.7.8.14 1.6.24 2.45.4.85.1 1.65.2 2.5.24 4.6.3 9-.15 13.19-1.3a41.78 41.78 0 0 0 24.09-18.84 39.2 39.2 0 0 0 4.45-12.44 44.68 44.68 0 0 1-12.04-3.85c-.25 1.75-.6 3.45-1.1 5.1a26.53 26.53 0 0 1-9.25 13.04 26.59 26.59 0 0 1-20.3 5.65c-.04 0-.1 0-.14-.05a26.46 26.46 0 0 1-18.15-10.35 26.3 26.3 0 0 1-5.64-20.24Z"/>
  <path d="M32.47 67.13c-2.75 2.1-4.3 4.9-4.75 8.35a12 12 0 0 0 2.6 9.14 12 12 0 0 0 8.3 4.8 12.55 12.55 0 0 0 13.94-10.9c.45-3.44-.4-6.54-2.55-9.24a11.9 11.9 0 0 0-8.35-4.7c-3.45-.45-6.5.4-9.2 2.55ZM97.3 32.35a12 12 0 0 0-8.35-4.7c-3.45-.45-6.5.4-9.2 2.55A11.84 11.84 0 0 0 75 38.54c-.45 3.4.45 6.45 2.6 9.2a12.1 12.1 0 0 0 8.3 4.75c3.4.35 6.44-.5 9.2-2.6a12.26 12.26 0 0 0 4.74-8.3c.4-3.45-.45-6.54-2.55-9.24Z"/>
  <path fill="#98bf00" d="m85.05 88.43-1.35-.16a42.3 42.3 0 0 1-5.15 12.35c1.55-.1 3.15-.05 4.8.15.05 0 .1 0 .15.05 1.85.2 3.6.55 5.3 1.1a26.63 26.63 0 0 1 13.04 9.3 26.23 26.23 0 0 1 5.6 20.24v.2a26.47 26.47 0 0 1-10.35 18.14 26.52 26.52 0 0 1-20.29 5.6 26.56 26.56 0 0 1-18.3-10.35c-4.7-6-6.59-12.74-5.64-20.29.2-1.7.55-3.3 1.05-4.85a43.3 43.3 0 0 1-13.25 2c-.04.45-.14.9-.2 1.35-1.34 10.95 1.36 20.74 8.2 29.49a38.67 38.67 0 0 0 26.64 15.1c10.95 1.34 20.74-1.4 29.49-8.2 8.05-6.3 12.94-14.35 14.7-24.2.14-.8.24-1.6.4-2.44.04-.85.14-1.65.2-2.45.3-4.65-.16-9.05-1.3-13.2a40.16 40.16 0 0 0-7.1-13.84 39.9 39.9 0 0 0-11.7-10.3 38.72 38.72 0 0 0-12.5-4.4c-.8-.14-1.6-.3-2.44-.4Z"/>
  <path d="M90 120.41a12.14 12.14 0 0 0-8.35-4.75c-3.45-.4-6.5.45-9.2 2.6a12.14 12.14 0 0 0-4.75 8.3c-.45 3.45.46 6.5 2.6 9.25a11.7 11.7 0 0 0 8.3 4.7c3.45.44 6.5-.4 9.25-2.56 2.7-2.14 4.24-4.9 4.7-8.34.4-3.4-.46-6.45-2.55-9.2Z"/>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 36 400 136" style="height: 4rem; object-fit: contain">
  <title>NGI ZERO logo</title>
  <defs>
    <linearGradient id="a">
      <stop style="stop-color:#98bf00;stop-opacity:1" offset="0"/>
      <stop style="stop-color:#98bf00;stop-opacity:.85958904" offset="1"/>
    </linearGradient>
    <linearGradient id="b">
      <stop offset="0" style="stop-color:#98bf00;stop-opacity:1"/>
      <stop offset="1" style="stop-color:#98bf00;stop-opacity:.51"/>
    </linearGradient>
    <linearGradient xlink:href="#a" id="c" x1="14.92" y1="14.17" x2="213.75" y2="112.5" gradientUnits="userSpaceOnUse"/>
    <linearGradient xlink:href="#b" id="d" gradientUnits="userSpaceOnUse" x1="14.92" y1="14.17" x2="214.12" y2="111.76"/>
    <clipPath clipPathUnits="userSpaceOnUse" id="e">
      <path d="M0 127.98h415.47V0H0Z"/>
    </clipPath>
  </defs>
  <g style="fill-opacity:1;fill:url(#c)" transform="matrix(1 0 0 -1 0 170.65)">
    <path d="M25.23 113.8a11.08 11.08 0 0 1-11.05-11.05V25.23c0-6.08 4.97-11.05 11.05-11.05h165.03c6.08 0 11.05 4.97 11.05 11.05V43.5c0 2.02.8 3.96 2.24 5.4l9.1 9.09a6.49 6.49 0 0 1-.02 9.19l-9.07 9.02a7.63 7.63 0 0 0-2.25 5.4v21.16c0 6.08-4.97 11.06-11.05 11.06z" style="fill:url(#d);stroke:none;fill-opacity:1"/>
  </g>
  <g clip-path="url(#e)" transform="matrix(1 0 0 -1 0 170.65)">
    <path d="M0 0c4.07 0 7.38-3.3 7.38-7.38v-48.99a7.38 7.38 0 1 0-14.76 0v49C-7.38-3.3-4.08 0 0 0" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(176 95.86)"/>
    <path d="M0 0h-.5l-.2-.01-.19.01h-7.28c-3.93 0-7.36-2.96-7.62-6.88a7.38 7.38 0 0 1 7.36-7.87c.78 0 1.35-.76 1.12-1.5a6.5 6.5 0 0 0-4.55-4.33 25.81 25.81 0 0 0-6.6-.82c-4.01 0-7.58.86-10.7 2.6a18.68 18.68 0 0 0-7.34 7.23A20.99 20.99 0 0 0-39.14-1c0 4 .88 7.56 2.64 10.65a18.3 18.3 0 0 0 7.38 7.2 22.51 22.51 0 0 0 10.84 2.55 21.6 21.6 0 0 0 12.55-3.81 6.58 6.58 0 0 1 7.75.17 6.47 6.47 0 0 1-.31 10.45 31.66 31.66 0 0 1-5.51 2.93 39.48 39.48 0 0 1-15.21 2.82c-6.68 0-12.7-1.4-18.03-4.23a31.35 31.35 0 0 1-12.52-11.75c-3-5-4.51-10.67-4.51-16.98 0-6.32 1.5-11.98 4.5-16.99 3.01-5 7.15-8.92 12.44-11.74 5.28-2.83 11.23-4.24 17.85-4.24 4.6 0 9.2.7 13.75 2.1l.13.04a17.02 17.02 0 0 1 11.9 16.3v9.04A6.5 6.5 0 0 1 0 0" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(152.12 65)"/>
    <path d="M0 0v-49.18a7.29 7.29 0 0 0-7.29-7.28h-1.38c-2.18 0-4.24.98-5.63 2.66l-24.23 29.5a3.03 3.03 0 0 1-5.37-1.92v-22.96a7.28 7.28 0 1 0-14.57 0V0a7.28 7.28 0 0 0 7.29 7.29h1.47c2.18 0 4.25-.98 5.63-2.67l24.14-29.48a3.03 3.03 0 0 1 5.37 1.92V0A7.28 7.28 0 1 0 0 0" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(90.58 88.58)"/>
  </g>
  <path d="M243.58-73.02h19.46v3.62l-12.42 15.03h12.78v4.5h-20.18v-3.6l12.43-15.03h-12.07zm35.19 0h16.11v4.52h-10.14v4.3h9.54v4.52h-9.54v5.3h10.48v4.52h-16.45ZM320-62.75q1.88 0 2.69-.7.82-.7.82-2.3 0-1.57-.82-2.26-.81-.68-2.69-.68h-2.5v5.94zm-2.5 4.13v8.76h-5.98v-23.16h9.12q4.57 0 6.7 1.54 2.14 1.54 2.14 4.85 0 2.3-1.12 3.77-1.1 1.48-3.33 2.17 1.22.28 2.18 1.28.98.97 1.97 2.97l3.25 6.58h-6.36l-2.83-5.76q-.85-1.73-1.73-2.37-.87-.63-2.33-.63zm40.08-10.48q-2.73 0-4.23 2-1.5 2.02-1.5 5.68 0 3.65 1.5 5.66 1.5 2.02 4.23 2.02 2.74 0 4.25-2.02 1.5-2.01 1.5-5.66 0-3.66-1.5-5.67-1.5-2.02-4.25-2.02zm0-4.33q5.58 0 8.75 3.2 3.16 3.19 3.16 8.81 0 5.62-3.16 8.81-3.17 3.2-8.75 3.2-5.57 0-8.75-3.2-3.16-3.2-3.16-8.8 0-5.63 3.16-8.83 3.18-3.2 8.75-3.2z" transform="translate(0 170.65)" aria-label="Z E R O" style="font-variant:normal;font-weight:600;font-stretch:normal;font-size:31.76000023px;font-family:&quot;Montserrat SemiBold&quot;;-inkscape-font-specification:Montserrat-SemiBold;font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill:#000;fill-opacity:.7171717;fill-rule:nonzero;stroke:none"/>
</svg>

</div>