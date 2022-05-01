import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth-context';
import { BookingList, Spinner } from '../../components';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const deleteBookingHandler = (bookingId) => {
    setIsLoading(true);

    const requestBody = {
      query: `mutation CancelBooking($id: ID!) { 
        cancelBooking(bookingId: $id) { 
          _id
          title
        } 
      }`,
      variables: {
        id: bookingId,
      },
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(String(res.status));
        }
        return res.json();
      })
      .then((resData) => {
        setBookings((prevState) => {
          // const bookingsOld = [...prevState];
          return [...prevState].filter((booking) => {
            return booking._id !== bookingId;
          });
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const fetchBookings = () => {
    setIsLoading(true);

    const requestBody = {
      query: `query { 
        bookings { 
          _id
          createdAt
          event {
            _id
            title
            date
          }        
        } 
      }`,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(String(res.status));
        }
        return res.json();
      })
      .then((resData) => {
        setBookings(resData.data.bookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
      )}
    </>
  );
};

export default Bookings;
