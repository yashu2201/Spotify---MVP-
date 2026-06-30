fetch("https://spotify-mvp.onrender.com/recommend", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "I like listening to Justin Bieber but I am kind of bored of him so I want to listen to The Artist who has the same vibe like Justin Bieber" })
})
  .then(res => res.text().then(text => ({ status: res.status, body: text })))
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error("Error:", err));
