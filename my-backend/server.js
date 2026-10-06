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

  const cleanId = id.trim();
  const cleanPassword = password.trim();

  if (cleanId.length < 3 || cleanPassword.length < 8) {
    return res.status(400).json({ error: "Send both 'id' and 'password' as strings. ID must be at least 3 characters and password must be at least 8 characters." });
  }

  const userExists = passwords.some(
    (user) => user.id === cleanId && user.password === cleanPassword,
  );

  if (!userExists) {
    return res.status(401).json({ error: "Invalid ID or password." });
  }

  return res.json({
    message: "Signed in successfully",
    user: { id: cleanId },
  });
});

app.post("/signup", (req, res) => {
  const { id, password } = req.body ?? {};

  if (typeof id !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Send both 'id' and 'password' as strings." });
  }

  const cleanId = id.trim();
  const cleanPassword = password.trim();

  if (cleanId.length < 3 || cleanPassword.length < 8) {
    return res.status(400).json({ error: "Send both 'id' and 'password' as strings. ID must be at least 3 characters and password must be at least 8 characters." });
  }
  
  const userExists = passwords.some(
    (user) => user.id === cleanId,
  );

  if (userExists) {
    return res.status(409).json({ message: "User already exists." });
  }
  
  passwords.push({ id: cleanId, password: cleanPassword });
  return res.status(201).json({
    message: "User created successfully",
    user: { id: cleanId },
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
