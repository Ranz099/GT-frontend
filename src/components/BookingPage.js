import React, { useState, useEffect } from 'react';
import axios from 'axios';

// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function BookingPage() {
  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState("");
  const [availableCourts, setAvailableCourts] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newBooking, setNewBooking] = useState({ court: '', startTime: '', endTime: '' });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


//   useEffect(() => {
//     fetchCenters();
//   }, []);

useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      const decoded = jwtDecode(token);
      setUser(decoded.user); // Set user from token
    }
    fetchCenters();
  }, [navigate]);

  const fetchCenters = async () => {
    try {
      const response = await axios.get('https://gt-backend-pfho.onrender.com/api/centers');
      setCenters(response.data);
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  const fetchSports = async (centerId) => {
    try {
      const response = await axios.get(`https://gt-backend-pfho.onrender.com/api/sports?center=${centerId}`);
      setSports(response.data);
      setSelectedSport(''); // Reset selected sport when center changes
      setAvailableCourts([]); // Reset available courts
      setAvailableSlots([]); // Reset available slots
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`https://gt-backend-pfho.onrender.com/api/bookings?center=${selectedCenter}&sport=${selectedSport}&date=${selectedDate}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAvailableCourts = async (sportId) => {
    if (sportId) {
      try {
        const sport = sports.find(s => s._id === sportId);
        if (sport) {
          setAvailableCourts(sport.courts); // Assuming courts are stored in the sport object
          setNewBooking({ ...newBooking, court: sport.courts[0] }); // Set default court to the first available
          fetchAvailableSlots(sport.courts[0]); // Fetch available slots for the first court
        }
      } catch (error) {
        console.error('Error fetching available courts:', error);
      }
    }
  };

  const fetchAvailableSlots = async (court) => {
    console.log({selectedCenter,selectedSport,selectedDate})
    if (selectedCenter && selectedSport && selectedDate) {
      try {
        const response = await axios.get(`https://gt-backend-pfho.onrender.com/api/bookings/available-slots`, {
          params: {
            center: selectedCenter,
            sport: selectedSport,
            court: court,
            date: selectedDate,
          },
        });
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      }
    }
  };

  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    console.log(centerId);

    fetchSports(centerId);
    setAvailableCourts([]); // Reset available courts when center changes
    setAvailableSlots([]);
    
     // Reset available slots
  };
  

  const handleSportChange = (e) => {
    const sportId = e.target.value;
    setSelectedSport(sportId);
    console.log(selectedSport);
    fetchAvailableCourts(sportId); // Fetch available courts when sport changes
    fetchAvailableSlots(newBooking.court); // Fetch available slots for the selected court
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    fetchAvailableSlots(newBooking.court); // Fetch available slots when date changes
  };

  const handleNewBookingChange = (e) => {
    const { name, value } = e.target;
    
    let endTime = `${value.split(':')[0]}:59`
    
    setNewBooking({ ...newBooking, [name]: value, endTime });
    if (name === 'court') {
      fetchAvailableSlots(value); // Fetch available slots when court changes
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://gt-backend-pfho.onrender.com/api/bookings', {
        center: selectedCenter,
        sport: selectedSport,
        court: newBooking.court,
        date: selectedDate,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
      });
      fetchBookings();
      setNewBooking({ court: '', startTime: '', endTime: '' });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Select Booking Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={selectedCenter} onChange={handleCenterChange} className="border p-2 rounded">
            <option value="">Select Center</option>
            {centers.map(center => (
              <option key={center._id} value={center._id}>{center.name}</option>
            ))}
          </select>
          <select value={selectedSport} onChange={handleSportChange} className="border p-2 rounded">
            <option value="">Select Sport</option>
            {sports.map(sport => (
              <option key={sport._id} value={sport._id}>{sport.name}</option>
            ))}
          </select>
          <input type="date" value={selectedDate} onChange={handleDateChange} className="border p-2 rounded" />
        </div>
        <button onClick={fetchBookings} className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg 
                 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-300">
          View Bookings
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Current Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map(booking => (
            <div key={booking._id} className="border p-4 rounded">
              <p><strong>Court:</strong> {booking.court}</p>
              <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Create New Booking</h2>
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <select
            name="court"
            value={newBooking.court}
            onChange={handleNewBookingChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Court</option>
            {availableCourts.map((court, index) => (
              <option key={index} value={court}>{court}</option>
            ))}
          </select>
          <select
            name="startTime"
            value={newBooking.startTime}
            onChange={handleNewBookingChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Start Time</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot.startTime}>{slot.startTime}</option>
            ))}
          </select>
         
          <button type="submit" className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg 
                 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-300">
            Create Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;

