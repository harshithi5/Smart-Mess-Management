import React from 'react'

function Home() {
  return (
    <div className="p-6 flex flex-col gap-10">

      <div>
        <div className="text-3xl font-bold mb-6">Today's Menu</div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Breakfast */}
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Breakfast</h2>
            <p className="text-gray-600 mb-2 text-sm">7:30 AM – 9:30 AM</p>
            <p>Poha, Tea, Banana</p>
          </div>

          {/* Lunch */}
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Lunch</h2>
            <p className="text-gray-600 mb-2 text-sm">12:00 PM – 2:00 PM</p>
            <p>Rice, Dal, Roti, Sabzi</p>
          </div>

          {/* Dinner */}
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Dinner</h2>
            <p className="text-gray-600 mb-2 text-sm">7:30 PM – 9:30 PM</p>
            <p>Roti, Paneer, Salad</p>
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

            <div className="mt-auto text-sm font-md pt-4">
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

            <div className="space-y-2 text-gray-700 overflow-y-auto">
              Alder is a group of deciduous trees commonly found in cool and moist regions, often growing near rivers, lakes, and wetlands. Alder trees are known for their ability to improve soil fertility because their roots host bacteria that fix nitrogen in the soil. They typically grow quickly and produce small cone-like fruits along with serrated green leaves. Alder wood is also valued for making furniture, musical instruments, and plywood because it is lightweight yet durable. In many ecosystems, alder trees play an important role in stabilizing riverbanks and supporting wildlife.
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home
