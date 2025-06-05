import { connectDB } from "../config/database";
async function testConnection() {
  const mediatech = await connectDB();
  console.log(
    "Mediatech",
    mediatech instanceof Error ? mediatech.message : "Connected"
  );
}
testConnection();
