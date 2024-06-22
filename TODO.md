1. Host it
2. Randomize the list of items
3. Keep the ordering stable via resharing
4. Make requests to amazon from the browser and parse the HTML on the client to save load on the server
5. Add price
6. Add link copy button
7. Make it pretty
8. Loading state

Validate list => !== 30 means try again
Create "game" object, list of items with schema:

- full href to item page
- image src
- price
- title

Add a "view games" page
Make the list accessible from a query param

"Do a round"

- Assign owner to two items
- Reveal items to owner (price, title, image)
- Reveal mode, board mode with revealed state
- X out items when finished (confirmation dialog)
