
## Introduction

Akash Network is a decentralized compute network designed to revolutionize how we use cloud computing. It offers users the ability to host their applications or train AI models, similar to services provided by AWS or Azure. However, unlike these centralized services, Akash is not controlled by a single entity. Instead, it allows anyone with a computer to offer their computing resources, creating a truly decentralized and democratized ecosystem. Akash ensures smooth operation and protection against malicious actors, positioning itself as the future compute layer of the internet, free from centralized control.

## Problem

Despite its potential, Akash Network faces a significant barrier to adoption. Users must create and manage crypto keys and fund them using platforms like Binance or other on-ramp providers, which can be cumbersome and intimidating for many. This complexity hinders the broader acceptance and utilization of Akash Network, preventing it from reaching its full potential as a decentralized compute solution.

## Solution

And to overcome this barrier, we propose a comprehensive architecture that simplifies the user experience and broadens access to Akash Network. How we believe Akash Network ecosystem will look like:

### Akash Architecture

![Akash Architecture.png](./images/Akash%20Architecture.png)

1. **Compute Providers**: The foundational layer consists of compute providers from around the globe, offering their resources to the network.

1. **Akash Network**: At the core, this blockchain-based layer manages compute providers, maintains consensus, provisions resources, and keeps records.

1. **Payment Processors**: Built on top of the Akash Network, this layer open a whole new potential for the ecosystem. It allows users to access Akash services without needing to hold cryptocurrencies. Instead, users can make payments through traditional methods such as native bank accounts, debit cards, and credit cards.

1. **Service Providers**: Akash is going to be the compute layer of the internet but it is a general protocol, some users require direct customer support, some want it to be specific and custom to their needs. And this will be done by service providers building on top of Akash Network. These service providers don't need to own & manage any compute infrastructure but just focus on solving problems of their customers.

1. **Akash Interface**: Users can also directly interact with Akash Network using it's native tools like web interface, cli tool, etc. 




### Payment Infrastructure Architecture
![Payment Architecture.png](./images/Payment%20Architecture.png)


Our payment infrastructure is designed to streamline user interactions with Akash Network, making it more accessible and user-friendly. This architecture comprises several key components, each playing a vital role in ensuring a seamless and secure payment experience. The diagram provided illustrates the overall structure and interaction of these components.

#### 1. Payment Connector

The Payment Connectort acts as a bridge between Akash Network and various payment gateways. It is designed with the following features:

- **Plugin-Based Integration**: The Payment Connector can integrate with multiple payment gateways by utilizing a plugin system. This flexibility allows for the creation of custom plugins that cater to specific payment gateways, ensuring compatibility with a wide range of payment methods, such as Stripe and PayPal.
- **Global Payment Methods**: Users can pay using their preferred methods, including native payment options available in their respective countries. This includes traditional methods such as bank transfers, debit cards, and credit cards, as well as digital wallets and other local payment solutions.

#### 2. Refunds

To build trust and ensure user satisfaction, our payment infrastructure includes a robust refund mechanism:

- **User-Friendly Process**: Users who are not satisfied with the service can easily request a refund. The process is straightforward and designed to minimize inconvenience, ensuring that users feel confident in their ability to get their money back if necessary.
- **Token-Based Refunds**: Refunds are processed by returning unused tokens. This ensures that users are compensated for any unused service credits, maintaining fairness and transparency.
- **Automated Refund System**: The system can handle refund requests automatically, reducing the need for manual intervention and speeding up the process for users.

#### 3. Chargebacks

Chargebacks are one of the most difficult and important parts to handle in Web2 transactions, where users can get refunds even if they purposely made the transaction. Our solution is to tackle this with proper on-chain governance, where issued tokens are reclaimed if the payment is refunded, and the chargeback fees are either distributed or handled by the provider
#### 4. Exchanger


The Exchanger is a critical component that securely holds both Akash crypto and fiat assets and facilitates easy conversion between them:

  

• **Secure Asset Management**: The Exchanger securely manages both crypto and fiat assets, ensuring that they are protected against unauthorized access and theft.

• **Currency Conversion**: Users can seamlessly convert between Akash crypto and fiat currencies, enhancing the flexibility and usability of the network. This is particularly important for users who prefer to transact in fiat but still wish to utilize Akash services.


#### 5. Authenticator and Key Manager

The Authenticator component manages private keys using Web2 authentication methods, relieving users of the burden of managing them:

  

• **Web2 Authentication**: By leveraging familiar Web2 authentication methods, such as OAuth, users can securely manage their private keys without needing to handle them directly. This simplifies the user experience and reduces the risk of key management errors.


• **Multi-Factor Authentication (MFA)**: To enhance security, the Authenticator supports multi-factor authentication, requiring users to provide multiple forms of verification before completing a transaction.
#### 6. Database

The Database component stores essential information such as user data, payment history, and transaction records:

- **User Data Management**: Ensures the secure storage and management of user information, supporting personalized services and efficient account management.
- **Payment History**: Maintains a detailed record of all transactions, enabling users to track their payment history and facilitating transparent record-keeping.


### How It Works

- **User Interaction**: Users access Akash services through the web interface or service providers, leveraging the Payment Connector to choose their preferred payment method.
- **Payment Processing**: The Payment Connector handles transactions, integrating with various gateways and utilizing the Exchanger for conversion. Refunds and chargebacks are managed efficiently, ensuring user satisfaction and trust.
- **Security and Decentralization**: The Authenticator ensures secure and authenticated transactions, while the decentralized nature of the payment processor code ensures no dependency on a single entity, supporting custom payment methods and enhancing security.

### How It Is Different from On-Ramp Providers

- **Native Support**: Natively supports Akash tokens and its network, providing seamless integration.
- **Flexibility**: Offers high flexiblility and customizable functionality
- **No Charges**: Unlike traditional services, it operates without charges, enhancing cost-effectiveness.
- **Decentralization**: Not dependent on any single entity, offering high control and security.

### Who can deploy payment processor?
The code of the payment processor will be public and will allow anyone to deploy the service., this makes sure that no one is dependent on a single entity plus anyone can deploy to support custom payment methods, for example - a service provider may allow his clients monthly payments without any upfront deposit


## Impact

The proposed solution will have a profound impact on various stakeholders within the ecosystem, enhancing the overall utility and adoption of Akash Network. Here’s how:

### Benefits to Users

- **Ease of Use**: By eliminating the need for users to manage crypto keys and funding through complex on-ramp providers, our solution makes accessing Akash Network services much more straightforward. Users can leverage familiar payment methods such as bank accounts, debit cards, and credit cards, significantly lowering the barrier to entry.
- **Security and Trust**: With built-in features like refunds and chargebacks, users have greater confidence in the system. They can trust that their transactions are secure and that they have recourse in the event of a problem.
- **Flexibility**: The ability to use multiple payment methods and currencies makes Akash Network more adaptable to the needs of a global user base, enhancing its appeal and usability.

### Benefits to Service Providers

- **Customization and Support**: Service providers can build on top of Akash Network to offer tailored solutions and direct customer support without the need to manage underlying compute infrastructure. This focus on specific user needs can drive innovation and customer satisfaction.
- **Business Opportunities**: By leveraging the decentralized nature of Akash Network, service providers can create new business models and revenue streams, offering unique services that differentiate them in the market.

### Benefits to Compute Providers

- **Expanded Market**: Compute providers can tap into a broader market by participating in a decentralized network. They can offer their resources to a diverse set of users and applications, increasing their utilization rates and potential earnings.
- **Decentralized Control**: The decentralized nature of Akash Network ensures that no single entity controls the infrastructure, providing a level playing field for all compute providers.

### Overall Ecosystem Impact

- **Enhanced Adoption**: Simplifying the payment and access process will drive broader adoption of Akash Network, demonstrating the practical benefits of decentralized cloud computing.
- **Innovation and Resilience**: Decentralization fosters innovation by allowing multiple entities to build on the network and offer diverse solutions. It also enhances resilience by eliminating single points of failure, making the infrastructure more robust and secure.
- **Reduced Centralization**: By providing a viable alternative to traditional, centralized cloud services, Akash Network can reduce the reliance on major cloud providers, promoting a more decentralized and democratized internet.

## Is It Centralized?

No, the Akash Network is inherently decentralized. The payment processor code is public, enabling anyone to deploy and support custom payment methods. This decentralization ensures that the network is not reliant on any single entity, enhancing security and resilience.

