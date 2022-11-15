import app from "./app";
import { basic } from "./shared/main";

console.log(basic());

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
