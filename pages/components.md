# Waasabi Components

A collection of the most important components of the Waasabi suite.

## `waasabi-config`
The repository for the `waasabi` tool on npm, the configuration CLI (commandline interface) of the Waasabi suite. It allows for easy bootstrapping, full customization and deployment of Waasabi instances using the `npx waasabi` shorthand command.

It is built in JavaScript (node.js) and relies on LXD (Linux Containers) and ngrok for local development and test deployments.

### `waasabi-init`

The configurator generates a file with various installation steps executed in the target environment by `waasabi-init`.

This tool is written in JavaScript (Deno) and the underlying configuration files will serve as future improvements such as a compile target for various other infrastructure provisioning dialects and DSL-s, as well as alternative ways of configuring and following the installation progress.

## `strapi-template-waasabi`

At the core of Waasabi is an administration interface and a powerful backend API provided by Strapi that implements the core features and acts as an intermediary (and chief source-of-truth) between the various cooperating components the instance is composed of.

Upon instance creation a brand new Strapi service is configured and launched from scratch, customizing the new instance with pre-existing endpoints and the `event-manager` plugin (that is not currently available separately, only as a part of this starter kit).

The new service takes care of providing an administration interface for furter configuration of the instance, management of the instance-provided content (such as events and schedule), managing streaming providers, scheduling and configuring live streams and serving the real-time API for the Waasabi Live frontend/live experience webapp.

###  `strapi-plugin-graphql`

Strapi, in it current version does not natively support exposing [lifecycle events](https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#models) as GraphQL Subscriptions natively. An important feature and service that Waasabi’s backend provides is aggregating incoming information from various sources and making it available through a GraphQL API in real-time using Web Sockets to the frontend application.

The above is currently accomplished by providing a custom version of Strapi’s built-in GraphQL plugin that replaces the native plugin with one with rudimentary GraphQL Subscriptions support. This provides a Web Sockets-based real-time GraphQL API for the `signals` endpoint of `events-manager` which then is able to signal the frontend clients

It is planned to explore replacing this solution in the future with a purpose-built Rust service that exposes new events in `signals` using built-in support for PostgreSQL `LISTEN`/`NOTIFY` and a very focused, minimal GraphQL-subscriptions-over-Web-Sockets service implementation.

This change is expected to:

- improve the performance of the signaling system
- allow for better sharding and load-balancing for high-traffic scenarios, with a stateless service and a central database source
- allow better metrics and health reporting for this crucial part of the Waasabi architecture (number of connected clients, message latency etc.)

## `waasabi-live`

This is the built-in event streaming page of Waasabi. In theory Waasabi supports embedding into any existing website, using practically any frontend build system or framework. The `waasabi-live` repository has two primary intentions:

1. to provide an out-of-the-box event streaming experience for those who are not interested in building or customizing their own
2. to be a project feature showcase and serve as experimentation grounds for features and UX considerations of online events – many of which we talked about in detail [at the project’s outset](https://community.webmonetization.org/waasabi/waasabi-live-event-framework-grant-report-1-8l1).

Even for those who decide not to integrate tightly the Waasabi suite deeply into an existing system, and instead use the provided `waasabi-live` experience this repository offers a very comprehensive *branding* functionality. This allows for a branding (“theming”) package to be provided at instance creation time that will override various portions of the baseline experience and is able to:

- provide custom images, fonts and other assets
- change and modify the page styling and colors through additions to the CSS configuration
- provide custom JavaScript components that integrate tightly into the Waasabi client experience
- override default page structure and content

Many aspects of the Waasabi Live page experience can be configured during initial setup and from the administration interface later, but the above options allow for virtually unlimited customization options without the need to fork or change the built-in files of the Live interface.

The `waasabi-live` component is built using HTML, CSS and JavaScript. The CSS authoring experience is enhanced by a pre-processing step that uses the popular PostCSS library and a small group of handy features to improve the maintainability of the stylesheets, while the HTML and JavaScript authoring experience uses template literals (`lit-html`) and Markdown to improve the developer experience. Both of these tools are chosen to provide an authoring experience as close to native HTML, CSS and JavaScript as possible, while enabling some modern development practices and reduce overhead.

The live experience builds from these source files through a build step that generates the final deployment artifacts in a form of a Single-Page Web Application (SPA). Given that the Live experience is focusing on providing an uninterrupted video live streaming experience, the SPA nature of the frontend and avoiding page navigations seemed an important goal and acceptable tradeoff.

The frontend attempts to minimize resource payload sizes as much as possible through the most modern CSS and JavaScript preprocessing steps, but unfortunately the bulk of the project weight comes from unavoidable or not-easily-replacable dependencies. Two main contributor to JavaScript size is the VideoJS library, used to provide HLS live streaming across browsers, while another one is the `apollo-client` GraphQL library used as a Subscriptions client for the incoming real-time signals. That said, it is under constant evaluation whether these (and other) dependencies can be avoided, or replaced, without detrimentally affecting the end user experience and thus removing some of the page weight.

## Waasabi Integrations

Beyond the core components of the Waasabi suite listed above, there are several add-on modules already available (and integrated into the Waasabi instance configurator) that allow interfacing with other systems, making them an integral part of the Waasabi experience.

One of the stated goals of the Waasabi suite is to provide unprecedented flexibility and a strong core experience to integrate various systems into an experience that the organizers/hosts of the Waasabi-serviced events have full control over. A major component of this strategy is to provide easily pluggable and configurable integrations to popular services, lowering the amount of components that need to be built for more fully-fledged and complex experiences.

### `waasabi-matrix`

The Waasabi suite plans to provide out-of-the-box integrations for various real time chat services to allow event organizers to bring their existing communities safely into their virtual event platform. The `waasabi-matrix` integration allows for tightly integrating the open source Matrix messaging platform with the Waasabi experience.

This integration goes beyond simply ferrying messages back-and-forth between Waasabi and the chat platform but comes with advanced features of moderation, private rooms and access control and allowing for the creation of community-owned rooms that can be exposed, organized and joined from the Waasabi live interface with ease. This allows for conversation to organically split into smaller groups without compromising the safety of the event, and opens nigh limitless possibilities towards interactivity when utilizing the two-way integration provided by the `waasabi-matrix` bot between the two systems.

The integration is the first component of the Waasabi suite that’s written entirely in the Rust programming language as an external service, and as such is reasonably self-contained, and can be used as a baseline for creating Matrix service bots for other usecases, or modified for specific usecases in custom Waasabi instances.

### `peertube-plugin-waasabi`

Complementing the commercial live streaming backends offered by the early versions of the Waasabi suite, the Waasabi Peertube integration is the first (in many) alternate video streaming providers that is entirely open source and self hosted on the Waasabi instance itself. This means that small events are now able to create an entirely self-contained experience with no external service dependencies and host events completely on their own terms without needing to rely (or share data) with external third parties.

Being a fully functional instance of the Peertube network, this video streaming backend option *also* provides access to a wide range of federated instances through the ActivityPub protocol, providing extra reach and community-federation and replication of recordings of the event to alleviate the resource pressure on the hosting server.

Provided as a separate component, the `peertube-plugin-waasabi` component is installed and configured automatically by the `waasabi-init` instance configuration tool whenever a new instance is created from scratch with built-in Peertube backend support, but can also be added through the Peertube plugin store to existing instances, and manually updating the Waasabi instance configuration to take advantage of the new backend.

The Peertube plugin is primarily written in JavaScript (node.js)

---

> Note: this document partially supersedes the [Waasabi Project Architecture](./architecture.md) document published earlier as it represents a later step in the project’s evolution. That said, the original document has relevancy for historical and project direction/ideation documentation purposes and thus will be preserved until this two documents can be consolidated a single cohesive document.