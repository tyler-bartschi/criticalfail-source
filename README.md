# criticalfail

A webiste intended to assist with D&D character creation, encounter setup, tracking of items, spells, and loot, and actual play of the game. This is intended as a personal project aimed at furthering development skills, and will not provide any financial benefit or otherwise.

## Specification

### Profile

#### Login

- [ ] Create account provides fields for email, password, and username. Email must be unique and will be used as login credentials, but the username does not have to be unique, allowing users to choose whatever username they would like. A unique friend code will be provided under profile options
- [ ] Login option provides fields for email and password, authenticating the user. It will also have a remember me option which will use localStorage

#### Display

- [ ] Profile will be displayed at the top left of the website, with the profile picture then the username. A small carrot (or some other indication) will indicate that it can be clicked to expand a menu
- [ ] Menu options may include:
  - [ ] Profile settings - displays the unique friend code, allows username change, password change, email change, and upload a profile picture. Will also include a logout button.
  - [ ] My Stuff - saved character sheets, homebrew classes, races, items, spells, and monsters.
  - [ ] Friends - when pressed, displays a list of friends. Each friend on the list will have an option to start (or continue) a chat with them. Also includes an `add friend` button that will allow you to enter a friend code to friend someone.
  - [ ] Logout - logout button
