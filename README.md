# criticalfail

A webiste intended to assist with D&D character creation, encounter setup, tracking of items, spells, and loot, and actual play of the game. This is intended as a personal project aimed at furthering development skills, and will not provide any financial benefit or otherwise.

## Specification

### Profile

#### Login

- [ ] Create account provides fields for email, password, and username. Email must be unique and will be used as login credentials, but the username does not have to be unique, allowing users to choose whatever username they would like. A unique friend code will be provided under profile options
- [ ] Login option provides fields for email and password, authenticating the user. It will also have a remember me option which will use localStorage
- [ ] Include an administrative login, allowing for additional control over website operation
- [ ] User credentials stored in MongoDB
- [ ] Eventually, user can choose a profile picture (use S3 for this)

#### Display

- [ ] Profile will be displayed at the top left of the website, with the profile picture then the username. A small carrot (or some other indication) will indicate that it can be clicked to expand a menu
- [ ] Menu options may include:
  - [ ] Profile settings - displays the unique friend code, allows username change, password change, email change, and upload a profile picture. Will also include a logout button.
  - [ ] My Stuff - saved character sheets, homebrew classes, races, items, spells, and monsters.
  - [ ] Friends - when pressed, displays a list of friends. Each friend on the list will have an option to start (or continue) a chat with them. Also includes an `add friend` button that will allow you to enter a friend code to friend someone.
  - [ ] Logout - logout button
- [ ] Login screen has fields for email and password
- [ ] Login screen has a button that directs the user to the create account page
- [ ] Create account page has fields for the email and password, as well as prompting the user to confirm the password and choose a username
- [ ] Links to the about page are found on both the login and create account screen

### General Display

- [ ] Top left is the name of the website, which when clicked brings you back to the home page
- [ ] Top right is the profile box, with on the left side of that box the user's profile picture. Username displayed here, and a dropdown carrot to view profile display options
- [ ] In the middle, but aligned towards the left, are the following options:
  - [ ] Home - displays some basic information about the website, maybe some links?
  - [ ] Character sheets - page to browse pre-created character sheets, create your own character sheet
  - [ ] Monsters - stat blocks for monsters, animals, and npcs; and options to create custom ones
  - [ ] Dice Roller - dice rolling automation and options
  - [ ] Lobbies - join or create a game lobby, to play with friends
  - [ ] Chat - chat messaging for friends?
  - [ ] About - Information about the website, including the dnd creative commons statement
- [ ] 