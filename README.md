# 💍 SahaJeevan — Matrimony Platform

> A full-stack matrimony platform designed to connect individuals based on profile information, partner preferences, interests, and matchmaking criteria, with secure authentication, real-time communication, notifications, and membership-based features.

---

# 📑 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)

  * [Authentication & Security](#-authentication--security)
  * [Profile Management](#-profile-management)
  * [Matchmaking](#-matchmaking)
  * [Interest Requests](#-interest-requests)
  * [Real-Time Messaging](#-real-time-messaging)
  * [Voice Calling](#-voice-calling)
  * [Push Notifications](#-push-notifications)
  * [Email Notifications](#-email-notifications)
  * [Membership & Package System](#-membership--package-system)
  * [Blocking & Shortlisting](#-blocking--shortlisting)
* [System Architecture](#️-system-architecture)
* [Tech Stack](#️-tech-stack)
* [Project Structure](#-project-structure)
* [Core Backend Modules](#-core-backend-modules)

  * [Authentication Module](#authentication-module)
  * [Profile Module](#profile-module)
  * [Matchmaking Module](#matchmaking-module)
  * [Interest Request Module](#interest-request-module)
  * [Messaging Module](#messaging-module)
* [Performance Optimizations](#-performance-optimizations)
* [Security](#-security)
* [Testing](#-testing)
* [API Documentation](#-api-documentation)
* [Notification Architecture](#-notification-architecture)
* [Environment Variables](#️-environment-variables)
* [Installation & Setup](#-installation--setup)
* [API Flow Example](#-api-flow-example)
* [Major Backend Responsibilities](#-major-backend-responsibilities)
* [Engineering Highlights](#-engineering-highlights)
* [Development Tools](#️-development-tools)
* [Project Impact](#-project-impact)
* [My Contribution](#️-my-contribution)
* [What I Learned](#-what-i-learned)
* [Future Improvements](#-future-improvements)
* [License](#-license)
* [Project Highlights](#-project-highlights)

---

# 📌 Overview

**SahaJeevan** is a production-oriented matrimony application that provides users with a complete platform to discover compatible profiles, express interest, communicate with matches, and manage their matrimonial preferences.

The backend was developed using **Node.js, Express.js, MongoDB, Firebase, ZEGOCLOUD, Brevo, Jest, and Swagger/OpenAPI**, with a strong focus on security, performance, scalability, and real-world business logic.

The system supports everything from **OTP-based authentication and profile management to matchmaking, interest requests, real-time messaging, voice calling, email notifications, and membership-based request limits.**

---

# ✨ Key Features

## 🔐 Authentication & Security

* User registration and login
* OTP-based authentication and verification
* Secure session/token management
* HTTP-only cookies
* Refresh token rotation
* Rate limiting
* Request validation using Zod
* Protected API routes
* Secure password handling
* Authentication middleware
* Logout and session invalidation

---

## 👤 Profile Management

Users can create and manage detailed matrimonial profiles containing information such as:

* Basic details
* Gender
* Date of birth
* Height
* Religion
* Caste
* Sub-caste
* Qualification
* Occupation
* Annual income
* Mother tongue
* Location
* Profile photo
* About/bio
* Partner preferences

The application also supports profile updates and account-related operations.

---

## 💕 Matchmaking

SahaJeevan provides profile discovery based on matrimonial preferences.

The matchmaking system supports:

* Partner preference filtering
* Gender-based matching
* Age preferences
* Height preferences
* Religion preferences
* Caste/sub-caste preferences
* Qualification preferences
* Occupation preferences
* Income preferences
* Mother tongue preferences
* Similar-profile matching
* Exclusion of blocked profiles
* Exclusion of profiles that have already been interacted with

If explicit partner preferences are unavailable, the system can fall back to **profile similarity-based matching**.

---

## ❤️ Interest Requests

Users can express interest in compatible profiles.

The system handles:

* Sending interest requests
* Accepting interest requests
* Rejecting interest requests
* Pending requests
* Interest-request limits
* Daily interest-request limits
* Membership/package-based restrictions
* Preventing duplicate requests
* Preventing requests to blocked users
* Preventing requests to inappropriate/ineligible profiles

Interest limits are dynamically enforced based on the user's assigned package.

---

## 💬 Real-Time Messaging

The application provides real-time communication between users.

Messaging functionality includes:

* Real-time conversations
* Message persistence
* User-to-user communication
* Interest-based messaging restrictions
* Message access based on interest status
* Firebase-based messaging infrastructure

A user has restricted messaging capability while an interest request is pending, with broader communication access once the request is accepted.

---

## 📞 Voice Calling

SahaJeevan integrates **ZEGOCLOUD** to provide voice communication between users.

Features include:

* Voice calling
* Real-time communication
* User-specific call sessions
* Integration with the application's authentication and user system

---

## 🔔 Push Notifications

Push notifications are implemented using **Firebase Cloud Messaging (FCM)**.

The notification system supports events such as:

* New interest requests
* Interest acceptance/rejection
* New messages
* Match notifications
* Other user activity

Users register their FCM device token after authentication so notifications can be delivered to their devices.

---

## 📧 Email Notifications

Transactional email notifications are implemented using **Brevo**.

Supported email notification categories include:

### Membership Notifications

* Membership expiry alerts

### Match Notifications

* New matching profiles
* Similar profile recommendations

### Contact Notifications

* Contact/message alerts

### Photo Notifications

* Requests to upload a profile photo

The email notification system is designed to deliver relevant notifications based on user preferences.

---

## 📦 Membership & Package System

The platform supports membership/package-based feature restrictions.

Package functionality includes:

* Total interest request limits
* Daily interest request limits
* Package-based feature access
* Request validation
* Membership expiry handling

The backend validates package limits before allowing an interest request.

---

## 🚫 Blocking & Shortlisting

Users can manage profiles using:

* Block profile
* Unblock profile
* Shortlist profile
* Remove from shortlist

Blocked users are excluded from relevant profile discovery and interaction flows.

The matchmaking system also handles profiles that have:

* Been blocked by the user
* Blocked the user
* Already received an interest request
* Already been shortlisted
* Already been interacted with

---

# 🏗️ System Architecture

The application follows a backend-driven architecture where the client communicates with the Express.js REST API, which handles authentication, business logic, database operations, and integrations with external services.

The backend communicates with:

* **MongoDB** for data persistence
* **Firebase** for push notifications and messaging
* **ZEGOCLOUD** for voice calling
* **Brevo** for transactional emails

---

# 🛠️ Tech Stack

## Backend

* **Node.js**
* **Express.js**
* **TypeScript**
* **MongoDB**
* **Mongoose**

## Authentication & Validation

* JWT
* HTTP-only Cookies
* Refresh Tokens
* Zod
* Rate Limiting

## Communication

* Firebase Cloud Messaging
* Firebase Admin SDK
* ZEGOCLOUD
* Real-time messaging

## Email

* Brevo Transactional Email API

## Testing

* Jest
* Unit Testing
* Integration Testing

## API Documentation

* Swagger
* OpenAPI

## Performance

* MongoDB Indexing
* Lean Queries
* Gzip Compression
* Server Ping/Keep-alive Mechanism

## DevOps

* CI/CD
* Automated Testing

---

# 📂 Project Structure

```text
📦src
 ┣ 📂app
 ┃ ┣ 📂config
 ┃ ┃ ┣ 📂firebase
 ┃ ┃ ┃ ┗ 📜serviceAccountKey.json
 ┃ ┃ ┣ 📜cloudinary.ts
 ┃ ┃ ┣ 📜firebase.service.ts
 ┃ ┃ ┣ 📜firebase.ts
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┣ 📜razorpay.ts
 ┃ ┃ ┣ 📜swagger.ts
 ┃ ┃ ┗ 📜zegocloud.ts
 ┃ ┣ 📂enums
 ┃ ┃ ┣ 📜interest-status.enum.ts
 ┃ ┃ ┣ 📜message-status.enum.ts
 ┃ ┃ ┣ 📜message-type.enum.ts
 ┃ ┃ ┗ 📜report-reason.enum.ts
 ┃ ┣ 📂errors
 ┃ ┃ ┣ 📜appError.ts
 ┃ ┃ ┣ 📜handleCastError.ts
 ┃ ┃ ┣ 📜handleDuplicateError.ts
 ┃ ┃ ┣ 📜handleValidationError.ts
 ┃ ┃ ┗ 📜handleZodError.ts
 ┃ ┣ 📂interface
 ┃ ┃ ┗ 📜error.interface.ts
 ┃ ┣ 📂job
 ┃ ┃ ┗ 📜membershipExpiryJob.ts
 ┃ ┣ 📂middlewares
 ┃ ┃ ┣ 📜authMiddleware.ts
 ┃ ┃ ┣ 📜globalErrorHandler.ts
 ┃ ┃ ┗ 📜notFound.ts
 ┃ ┣ 📂modules
 ┃ ┃ ┣ 📂account-settings
 ┃ ┃ ┃ ┣ 📂notifications
 ┃ ┃ ┃ ┃ ┗ 📜notifications.controllers.ts
 ┃ ┃ ┃ ┣ 📜accountSettings.controller.ts
 ┃ ┃ ┃ ┣ 📜accountSettings.interface.ts
 ┃ ┃ ┃ ┣ 📜accountSettings.model.ts
 ┃ ┃ ┃ ┣ 📜accountSettings.routes.ts
 ┃ ┃ ┃ ┗ 📜accountSettings.validation.ts
 ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┣ 📂about-us
 ┃ ┃ ┃ ┃ ┣ 📜aboutUs.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜aboutUs.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜aboutUs.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜aboutUs.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜aboutUs.validation.ts
 ┃ ┃ ┃ ┣ 📂admin-auth
 ┃ ┃ ┃ ┃ ┣ 📜adminAuth.controller.ts
 ┃ ┃ ┃ ┃ ┣ 📜adminAuth.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜adminAuth.validation.ts
 ┃ ┃ ┃ ┣ 📂annual-income
 ┃ ┃ ┃ ┃ ┣ 📜annualIncome.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜annualIncome.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜annualIncome.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜annualIncome.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜annualIncome.validation.ts
 ┃ ┃ ┃ ┣ 📂contact-us
 ┃ ┃ ┃ ┃ ┣ 📜contactUs.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜contactUs.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜contactUs.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜contactUs.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜contactUs.validation.ts
 ┃ ┃ ┃ ┣ 📂faq
 ┃ ┃ ┃ ┃ ┣ 📜faq.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜faq.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜faq.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜faq.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜faq.validation.ts
 ┃ ┃ ┃ ┣ 📂height
 ┃ ┃ ┃ ┃ ┣ 📜height.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜height.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜height.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜height.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜height.validation.ts
 ┃ ┃ ┃ ┣ 📂hero-banner
 ┃ ┃ ┃ ┃ ┣ 📜heroBanner.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜heroBanner.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜heroBanner.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜heroBanner.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜heroBanner.validation.ts
 ┃ ┃ ┃ ┣ 📂location
 ┃ ┃ ┃ ┃ ┣ 📜location.controller.ts
 ┃ ┃ ┃ ┃ ┣ 📜location.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜location.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜location.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜location.validation.ts
 ┃ ┃ ┃ ┣ 📂mother-tongue
 ┃ ┃ ┃ ┃ ┣ 📜motherTongue.controller.ts
 ┃ ┃ ┃ ┃ ┣ 📜motherTongue.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜motherTongue.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜motherTongue.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜motherTongue.validation.ts
 ┃ ┃ ┃ ┣ 📂occupation
 ┃ ┃ ┃ ┃ ┣ 📜occupation.controller.ts
 ┃ ┃ ┃ ┃ ┣ 📜occupation.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜occupation.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜occupation.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜occupation.validation.ts
 ┃ ┃ ┃ ┣ 📂press
 ┃ ┃ ┃ ┃ ┣ 📜press.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜press.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜press.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜press.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜press.validation.ts
 ┃ ┃ ┃ ┣ 📂privacy-policy
 ┃ ┃ ┃ ┃ ┣ 📜privacyPolicy.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜privacyPolicy.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜privacyPolicy.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜privacyPolicy.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜privacyPolicy.validation.ts
 ┃ ┃ ┃ ┣ 📂profile
 ┃ ┃ ┃ ┃ ┣ 📜profile.controller.ts
 ┃ ┃ ┃ ┃ ┗ 📜profile.routes.ts
 ┃ ┃ ┃ ┣ 📂qualification
 ┃ ┃ ┃ ┃ ┣ 📜qualification.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜qualification.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜qualification.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜qualification.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜qualification.validation.ts
 ┃ ┃ ┃ ┗ 📂religion
 ┃ ┃ ┃ ┃ ┣ 📂caste
 ┃ ┃ ┃ ┃ ┃ ┣ 📂sub-caste
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜subCaste.controllers.ts
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜subCaste.interface.ts
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜subCaste.model.ts
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜subCaste.routes.ts
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜subCaste.validation.ts
 ┃ ┃ ┃ ┃ ┃ ┣ 📜caste.controllers.ts
 ┃ ┃ ┃ ┃ ┃ ┣ 📜caste.interface.ts
 ┃ ┃ ┃ ┃ ┃ ┣ 📜caste.model.ts
 ┃ ┃ ┃ ┃ ┃ ┣ 📜caste.routes.ts
 ┃ ┃ ┃ ┃ ┃ ┗ 📜caste.validation.ts
 ┃ ┃ ┃ ┃ ┣ 📜religion.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜religion.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜religion.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜religion.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜religion.validation.ts
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📂otp
 ┃ ┃ ┃ ┃ ┣ 📜otp.interface.ts
 ┃ ┃ ┃ ┃ ┗ 📜otp.model.ts
 ┃ ┃ ┃ ┣ 📜auth.constants.ts
 ┃ ┃ ┃ ┣ 📜auth.controller.ts
 ┃ ┃ ┃ ┣ 📜auth.interface.ts
 ┃ ┃ ┃ ┣ 📜auth.model.ts
 ┃ ┃ ┃ ┣ 📜auth.routes.ts
 ┃ ┃ ┃ ┗ 📜auth.validation.ts
 ┃ ┃ ┣ 📂health
 ┃ ┃ ┃ ┣ 📜health.controller.ts
 ┃ ┃ ┃ ┗ 📜health.route.ts
 ┃ ┃ ┣ 📂onBoarding
 ┃ ┃ ┃ ┣ 📜onBoarding.controller.ts
 ┃ ┃ ┃ ┣ 📜onBoarding.interface.ts
 ┃ ┃ ┃ ┣ 📜onBoarding.model.ts
 ┃ ┃ ┃ ┣ 📜onBoarding.routes.ts
 ┃ ┃ ┃ ┗ 📜onBoarding.validation.ts
 ┃ ┃ ┣ 📂package
 ┃ ┃ ┃ ┣ 📜package.controllers.ts
 ┃ ┃ ┃ ┣ 📜package.interface.ts
 ┃ ┃ ┃ ┣ 📜package.model.ts
 ┃ ┃ ┃ ┣ 📜package.routes.ts
 ┃ ┃ ┃ ┗ 📜package.validation.ts
 ┃ ┃ ┣ 📂payment
 ┃ ┃ ┃ ┣ 📜payment.controllers.ts
 ┃ ┃ ┃ ┣ 📜payment.interface.ts
 ┃ ┃ ┃ ┣ 📜payment.model.ts
 ┃ ┃ ┃ ┣ 📜payment.routes.ts
 ┃ ┃ ┃ ┣ 📜payment.service.ts
 ┃ ┃ ┃ ┗ 📜payment.validation.ts
 ┃ ┃ ┣ 📂profile-details
 ┃ ┃ ┃ ┣ 📂block
 ┃ ┃ ┃ ┃ ┣ 📜block.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜block.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜block.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜block.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜block.validation.ts
 ┃ ┃ ┃ ┣ 📂call
 ┃ ┃ ┃ ┃ ┣ 📜call.controller.ts
 ┃ ┃ ┃ ┃ ┣ 📜call.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜call.validation.ts
 ┃ ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┃ ┣ 📜chat.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜chat.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜chat.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜chat.validation.ts
 ┃ ┃ ┃ ┣ 📂ignore
 ┃ ┃ ┃ ┃ ┣ 📜ignore.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜ignore.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜ignore.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜ignore.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜ignore.validation.ts
 ┃ ┃ ┃ ┣ 📂in-app-notifications
 ┃ ┃ ┃ ┃ ┣ 📜inAppNotification.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜inAppNotifications.controller.ts
 ┃ ┃ ┃ ┣ 📂interest
 ┃ ┃ ┃ ┃ ┣ 📜interest.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜interest.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜interest.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜interest.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜interest.validation.ts
 ┃ ┃ ┃ ┣ 📂notification
 ┃ ┃ ┃ ┃ ┣ 📜notification.controller.ts
 ┃ ┃ ┃ ┃ ┣ 📜notification.routes.ts
 ┃ ┃ ┃ ┃ ┣ 📜notification.service.ts
 ┃ ┃ ┃ ┃ ┗ 📜notification.validation.ts
 ┃ ┃ ┃ ┣ 📂partner-preference
 ┃ ┃ ┃ ┃ ┣ 📜partnerPreference.controller.ts
 ┃ ┃ ┃ ┃ ┣ 📜partnerPreference.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜partnerPreference.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜partnerPreference.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜partnerPreference.validation.ts
 ┃ ┃ ┃ ┣ 📂photo-request
 ┃ ┃ ┃ ┃ ┣ 📜photoRequest.controller.ts
 ┃ ┃ ┃ ┃ ┗ 📜photoRequest.route.ts
 ┃ ┃ ┃ ┣ 📂profile-verification
 ┃ ┃ ┃ ┃ ┣ 📜profileVerification.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜profileVerification.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜profileVerification.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜profileVerification.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜profileVerification.validation.ts
 ┃ ┃ ┃ ┣ 📂profile-visits
 ┃ ┃ ┃ ┃ ┣ 📜profileVisits.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜profileVisits.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜profileVisits.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜profileVisits.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜profileVisits.validation.ts
 ┃ ┃ ┃ ┣ 📂report-profile
 ┃ ┃ ┃ ┃ ┣ 📜reportProfile.controllers.ts
 ┃ ┃ ┃ ┃ ┣ 📜reportProfile.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜reportProfile.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜reportProfile.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜reportProfile.validation.ts
 ┃ ┃ ┃ ┣ 📂shortlist
 ┃ ┃ ┃ ┃ ┣ 📜shortlist.controller.ts
 ┃ ┃ ┃ ┃ ┣ 📜shortlist.interface.ts
 ┃ ┃ ┃ ┃ ┣ 📜shortlist.model.ts
 ┃ ┃ ┃ ┃ ┣ 📜shortlist.routes.ts
 ┃ ┃ ┃ ┃ ┗ 📜shortlist.validation.ts
 ┃ ┃ ┃ ┣ 📜profile.controllers.ts
 ┃ ┃ ┃ ┣ 📜profile.interface.ts
 ┃ ┃ ┃ ┣ 📜profile.model.ts
 ┃ ┃ ┃ ┣ 📜profile.routes.ts
 ┃ ┃ ┃ ┗ 📜profile.validation.ts
 ┃ ┃ ┗ 📂success-story
 ┃ ┃ ┃ ┣ 📜successStory.controller.ts
 ┃ ┃ ┃ ┣ 📜successStory.interface.ts
 ┃ ┃ ┃ ┣ 📜successStory.model.ts
 ┃ ┃ ┃ ┣ 📜successStory.routes.ts
 ┃ ┃ ┃ ┗ 📜successStory.validation.ts
 ┃ ┣ 📂routes
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂seeders
 ┃ ┃ ┣ 📜adminStaffSeeder.ts
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂services
 ┃ ┃ ┣ 📜call.service.ts
 ┃ ┃ ┣ 📜chat.service.ts
 ┃ ┃ ┣ 📜email.controller.ts
 ┃ ┃ ┣ 📜email.route.ts
 ┃ ┃ ┣ 📜email.service.ts
 ┃ ┃ ┣ 📜email.templates.ts
 ┃ ┃ ┣ 📜recommendation.service.ts
 ┃ ┃ ┗ 📜sendNotification.service.ts
 ┃ ┗ 📂utils
 ┃ ┃ ┣ 📂counter
 ┃ ┃ ┃ ┣ 📜counter.interface.ts
 ┃ ┃ ┃ ┣ 📜counter.model.ts
 ┃ ┃ ┃ ┗ 📜counter.service.ts
 ┃ ┃ ┣ 📜generateJWT.ts
 ┃ ┃ ┣ 📜generateOTP.ts
 ┃ ┃ ┣ 📜payment.util.ts
 ┃ ┃ ┗ 📜verifyJWT.ts
 ┣ 📂scripts
 ┃ ┗ 📜fixCategoryPaths.ts
 ┣ 📂types
 ┃ ┗ 📜express.d.ts
 ┣ 📂uploads
 ┃ ┣ 📜onboarding 1 1.png
 ┃ ┣ 📜onboarding 2 1.png
 ┃ ┗ 📜onboarding 3 1.png
 ┣ 📜app.ts
 ┗ 📜server.ts
```

> The exact folder structure may vary depending on the final repository organization.

---

# 🔑 Core Backend Modules

## Authentication Module

Responsible for:

* Registration
* OTP verification
* Login
* Access and refresh token management
* Authenticated requests
* Logout

Security mechanisms include HTTP-only cookies, refresh-token rotation, validation, and rate limiting.

---

## Profile Module

Handles:

* Profile creation
* Profile updates
* Profile discovery
* Partner preferences
* Matchmaking

Profiles are filtered dynamically according to the user's preferences and interaction history.

---

## Matchmaking Module

The matchmaking engine considers both:

**Explicit preferences**

* Age
* Height
* Religion
* Caste
* Qualification
* Occupation
* Income
* Mother Tongue

and, where necessary:

**Profile similarity**

Profiles are matched according to relevant profile attributes when explicit partner preferences are unavailable.

---

## Interest Request Module

The interest-request module manages:

* Sending interest requests
* Accepting requests
* Rejecting requests
* Pending requests
* Duplicate request prevention
* Block-status validation
* Membership validation
* Total request limits
* Daily request limits

---

## Messaging Module

Handles:

* Real-time conversations
* Message persistence
* User-to-user communication
* Interest-status validation
* Messaging restrictions
* Firebase messaging integration

---

# ⚡ Performance Optimizations

Performance was treated as a core backend requirement.

## MongoDB Optimization

Implemented:

* Appropriate database indexes
* Lean MongoDB queries
* Reduced unnecessary document population
* Efficient filtering
* Optimized matchmaking queries

These optimizations reduced API response times from approximately **2–3 seconds to around 250–600ms** for relevant operations.

## Gzip Compression

Global Gzip compression was implemented to reduce HTTP response payload sizes.

**Result:**

> Payload sizes reduced by approximately **80%**.

## Server Cold-Start Optimization

A ping-service mechanism was implemented to periodically keep the backend active and reduce cold-start delays.

The mechanism reduced initial API latency from approximately **2 minutes to milliseconds**.

---

# 🔒 Security

The application implements several production-oriented security practices:

* JWT authentication
* HTTP-only cookies
* Refresh token rotation
* Rate limiting
* Zod request validation
* Protected routes
* Authentication middleware
* Input validation
* Secure environment variables
* Firebase Admin authentication
* Package-level authorization checks

---

# 🧪 Testing

The backend includes automated tests using **Jest**.

Testing covers:

* Authentication
* API controllers
* Business logic
* Validation
* Integration flows
* Error handling

---

# 📖 API Documentation

The API is documented using **Swagger/OpenAPI**, allowing frontend/mobile developers to understand and test available endpoints.

Documentation covers:

* Authentication APIs
* Profile APIs
* Matchmaking APIs
* Interest APIs
* Messaging APIs
* Package APIs
* Notification APIs
* User management APIs

---

# 🔔 Notification Architecture

The notification system supports both:

* **Push notifications** through Firebase Cloud Messaging
* **Transactional emails** through Brevo

Notification events can include:

* New interest requests
* Interest acceptance/rejection
* New messages
* New matches
* Membership expiry
* Contact alerts
* Photo upload requests

---

# ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=
JWT_REFRESH_SECRET=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_APP_NAME=

ZEGOCLOUD_APP_ID=
ZEGOCLOUD_SERVER_SECRET=

NODE_ENV=development
```

> Never commit `.env` files, API keys, private keys, or other secrets to GitHub.

---

# 🚀 Installation & Setup

## 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env
```

and add the required credentials.

## 4. Start the development server

```bash
npm run dev
```

## 5. Run tests

```bash
npm test
```

## 6. Build the application

```bash
npm run build
```

## 7. Start production server

```bash
npm start
```

---

# 📡 API Flow Example

### Sending an Interest Request

The backend validates multiple conditions before processing an interest request:

```text
Authentication
      ↓
Request Validation
      ↓
Target Profile Validation
      ↓
Existing Request Check
      ↓
Block Status Check
      ↓
Membership Validation
      ↓
Total Request Limit Check
      ↓
Daily Request Limit Check
      ↓
Create Interest Request
      ↓
Send Notification
      ↓
Return Response
```

This demonstrates how business rules are enforced at the backend rather than relying solely on frontend restrictions.

---

# 📊 Major Backend Responsibilities

| Module         | Responsibilities                         |
| -------------- | ---------------------------------------- |
| Authentication | Registration, login, OTP, tokens, logout |
| Profiles       | Creation, updates, discovery             |
| Matchmaking    | Preference-based and similarity matching |
| Interests      | Send, accept, reject, limits             |
| Shortlisting   | Save/remove profiles                     |
| Blocking       | Block/unblock and filtering              |
| Messaging      | Real-time user communication             |
| Notifications  | Push notifications                       |
| Voice Calling  | ZEGOCLOUD integration                    |
| Emails         | Transactional email notifications        |
| Membership     | Packages and feature restrictions        |
| Validation     | Zod schemas                              |
| Security       | Cookies, JWT, rate limiting              |
| Testing        | Jest unit/integration tests              |
| Documentation  | Swagger/OpenAPI                          |
| Performance    | Indexing, lean queries, compression      |
| DevOps         | CI/CD automation                         |

---

# 💡 Engineering Highlights

## 1. Complex Business Logic

Implemented backend workflows where multiple conditions must be evaluated before allowing an action.

For example, interest requests are validated against authentication, profile eligibility, block status, existing requests, membership status, and package limits before the request is created.

## 2. Centralized Validation

Zod schemas are used to validate incoming API payloads before business logic is executed.

## 3. Reusable Services

External integrations such as Firebase and Brevo are isolated into reusable service layers instead of embedding provider-specific logic throughout controllers.

## 4. Scalable Notification System

Push and email notifications are handled through dedicated services, making it easier to introduce additional notification types without tightly coupling them to controllers.

---

# 🧰 Development Tools

* VS Code
* Git
* GitHub
* Postman
* Swagger
* MongoDB Compass
* Jest
* npm

---

# 📈 Project Impact

The project focused heavily on backend reliability and performance.

## Performance

* ~80% reduction in response payload size through Gzip compression
* API response times optimized from approximately 2–3 seconds to 250–600ms
* Reduced cold-start latency from minutes to milliseconds using a ping mechanism

## Backend Development

* **30+ APIs** implemented
* Complete authentication flow
* End-to-end matchmaking logic
* Membership-based business rules
* Real-time communication
* Push and email notification infrastructure

---

# 👩‍💻 My Contribution

As a **Node.js Backend Developer**, I was responsible for designing and implementing major backend functionality across the application.

My responsibilities included:

* Developing backend APIs using Node.js and Express.js
* Designing and implementing business logic
* Building authentication and authorization flows
* Developing profile and matchmaking functionality
* Implementing interest request workflows and membership restrictions
* Developing messaging and notification functionality
* Integrating Firebase and ZEGOCLOUD
* Integrating Brevo transactional emails
* Optimizing MongoDB queries and database performance
* Implementing Gzip compression
* Building the server ping mechanism
* Writing Jest unit and integration tests
* Setting up API documentation using Swagger/OpenAPI
* Contributing to CI/CD automation
* Debugging and optimizing production-oriented backend workflows

---

# 📚 What I Learned

Working on SahaJeevan provided practical experience with:

* Building production-oriented REST APIs
* Designing complex business logic
* MongoDB data modeling
* Query optimization
* Authentication architecture
* Secure token management
* Third-party API integrations
* Real-time communication
* Push notification systems
* Transactional email systems
* Automated testing
* API documentation
* CI/CD pipelines
* Backend performance optimization
* Scalable service architecture

---

# 🔮 Future Improvements

Potential future enhancements include:

* Advanced recommendation algorithms
* AI-powered matchmaking
* Redis caching
* Background job processing
* Queue-based notification processing
* Advanced analytics
* Microservice decomposition for high-scale workloads
* Improved observability and monitoring
* Automated deployment pipelines
* Recommendation scoring based on user behavior

---

# 📜 License

This project is intended for demonstration and portfolio purposes.

---

# ⭐ Project Highlights

* **30+ APIs**
* **Secure Authentication**
* **Matchmaking Engine**
* **Membership System**
* **Real-Time Messaging**
* **Voice Calling**
* **Push Notifications**
* **Transactional Emails**
* **Jest Testing**
* **Swagger Documentation**
* **Performance Optimization**

### Built With ❤️ Using Node.js, Express.js & MongoDB

> **Note:** SahaJeevan is a professional company/client project. The repository/documentation contains only information that can be publicly shared. Proprietary source code, credentials, client data, and other confidential information are not included.
