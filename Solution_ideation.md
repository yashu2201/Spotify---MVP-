## This document includes the basic idea of the solution for our problem statement. The AI MVP prototype we are planning to build
What we're building, in plain terms
Think of it as a music buddy you can talk to — a single web page where you tell it, in your own words, what you're looking for, and it hands you back a short list of genuinely new songs, each with a one-sentence reason for why it picked that song for you. And if the list isn't quite right, you just tell it what to change, like you would a friend.
That's the whole thing. No browsing, no fighting menus. You talk, it digs, it explains.
What actually happens when someone uses it
Imagine the screen. There's a text box, like a chat. The user types something natural:
"I love Phoebe Bridgers but I'm bored of her. Find me artists with that same sad, quiet vibe — but stuff I've definitely never heard, nothing famous."
A few seconds later, they get back something like ten songs. Each one shows the album cover, the song and artist name, a "Open in Spotify" button so they can actually play it, and crucially — one line explaining the pick:
"Lomelda — quiet, confessional folk with the same intimate, whispered vocals you love in Phoebe, but she's tiny right now so this is almost certainly new to you."
That little sentence is the magic. It's the thing Spotify never gives you, and it's what makes someone trust the suggestion enough to actually press play.
Then if they say "these are great but make them a bit more upbeat" or "less indie, more experimental," the list updates. They're steering, not being fed.
Now — how does this actually get built in Cursor? (the honest mechanics, still in plain language)
Pieces working together:
1. The page itself. This is just a website with a text box and a results area. Cursor will write almost all of this for you — you describe what you want, it generates the code. This is the easy part.
2. The "brain" — LLM. When the user types their request, the page quietly sends it to LLM with an instruction like: "This person wants sad quiet music like Phoebe Bridgers, nothing famous, nothing they've heard. Suggest ten artists/songs that fit, and for each one write a single honest sentence saying why." LLM is good at understanding messy, human requests like "but weirder" or "ease me into jazz over a month" — that's exactly what makes it the right tool. It returns a list of song ideas plus the reasons.
