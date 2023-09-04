# 2021-08-09-webmonetization-grant-report

* https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1
* https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1



Waasabi — Final Grant Report
============================

[](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#project-update)Project Update
---------------------------------------------------------------------------------------------------------------------------------------------------------

It’s been a year since Waasabi's first prototype was conceived, so amidst the ongoing planning of our second large conference and onboarding of new early-adopters to Waasabi Beta it's time we discussed what's already done and what we sets ours sights on for the the upcoming updates.

[](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#progress-on-objectives)Progress on objectives
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

It was November when last year the first version of Waasabi powered rustfest.global. Like many other events, we too were forced to migrate into cyberspace, and Waasabi was our way response to seeing the lack of creativity and missing tooling in the online event space. Since then we have been moving our learnings and code from that experimental version into an open and flexible framework under the Waasabi Framework's umbrella.

In the past months multiple events (Rust Berlin meetup, Rust Hungary meetup), even our own development stream the Waasabi Live stream has used Waasabi as we worked to constantly evolve and expand its feature set through this feedback.

The work is still far from done, though Grant for the Web has enabled much experimentation and laid the foundations upon which we may continue expanding the initial scope as we dive deeper into creating the tool that will enable the engaging interactive experiences we have envisioned.

All Waasabi components are [open source, released under the Apache-2.0 license on Bay Area Tech Club's GitHub](https://web.archive.org/web/20220702224928/https://github.com/baytechc/?q=waasabi).

[](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#key-activities)Key activities
---------------------------------------------------------------------------------------------------------------------------------------------------------

Waasabi set out to

> _"solve the hard problems of event streaming"_

and through this, to enable event organizers build custom experiences, quickly. The toolkit's underlying concept is to create a coupling of efficient live streaming and a variety of realtime integrations (such as chat, captions, interactive experiences and more). Waasabi is the "hub" that aggregates data from all these systems and provides a unified API, as well as real-time event notifications (e.g. of incoming messages or when a new live stream is started).

Instead of a single, long-running live video stream — which is how most online events today are usually structured — Waasabi encourages a single stream per program and will take care of starting & switching between streams automatically. It may even multiplex multiple simultaneous live streams, for example to allow showing the live stream and a live sketchnoter, side-by-side.

[![RustFest Global 2020 screenshot showing the live stream and sketchnoter’s work side by side](https://i3.wp.com/web.archive.org/web/20220702224928im_/https://community.webmonetization.org/images/sfN777F2G-Oic09s5IoDJrvrBuSYzD6cZ6Vs9yu6zTI/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy8wZGR1/dTViMTFja2JncHZn/M2xjai5qcGc)](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/images/sfN777F2G-Oic09s5IoDJrvrBuSYzD6cZ6Vs9yu6zTI/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy8wZGR1/dTViMTFja2JncHZn/M2xjai5qcGc)

[The conference live stream shown on the left with a live view at the sketchnoter’s work on the right at RustFest Global 2020](https://web.archive.org/web/20220702224928/https://twitter.com/Kingdutch/status/1325001098923565056/photo/1)

### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#waasabi-core-beta)Waasabi Core Beta

Waasabi's Core module extends the open source [Strapi](https://web.archive.org/web/20220702224928/https://github.com/strapi/strapi) content management system with its own preset template. [Waasabi's template](https://web.archive.org/web/20220702224928/https://github.com/baytechc/strapi-template-waasabi) is used by the installer (see below) when creating a new Waasabi instance from scratch.

The Strapi administration interface of the instance can be used to manage Waasabi's events and broadcasts. Strapi's API can be used from any existing website to integrate streaming functionality. The Waasabi Installer also provides a "Live Event starter kit" that can be used for the live experience and further customized if needed (more on this later).

[![Waasabi’s administration interface in Strapi](https://i3.wp.com/web.archive.org/web/20220702224928im_/https://community.webmonetization.org/images/EdiT56fOjz9mjHt8M8RkF0-sPzpQMBu_Jw4RCIOX32U/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy85bHh2/dmhuaWZ5OW10YmM5/amRmYy5wbmc)](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/images/EdiT56fOjz9mjHt8M8RkF0-sPzpQMBu_Jw4RCIOX32U/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy85bHh2/dmhuaWZ5OW10YmM5/amRmYy5wbmc)

The current Beta focuses on public events, while built-in registration, ticketing and user management has also been previewed at RustFest Global 2020, and is coming to the suite in the next version.

### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#web-monetization)Web Monetization

Waasabi aims to be a collection of tools

> _"…for \[event\] organizers who want to experiment with new event formats and business models…"_

It intends to encourage & help organizers fully embrace that online events come with a completely different set of limitations, when compared to in-person events, but also have their unique advantages. For example, people might be less focused and less present during day-long digital events: in-person events bring with them a very different headspace, that cannot be replicated from home. On the other hand, given enough flexibility and organizer support, features like Waasabi's instant replays, captioning and other affordances can make online events orders of magnitude more accessible, with a much larger, potentially global reach.

[![webmo](https://i3.wp.com/web.archive.org/web/20220702224928im_/https://community.webmonetization.org/images/rhtT7MsMUSRgIKmV6XmMgeUGMgOW9Nn2Z55IFupvPck/w:880/mb:500000/aHR0cHM6Ly9iYWNr/ZW5kLnJ1c3RmZXN0/Lmdsb2JhbC91cGxv/YWRzL3dlYm1vbmV0/aXphdGlvbl9hYjVl/NjEyYzg2LnBuZw)](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/images/rhtT7MsMUSRgIKmV6XmMgeUGMgOW9Nn2Z55IFupvPck/w:880/mb:500000/aHR0cHM6Ly9iYWNr/ZW5kLnJ1c3RmZXN0/Lmdsb2JhbC91cGxv/YWRzL3dlYm1vbmV0/aXphdGlvbl9hYjVl/NjEyYzg2LnBuZw)

[Web Monetization is a great example of _“things that would not make sense in an in-person context, but can work really well for online events”_](https://web.archive.org/web/20220702224928/https://rustfest.global/information/about-web-monetization/)

#### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#web-monetization-as-a-creator-incentive)Web Monetization as a creator incentive

During RustFest we wanted to use Web Monetization for more than just a revenue source for the event: we wanted it to serve as an incentive for the true producers of the conference content, the speakers and artists.

The way this is currently implemented in Waasabi, is that every session can be assigned a Payment Pointer and Waasabi takes care of switching to the correct payment pointer during the session’s runtime. While this works, it’s a crude solution that raised multiple other issues:

*   What happens if a session has more than one speaker/collaborator?
*   Having all speakers and artists register & share their Web Monetization-enabled wallets was cumbersome and many missed the opportunity due to this friction;
*   Making sure the attendees had Web Monetization-enabled clients (subscription with the required extensions installed) resulted in even more friction.

With increased awareness and adoption some of the above issues could be alleviated, but we are also looking into [Rafiki](https://web.archive.org/web/20220702224928/https://github.com/interledger/rafiki), and exploring hosting our own Interledger service within Waasabi, which could provide a lot more flexibility in these micropayment integrations and open up more creative ways to utilize Web Monetization in Waasabi with greatly reduced friction.

#### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#web-monetization-for-access-control)Web Monetization for access control

Initially we had planned to enable using Web Monetization as an access control mechanism: gating some of the content, or enhancements such as higher resolution streaming behind streaming payments. Watching the evolution of online community conferences, it quickly became clear that:

*   in order to have the best possible, global reach and make community events accessible to all a free event or free tier is needed;
*   in fact, many seem to came to expect online events to be free, with costs covered mainly by corporate sponsorships;
*   but one can still capture funds via “ticket” sales by providing extra features, especially when employees can forward these costs to their employers.

Due to these, Web Monetization access control to these additional features or the stream itself became a lower priority and this first Beta focuses on publicly available events.

We are looking at potentially implementing video access control and monetization via [Peertube](https://web.archive.org/web/20220702224928/https://opencollective.com/waasabi/updates/sneak-peek-at-the-largest-waasabi-update-to-date), a new video backend we integrate with. Peertube is receiving [first-class Web Monetization support](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/miles/web-monetization-in-peertube-grant-report-2-3jd6) via another GftW grantee’s project and making this available within Waasabi is something we are looking into.

[![Screenshot of the Peertube Waasabi plugin](https://i3.wp.com/web.archive.org/web/20220702224928im_/https://community.webmonetization.org/images/mJhhnp4xS_sboN8Kyb2auXx0VI7r3Q6BPSeVwjh9DLc/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy9kaXcw/ZG13YndwNGYxd2k0/ejl5ai5wbmc)](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/images/mJhhnp4xS_sboN8Kyb2auXx0VI7r3Q6BPSeVwjh9DLc/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy9kaXcw/ZG13YndwNGYxd2k0/ejl5ai5wbmc)

### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#configuring-waasabi-instances)Configuring Waasabi instances

Waasabi’s goal is to enable everyone create their own custom digital event experience. This means we need find ways to allow people create highly customized instances relatively easily.

[![Screenshot of the Waasabi Installer](https://i3.wp.com/web.archive.org/web/20220702224928im_/https://community.webmonetization.org/images/6YGfVpNwCgKJ6AwJwFNb5VQCCfsbWf4iGtpnztAdFo4/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy95eTA5/YzJ5bXY2bmZtdTJs/eWowdi5wbmc)](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/images/6YGfVpNwCgKJ6AwJwFNb5VQCCfsbWf4iGtpnztAdFo4/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy95eTA5/YzJ5bXY2bmZtdTJs/eWowdi5wbmc)

Our initial approach focuses on the _Waasabi Installer_, a [cross-platform command line tool](https://web.archive.org/web/20220702224928/https://github.com/baytechc/waasabi-init) focusing on the more technologically adept users of Waasabi. This tool allows configuring all of Waasabi’s features and generating a new instance, that can be ran locally for testing or deployed directly on a server.

Currently direct server/cloud deploys are not implemented yet, but the configuration files generated by this tool makes it rather trivial to run Waasabi on any cloud or webserver that is based on Debian, or one that at least can run Ubuntu containers or virtual machines.

Waasabi and the Installer runs well in WSL, so Windows users can also configure and test Waasabi instances before deployment.

### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#customizable-event-page-starter)Customizable event page starter

As noted before, Waasabi’s core provides an API to embed the live streaming functionality directly into one’s existing website. We plan to provide more “batteries-included” tools for this in the future (such as iframe-based integrations, and plugins for popular website tools, such as Wordpress), but currently this needs to be done manually.

[![Screenshots of various Waasabi live stream pages with distinct branding](https://i3.wp.com/web.archive.org/web/20220702224928im_/https://community.webmonetization.org/images/P3032ZwunhOEe_8XGtG0xS8_wo3AFiV-ElwcY2IsDtw/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy94ZjQz/NzJzemxodWtvZjho/YXE4MC5qcGc)](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/images/P3032ZwunhOEe_8XGtG0xS8_wo3AFiV-ElwcY2IsDtw/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy94ZjQz/NzJzemxodWtvZjho/YXE4MC5qcGc)

To make Waasabi usable even without the need for lengthy manual integration, we provide an out-of-box experience with the _Waasabi Live Page_. This interface can be configured under a subdomain of the existing website and provides complete functionality of Waasabi: streaming, Web Monetization, chat integrations and more. Some in-development upcoming features such as registered user management are coming soon as well.

The Live Page can be configured from the Installer, and its appearance can be further customized via “brand packages” that may override any of the content, CSS, images and other assets, and may even implement additional functionality via client-side JavaScript.

### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#chat-support)Chat support

One of Waasabi’s fundamental goals was stated to be:

> _"\[allow organizers to\] integrate their live events into their existing community infrastructure"_

Waasabi explicitly opts for not reinventing a wheel, and does not provide a built-in chat within the live stream page itself, but instead chooses to integrate with existing chat providers. Many communities who do live streaming already have an existing community chat which they often end up wanting to integrate with their live streaming platform of choice _anyway_, so Waasabi circumvents this by going the other way right off the bat.

[![Waasabi live stream displaying an incoming Matrix chat message overlaid on the stream](https://i3.wp.com/web.archive.org/web/20220702224928im_/https://community.webmonetization.org/images/gtpxRhAfYI8LNjsf26TSo8RgjZUPb5tbzsRL_WFqJ18/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy84cGxj/emZqZnNlbXV5dGdh/bzlhdy5qcGc)](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/images/gtpxRhAfYI8LNjsf26TSo8RgjZUPb5tbzsRL_WFqJ18/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy84cGxj/emZqZnNlbXV5dGdh/bzlhdy5qcGc)

Multiple integrations are planned for Waasabi, but the currently implemented one in the beta builds on the robust and fully open source [Matrix network](https://web.archive.org/web/20220702224928/https://matrix.org/). Currently this means messages sent on the linked chat rooms are relayed to the live stream.

Once the work-in-progress account management pieces land users will be able to join private channels from the Waasabi interface. This feature was initially used at RustFest Global, and allowed attendees to be added to specific conference channels automatically or on request. Ensuring proper access control of the event chat is really important (especially for publicly accessible live events), and allows hosts to perform better moderation, enforcement of the event’s code of conduct and keeping the conference chat safe for all participants.

As noted, we are still looking into integrating with more chat services, especially looking at Discord and Slack to allow event hosts to bring their existing community into their events, as well as use their events (meetups, streams, etc.) as a funnel to bring more community members onto their community chat of choice.

### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#ownership-amp-control)Ownership & control

Waasabi tries to offer as much flexibility on the axes of content ownership and full control as possible. Administrators of the instances can configure Waasabi with the Mux.com streaming backend provider for a reliable conventional streaming service, or choose Peertube and many other planned self-hosted video backends that fit their requirements. The framework allows for making these decisions in accordance with one’s requirements, expectations, scaling needs and other individual needs.

#### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#realtime-captions)Realtime captions

We are also experimenting with tools for automated captioning, improved transcripts and similar accessibility improvements. You may learn more about our experimental work as part of this grant to bring machine learning and speech recognition to Waasabi without third-party dependencies by reading [our last detailed report](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/automated-captions-for-everyone-with-waasabi-3522)!

[![](https://i3.wp.com/web.archive.org/web/20220702224928im_/https://i.giphy.com/media/f76R89pKixR2VQHARu/giphy.gif)](https://web.archive.org/web/20220702224928/https://i.giphy.com/media/f76R89pKixR2VQHARu/giphy.gif)

#### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#complete-control-over-content)Complete control over content

Waasabi exposes the low-level building blocks of live streaming. This has already made functionality like [instant replays](https://web.archive.org/web/20220702224928/https://rustfest.global/information/how-to-watch/#replays) and web monetization possible, and we are constantly experimenting how could we use these possibilities in novel, unconventional ways.

Waasabi is also embracing various peer-to-peer technologies in a form of [another grant](https://web.archive.org/web/20220702224928/https://nlnet.nl/project/Waasabi/). The Peertube video backend is one of the first early results of this effort. We strongly believe peer-to-peer technologies allow for better positioning these self-owned and individually controlled streaming hubs, further improving discovery, robustness and reach of the instances, allowing Waasabi to provide a viable alternative to large corporate silos.

#### [](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#extensibility)Extensibility

In the name of unparalleled flexibility we set out to encourage a Waasabi ecosystem of

> _“\[…\] a growing library of open source plugins and integrations  
> contributed back by the community building on Waasabi”_

There is no point of pushing for plugin development before the stabilization and proper documentation of Waasabi’s API, but once these pieces fall into place we are looking forward to people building new integrations and contributing back to the commons. Until then, of course, Waasabi instances can be customized in the ways mentioned further above, and of course bugfixes and feature contributions to Waasabi’s open source codebase are appreciated and encouraged as well.

[](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#communications-and-marketing)Communications and marketing
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

[Waasabi’s website](https://web.archive.org/web/20220702224928/https://waasabi.org/) has recently went live and is continuously being expanded with documentation, guides and updates. We are also waiting for Waasabi’s first branding to be delivered to dress the project into a brand new exciting and playful gown.

[Waasabi’s development live stream](https://web.archive.org/web/20220702224928/https://live.waasabi.org/) is currently offline as it is being upgraded to the latest Waasabi version, and shall be returning with development updates in the coming weeks.

We are constantly looking for early adopters interested in experimenting with this early release of the Waasabi suite (and are in contact with few already), and we plan to bring back the RustFest conference this fall, this time around using the open source Waasabi suite instead of the experimental version from 2020.

We are ready to answer any questions and discuss Waasabi’s future in our dedicated Matrix channel at [`#waasabi:baytech.community`](https://web.archive.org/web/20220702224928/https://matrix.to/#/#waasabi:baytech.community).

[](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#whats-next)What’s next?
---------------------------------------------------------------------------------------------------------------------------------------------------

The development of Waasabi continues, there are many things to look forward to!

*   Accounts and registrations (e.g. for ticketing)
*   An advanced event administration interface, provided by the “event-manager” Strapi plugin of the Waasabi template
*   Subscribe to events on the live page (email notifications, add-to-calendar, RSS and more)
*   P2P enhancements, distributed streaming and connecting to decentralized networks
*   Independent automatic captioning and transcript-augmentation via customizable machine learning detection
*   Further Web Monetization and Interledger-experiments using Rafiki

Some of these features above we plan to experiment with and test on our upcoming RustFest conference this fall, and other early-adopters.

[](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#what-community-support-would-benefit-your-project)What community support would benefit your project?
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Interested or have questions? Join our Matrix channel and talk to us!  
Want to run your own event? Please reach out, we’d love to help!  
Like what we are doing? Consider supporting the project on Open Collective.  
Find links to all of these channels below.

[](https://web.archive.org/web/20220702224928/https://community.webmonetization.org/waasabi/waasabi-final-grant-report-38l1#relevant-linksresources)Relevant links/resources
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

*   [Waasabi website](https://web.archive.org/web/20220702224928/https://waasabi.org/)
*   [Waasabi chatroom on Matrix](https://web.archive.org/web/20220702224928/https://matrix.to/#/#waasabi:baytech.community)
*   [Waasabi on Open Collective](https://web.archive.org/web/20220702224928/https://opencollective.com/waasabi)
*   [Waasabi open source components on GitHub](https://web.archive.org/web/20220702224928/https://github.com/baytechc/?q=waasabi)
