// src/User/Home.jsx
import React from 'react'

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
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function Home() {
  const today = days[new Date().getDay()]
  const menu = weeklyMenu[today]

  return (
    <div className="p-6 flex flex-col gap-10">

      <div>
        <div className="text-3xl font-bold mb-1">Today's Menu</div>
        <div className="text-lg mb-6 pl-1">{today}</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Breakfast</h2>
            <p className="text-gray-600 mb-2 text-sm">7:30 AM – 9:30 AM</p>
            <p className="text-gray-800 text-sm leading-relaxed">{menu.breakfast}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Lunch</h2>
            <p className="text-gray-600 mb-2 text-sm">12:00 PM – 2:00 PM</p>
            <p className="text-gray-800 text-sm leading-relaxed">{menu.lunch}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Dinner</h2>
            <p className="text-gray-600 mb-2 text-sm">7:30 PM – 9:30 PM</p>
            <p className="text-gray-800 text-sm leading-relaxed">{menu.dinner}</p>
          </div>
        </div>
      </div>

      <div className='text-2xl font-semibold'>Current Diners: 0</div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Food Wastage Card */}
          <div className="bg-white rounded-xl shadow-md p-4 pt-6 h-70 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Yesterday's Food Wastage</h2>
            <div className="space-y-3 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Breakfast</span>
                <span>12 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Lunch</span>
                <span>25 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Dinner</span>
                <span>18 kg</span>
              </div>
            </div>
            <div className="mt-auto text-sm pt-4 text-gray-500">
              Please don't waste food. Save resources.
            </div>
          </div>

          {/* Rating Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-4">Rate Today's Food</h2>
            <div className="flex space-x-2 text-3xl cursor-pointer">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
            </div>
            <p className="text-gray-500 mt-3 text-sm">
              Tap a star to rate the mess food
            </p>
          </div>

          {/* Know Your Mess Card */}
          <div className="bg-white rounded-xl shadow-md p-6 h-70 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Know Your Mess</h2>
            <div className="space-y-2 text-gray-700 overflow-y-auto text-sm leading-relaxed">
              Alder is a group of deciduous trees commonly found in cool and moist regions,
              often growing near rivers, lakes, and wetlands. Alder trees are known for their
              ability to improve soil fertility because their roots host bacteria that fix
              nitrogen in the soil. They typically grow quickly and produce small cone-like
              fruits along with serrated green leaves. Alder wood is also valued for making
              furniture, musical instruments, and plywood because it is lightweight yet durable.
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home