// scripts/seedMenu.js
// Run ONCE to push the default weekly menu to Firestore.
//
// Usage:
//   node scripts/seedMenu.js
//
// Prerequisites:
//   npm install firebase-admin
//   scripts/serviceAccountKey.json must exist (same as seedStudents.js)

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const weeklyMenu = {
  Monday: {
    breakfast: "Aloo Onion Paratha, Curd, Fruits/2 Eggs, Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Rajma, Cabbage-Matar, Jeera Rice, Roti, Curd, Green Salad, Lemon & Pickle",
    dinner: "Aloo Gobhi Masala, Arher Dal, White Rasgulla, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Tuesday: {
    breakfast: "Poori, Halwa, Curd, Fruits/2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Aloo Gazar Gobhi, Moong Masoor Dal, Rice, Roti, Bundi Raita, Green Salad, Lemon & Pickle",
    dinner: "Gravy Manchurian, Dal Makhni, Motichur Laddu, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Wednesday: {
    breakfast: "Chana Mix Paratha, Dhaniya Chutney, Curd, Fruits/2 Omelette, Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Kadhi Pakora, Aloo Zeera, Masala Papad/Fryums, Roti, Rice, Butter Milk, Green Salad, Lemon & Pickle",
    dinner: "Paneer/Chicken, Dal Fry, Shahi Tukda & Rabdi, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Thursday: {
    breakfast: "Idli, Sambhar & Chutney, Coconut Chutney, 2 Banana/2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Sitafal, White Chole, Masala Chaach, Poori, Rice, Green Salad, Lemon & Pickle",
    dinner: "Mix Veg (Gajar+Paneer or Mushroom+Bean+Gobi+Matar), Black Masoor Dal, Gulab Jamun, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Friday: {
    breakfast: "Uttapam, Sambhar, Fruits/2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Sprouts",
    lunch: "Mix Dal, Dum Aloo/Kaala Chana, Green Chutney, Roti, Rice, Green Salad, Lemon & Pickle",
    dinner: "Paneer/Egg Curry, Roongi Dal, Balushai, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Saturday: {
    breakfast: "Methi/Palak Paratha, Aloo Tamatar Sabji, Milk, Bread & Butter, Tea/Coffee, Cornflakes, Sprouts",
    lunch: "Dry Paneer Bhurji/Egg Bhurji, Chana Dal, Fried Mirch, Roti, Khichdi, Green Salad, Lemon & Pickle",
    dinner: "Gazar Matar Shimla Mirch, Dal Tadka, Rice Kheer, Roti, Rice, Green Salad, Lemon & Pickle",
  },
  Sunday: {
    breakfast: "Masala Onion Dosa, Sambhar, 2 Eggs, Daliya/Milk, Bread & Butter, Tea/Coffee, Cornflakes, Sprouts",
    lunch: "Bhature, Chole, Roti, Rice, Salad, Lemon & Pickle",
    dinner: "Paneer Biryani/Chicken Biryani, Aloo Soyabean, Ice Cream, Veg Raita, Green Salad, Lemon & Pickle",
  },
};

async function seedMenu() {
  console.log("🌱 Seeding weekly menu to Firestore...\n");
  for (const [day, meals] of Object.entries(weeklyMenu)) {
    await db.collection("menu").doc(day).set(meals);
    console.log(`✅ ${day} saved`);
  }
  console.log("\n🎉 Menu seeded successfully!");
  process.exit(0);
}

seedMenu().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});