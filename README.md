# uBucket
## A University Based Bucket List

University of Illinois at Urbana-Champaign
CS 428/429: Software Engineering II
Professor Darko Marinov
Spring 2014

## Authors:
Khulan Myagmardorj
Metin Askaroglu
Akshay Bajaj
Estayvaine Bragg
Ricky Lung
Katie Chrzanowski

# Abstract

## Description
Every year, thousands of university students graduate without truly exploring their college campus, and fail to visit campus landmarks and complete various college traditions. uBucket is a social todo list mobile application meant to manage university students’ bucket lists. It will act as a social means to submit, comment, and upvote bucket list stories within their university's network as well as provide a space where each individual can privately keep track of the items they would like to complete. This application will be available to everyone on all smartphone platforms for free. uBucket will finally allow students to compose a list of things they want to do at their university before leaving, and serve as a means to share, discuss, and accomplish these tasks before they graduate and leave campus.

## Motivation
Our motivation for this project roots from both of us being seniors and feeling like we have limited time here. We want to appreciate all aspects of this university, and are currently in the process of writing our personal bucket lists. We needed a way to keep track of the popular bucket list suggestions from students in this university and a method to share our ideas with others.

## Process
Our team this year has decided to follow the Extreme Programming software development process. This process was most beneficial to us as its key methodologies promoted more productivity and a quicker turnaround by having weekly iteration checkpoints with our moderator and frequent releases. Instead of having traditional code review sessions, XP’s pair programming aspect advocates greater efficiency because it allows us to have continuous code reviews while programming. The test driven aspect of XP also contributed to more effective programming as it assisted in making sure edge cases are covered within our source code from the beginning as well as allowed quick code changes at a low cost. This process allowed us to be more effective in producing a deliverable as well as keeping us constantly moving forward towards our next goal.
Section 2: Requirements and Specifications

# Some Features

## Public Bucket List
Immediately upon logging into uBucket, a public bucket list of user-made items from the user’s university will be displayed.  Bucket list items that were created by the users and acknowledged to be submitted to the public bucket list will appear there.  The items are pulled from the Parse database and displayed with all associated information such as the number of comments and upvotes.  Through this view, users are able to add new stories to their own personal bucket list.  Once a new story is added to the public list, the app asynchronously updates it and the user will be able to view it immediately.


## Private Bucket List
Once logged in, the user can access their own private bucket list.  This view may contain stories that are shared between the public list, or will be stories that are unique to the user that no other users are able to access.  They are able to compose their own item and choose whether or not to release it publicly.  At the top of their screen will be a progress bar that updates asynchronously when they add, remove, or complete a bucket list item.  All data of what items are in / completed is stored in Parse.

## Commenting on Stories
Each public bucket list item has its own page for comments that correlate with that item.  The comments are all stored within a table in Parse.  Each comment also has a unique user associated with it.  All users will be able to view the comments from any given bucket list item on the public bucket list, and the comments will be updated asynchronously across systems.

## Upvoting Stories
Much like comments, public bucket list items have an upvote count associated with them.  When a public list item is created, it is stored in a table in Parse and its upvote count is initialized to 0.  Users who view the item are given the option to “upvote” the bucket list item, which will increase its count by one.  A higher count will signify to users that this is a popular task, which may incline more users to add it to their own private bucket list.

## Personal Profile
When using the app for the first time, a user is able to register an account.  Email addresses and usernames are unique for each user.  Each user then has their own personal profile which displays the number of bucket list items they have saved in their private bucket list, as well as how many they have completed.  Their profile also has a link to a feedback page, where they are able to submit a bug or question to the developers which will be stored in Parse.  Future updates will include the feedback being sent to a dedicated email address rather than stored in the database.

# Architecture and Design

uBucket was written entirely with web development languages, such as AngularJS, HTML, CSS, and XML. By writing all of this on top of PhoneGap, a mobile development framework, we’re able to easily transform web development code into native iOS, Android, Windows Phone, and Blackberry applications. The biggest advantage of using PhoneGap is that we can guarantee our users a uniform and seamless experience across all platforms without having to allocate resources towards each individual platform. On top of PhoneGap, we’re using Ionic Framework, which is front-end web framework for developing mobile apps. Our team managed to cut out our entire back-end because we could hide implementation details through the app’s compilation. This being the case, we used Parse as our primary database, and it connected to our app by acting as a service. In a nutshell, our team used PhoneGap to create cross-platform apps and Ionic to power the front-end experience for the user while storing all data in Parse.

This application was written using a Model-View-Controller (MVC) architectural model, as per the fundamental design dictated by AngularJS. Our models were services, which allowed us to mass-produce objects when necessary, controllers, which manipulated the services to provide the views with information, and the views, which were responsible for rendering front-end HTML pages to the user. Using these three different components, we were able to provide a very stable, efficient, and controlled experience to the user.
