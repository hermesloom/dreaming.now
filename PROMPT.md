Replace the entire page by a simple crisp, neat, clean Next.js- and shadcn-based fully responsive web application which feels alive and beautifully flourishing regarding its color design and UI details and which does the following:

The Divizend logo to be used is at https://divizend.com/divizend.svg

It has a log in button which can log in the user to their account. To handle fetching and storing the user's profile, use a minimalist global state context. For now, only mock this profile and the requests.

When the user is not logged in, it just shows a full-screen blocker prompting the user to log in.

When the user is logged in, there are two options: Either the user is subscribed to the Divizend Companion (as determined from the user profile), or not. In case he's not, show a blocker as well. In case he is, show the following:

The main view can be in two different states: Brainstorm and Distribute. Add a simple shadcn-based toggle to allow switching between them for now.

In this section which displays whether the platform is in Brainstorm or in Distribute mode right now, also show e.g. "until 2025-03-14" and "until 2025-03-28" (always use YYYY-MM-DD, no matter which language).

In the brainstorm view, there is a list of ideas displayed. In the main view, each idea should have an emoji as icon, a title and a short description. When clicking on it, a dialog should open where all details about the idea are displayed: Its title, its short description and, optionally, a chunk of text rendered from Markdown. Additionally, each idea should have an admin with a real name, and an "issues" section which is sort of like a comment section, i.e. where the user can also write a comment, but importantly, comments can be "resolved" or "rejected" by the admin with simple elegant buttons for each comment. Additionally, the admin shall be able to edit the idea's title, description and Markdown. At the bottom of the main list of ideas, also show a button with "Didn't find what you were looking for?" as small text above it and then the button titled "Add new idea". When this button is clicked, the detail view of the idea in edit mode should pop up.

In the distribute view, the same list of ideas is displayed, but each shown with a money amount at the end of the row. The view should have the heading "You still have €20.00 to distribute". Put the €20.00 into a variable. Each idea should also have a button to allocate more, which is greyed out when the variable with the amount left to distribute is zero. When clicking on it, open a simple elegant dialog where the user can input an amount. Additionally, the user shall be able to take away any part or all of the amount of he already allocated to an idea.

At the bottom, show a button "Finalize sprint"

Make the entire page fully internationalized with English and German at first and use a suitable minimalist Next.js-first i18n framework for that where contextful translations are especially easy.

Make sure to divide the logic and the UI up intelligently into different files.
