import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Demo credentials
const passwords = [
  { id: "demo-user", password: "demo-password" },
];

app.get("/signin", (req, res) => {
  const users = passwords.map(({ id }) => ({ id }));
  res.json({ users });
});

app.post("/signin", (req, res) => {
  const { id, password } = req.body ?? {};

  if (typeof id !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Send both 'id' and 'password' as strings." });
  }

  const userExists = passwords.some(
    (user) => user.id === id && user.password === password,
  );

  if (!userExists) {
    return res.status(404).json({ message: "not exist" });
  }

  res.json({ message: "successful" });
});

app.post("/signup", (req, res) => {
  const { id, password } = req.body ?? {};

  if (typeof id !== "string" || typeof password !== "string" || id.trim().length < 3 || password.trim().length < 8) {
    return res.status(400).json({ error: "Send both 'id' and 'password' as strings. ID must be at least 3 characters and password must be at least 8 characters." });
  }
  
  const userExists = passwords.some(
    (user) => user.id === id,
  );

  if (userExists) {
    return res.status(409).json({ message: "User already exists." });
  }
  
  passwords.push({ id, password });
  return res.status(201).json({ message: "User created successfully" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
