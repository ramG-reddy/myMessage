# Project Overview: Real-Time Chat Application with GraphQL Pub/Sub

## Objective

To implement real-time features using a production-grade stack with pub/sub.

## Tech Stack

* **TypeScript:** Ensures type safety throughout the application.
* **Next.js:** Frontend framework supporting SSR (Server-Side Rendering).
* **Apollo (Client/Server):** Facilitates interaction with the GraphQL API.
* **GraphQL:** Offers type safety and precise data retrieval, reducing backend calls.
* **NextAuth:** Utilized for Google OAuth implementation.
* **Prisma:** ORM for simplified database manipulation.
* **MongoDB:** Chosen as the solid database solution.

## Features

* **Real-time updates:** Pub/Sub architecture ensures instant message delivery for chat functionality.
* **Last Seen Message:** Shows the latest message in each conversation for better context.
* **Secure Authentication:** Google OAuth provides robust security measures for user login.
* **Faster Load Times:** Apollo Cache optimizes data fetching and improves application performance.
* **Type-Safe Stack:** TypeScript and GraphQL enhance code reliability and minimize errors.
* **Version Control:** Git enables efficient code management, collaboration, and scalability.

## Working

* Next.js serves as the frontend, comprising Google sign-in, a conversation sidebar, and a conversation modal. UI development involved significant efforts to ensure responsiveness and attractiveness.
* Handling various types such as type definitions, resolvers, queries, mutations, etc., was time-consuming but crucial for integration.
* Notable contributions include implementing the 'last seen message' logic, mainly handled by Ram and Dachireddy. One focused on backend integration, while the other tackled design and responsiveness.
* NextAuth handles authentication and session management, integrated with Prisma for database operations.

## Apollo Client/Server

* Divided into two parts, Apollo client and Apollo server, communicating via the GraphQL API and MongoDB.
* Apollo client resides on the frontend, while Apollo server operates on the backend.
* Utilizes Apollo's caching feature to optimize data fetching, especially beneficial with MongoDB hosted on the cloud (MongoDB Atlas).
* Apollo server validates types and processes queries, mutations, etc., while Apollo client initiates requests to the backend.

## Apollo Client/Server Contribution

* Bhardwaj and Rishikesh collaborated on developing the Apollo client/server components. Bhardwaj focused on the client side, while Rishikesh handled the server side.
* Together, they optimized queries to enhance efficiency, facilitating smoother data fetching processes.
* Their joint effort ensured effective caching mechanisms within the frontend, leveraging Apollo's caching features.

## Apollo Caching

* **Reduced Network Traffic:** Apollo's caching minimizes the need for repeated network requests by storing previously fetched data locally. This reduces unnecessary data transfer and improves application performance.
* **Optimized Data Fetching:** By caching responses, subsequent requests for the same data can be served directly from the cache, eliminating the need for redundant server calls. This leads to faster load times and a more responsive user experience.
* **Normalized Data Structure:** Apollo's cache normalizes data, ensuring that it is efficiently stored and retrieved. This normalization simplifies data management and reduces memory overhead.
* **Customizable Cache Policies:** Developers can customize cache eviction policies based on application requirements. This flexibility allows for fine-tuning cache behavior to suit specific use cases and optimize resource utilization.

## Reasons for Using GraphQL

* GraphQL provides type safety and efficient data retrieval, reducing unnecessary calls to the backend.
* Prisma, coupled with MongoDB, offers a robust backend solution for the real-time chat application.

## GraphQL Pub/Sub vs WebSockets

### Pub/Sub:

* **Functionality:** Pub/Sub is a messaging pattern where senders (publishers) of messages do not program the messages to be sent directly to specific receivers (subscribers). Instead, the publisher categorizes messages into classes without knowledge of any subscribers.
* **Usage:** Pub/Sub is commonly used for implementing real-time messaging systems, event-driven architectures, and distributed systems where components need to communicate without direct knowledge of each other.
* **Scalability:** Pub/Sub systems can be highly scalable, as they can handle a large number of subscribers across different topics or channels.

### WebSockets:

* **Functionality:** WebSockets is a communication protocol that provides full-duplex communication channels over a single TCP connection. It enables bidirectional communication between clients and servers.
* **Usage:** WebSockets are commonly used for real-time web applications where instant updates are required, such as chat applications, online gaming, or live data streaming.
* **Efficiency:** WebSockets can be more efficient for real-time communication compared to traditional HTTP polling or long-polling techniques, as they maintain a persistent connection between the client and server.

## Choosing Between Pub/Sub and WebSockets

* **Pub/Sub:** Suited for scenarios where you have multiple subscribers interested in receiving updates on certain topics or events, without requiring direct connections between publishers and subscribers. It's great for decoupling components in distributed systems.
* **WebSockets:** Suited for scenarios where you need real-time bidirectional communication between clients and servers, such as live updates or interactive applications.



## Choosing Between Pub/Sub and WebSockets

* **Pub/Sub:** Suited for scenarios where you have multiple subscribers interested in receiving updates on certain topics or events, without requiring direct connections between publishers and subscribers. It's great for decoupling components in distributed systems.
* **WebSockets:** Suited for scenarios where you need real-time bidirectional communication between clients and servers, such as live updates or interactive applications.

Project Set Up Instructions in the READMEs of respective directories.
