# 2021-05-27-update-chat-integrations

* https://opencollective.com/waasabi/updates/waasabi-development-update-chat-integrations
* https://community.webmonetization.org/waasabi/waasabi-development-update-chat-integrations-5h8p
* https://web.archive.org/web/20220703001340/https://community.webmonetization.org/waasabi/waasabi-development-update-chat-integrations-5h8p



Waasabi development update: Chat Integrations
=============================================

![Cover image for Waasabi development update: Chat Integrations](https://i3.wp.com/web.archive.org/web/20220703001340im_/https://community.webmonetization.org/images/PritQoNfi_lxzlFnpgK5SlBVsCHrIdLCY32a9HWrpBE/s:1000:420/mb:500000/ar:1/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy85djB6/a3E0cTc2N3QxM3Mx/MWV1ZS5qcGc)

[![Waasabi profile image](https://i3.wp.com/web.archive.org/web/20220703001340im_/https://community.webmonetization.org/images/QzeaRTDkc3mzp1AVdqhoGu-YmvKS2X3ysrQhx6plw30/rs:fill:50:50/mb:500000/ar:1/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9v/cmdhbml6YXRpb24v/cHJvZmlsZV9pbWFn/ZS83MS9iMzczMGNl/ZC01ZGZhLTRhNTct/ODI1MC1jNzAwM2Y2/NmM0Y2YucG5n)](https://web.archive.org/web/20220703001340/https://community.webmonetization.org/waasabi) [![Flaki](https://i3.wp.com/web.archive.org/web/20220703001340im_/https://community.webmonetization.org/images/BiZZrGPx-Swm4Ldq-HrZF61DjqDBgYVssLqnpBNRg3k/rs:fill:50:50/mb:500000/ar:1/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy91/c2VyL3Byb2ZpbGVf/aW1hZ2UvMzQ0L2Q0/OTJmMDE5LTNmOTQt/NDc4NS05MGZjLTM0/MDQxN2Q2MTQ3MS5q/cGc)](https://web.archive.org/web/20220703001340/https://community.webmonetization.org/flaki)

> _Quick update after field-testing one of Waasabi's upcoming chat integration feature on Monday's [Berline.rs Meetup](https://web.archive.org/web/20220703001340/https://live.berline.rs/)!_

The Waasabi framework intentionally leaves the well known "stream chat" functionality out of the package. The reason for this is not just the sheer complexity of implementing an accessible and abuse-resistant chat client, but is also based on the observation that most communities in Waasabi's target group will _already have_ a chat system they were be using for the community and integrating these would be preferable than a wholly new, separate system just for the chat accompanying the stream.

> — RustFest (@RustFest) [November 2, 2020](https://web.archive.org/web/20220703001340/https://twitter.com/RustFest/status/1323334120483770370?ref_src=twsrc%5Etfw)

An early prototype of Waasabi's chat integration from RustFest Global 2020

Access control and moderation of the stream chat is also an ever-present issue: to prevent abuse, some kind of access control for the chat is desirable for most communities. With existing event platforms, we have often found support for this lacking and reek with privacy compromises. That said, there is clear vlaue in providing frictionless access to the discussion even to those who may not want to join the chat channels for the broadcast: we accomplish this by displaying the ongoing discussion in a read-only fashion on the stream. As it is often with these things, this ends up being a balancing act and matter of personal preference, and so we are still experimenting with the best approach to exposing this feature in the user interface.

[![Screenshot of the Berline.rs live stream, showing a closed captions-style overlay of a chat message](https://i3.wp.com/web.archive.org/web/20220703001340im_/https://community.webmonetization.org/images/IZR3YtPM649vnLLCLKAXddbnYukWwWKZO99nnNNgZzU/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy9hYm1h/Z2FkaHd3cXBwYjg0/ZjQ2MC5qcGc)](https://web.archive.org/web/20220703001340/https://community.webmonetization.org/images/IZR3YtPM649vnLLCLKAXddbnYukWwWKZO99nnNNgZzU/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy9hYm1h/Z2FkaHd3cXBwYjg0/ZjQ2MC5qcGc)

Chat messages are relayed in real time and display on the Waasabi page

For every community out there, there is a plethora of community platforms to choose from. Waasabi's chat support thus has been designed with a high degree of modularity and freedom in mind: by exposing a generalized Chat API that accepts new chat messages over a regular HTTP endpoint we can support various services through _chat integration plugins_. These plugins are usually external services that act as bridges between the network in question and Waasabi's backend, which takes care of forwarding incoming messages to clients following the active broadcast.

[![The logo of the Ruma framework](https://i3.wp.com/web.archive.org/web/20220703001340im_/https://community.webmonetization.org/images/Yc_pDQpAeHBymtwroJZaSgxfGZ7vZMP-02t_StTt2_M/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy9kMW5k/Y25ucm41NXQzcTQ0/d2h3OS5wbmc)](https://web.archive.org/web/20220703001340/https://community.webmonetization.org/images/Yc_pDQpAeHBymtwroJZaSgxfGZ7vZMP-02t_StTt2_M/w:880/mb:500000/aHR0cHM6Ly9jb21t/dW5pdHkud2VibW9u/ZXRpemF0aW9uLm9y/Zy9yZW1vdGVpbWFn/ZXMvdXBsb2Fkcy9h/cnRpY2xlcy9kMW5k/Y25ucm41NXQzcTQ0/d2h3OS5wbmc)

Waasabi's first such bridge integrates with the [Matrix network](https://web.archive.org/web/20220703001340/https://www.matrix.org/). The plugin is written in the [Rust programming language](https://web.archive.org/web/20220703001340/https://www.rust-lang.org/), and relies heavily on the [Ruma framework](https://web.archive.org/web/20220703001340/https://www.ruma.io/) for communicating with the Matrix network. Developed by [Jan-Erik Rediger](https://web.archive.org/web/20220703001340/https://twitter.com/badboy_/) to support the RustFest Global event in 2020, the Matrix integration is currently undergoing work to bring its [full feature set](https://web.archive.org/web/20220703001340/https://rustfest.global/information/how-to-chat/), such as private invites and handling of multiple rooms to Waasabi for the upcoming first public release.

Other integrations are also planned, Discord and Slack are two networks we are actively looking into bridging early on, but thanks to the open nature of Waasabi's API, it should be relatively easy for adopters of the framework to bridge any other network to their instance, even if Waasabi may not have out-of-the-box support for them.
