const seatPricing = {
    A: 13,
    B: 12,
    C: 11,
  };
  
  const isCenterSeat = (seat) => {
    const seatNum = parseInt(seat.slice(1), 5);
    return seatNum >= 2 && seatNum <= 4;
  };
  
  const loyaltyDiscount = (userBookingCount) => {
    if (userBookingCount >= 10) return 0.2;
    if (userBookingCount >= 5) return 0.1;
    return 0;
  };
  
  const groupDiscount = (seatCount) => {
    if (seatCount >= 8) return 0.15;
    if (seatCount >= 4) return 0.1;
    return 0;
  };
  
  const ageDiscount = (age) => {
    if (age <= 15) return 1.0;
    if (age <= 22) return 0.5;
    if (age <= 37) return 0.2;
    if (age >= 60) return 0.3;
    return 0.0;
  };
  
  export const calculateTotalPrice = (seats, userBookingCount, passengerAge = []) => {
    const seatDetails = seats.map((seat, index) => {
      const row = seat[0];
      const seatBase = seatPricing[row] || 10;
      const isCenter = isCenterSeat(seat);
      const centerMarkup = isCenter ? 1.1 : 1;
  
      const seatPrice = seatBase * centerMarkup;
      const age = passengerAge[index] ?? 25;
      const ageDisc = ageDiscount(age);
      const discountedPrice = seatPrice * (1 - ageDisc);
  
      return {
        seat,
        base: seatBase,
        isCenter,
        centerMarkup,
        age,
        ageDiscount: ageDisc,
        finalPrice: parseFloat(discountedPrice.toFixed(2)),
      };
    });
  
    const basePrice = seatDetails.reduce((sum, s) => sum + s.finalPrice, 0);
  
    const loyalty = loyaltyDiscount(userBookingCount);
    const group = groupDiscount(seats.length);
  
    const afterLoyalty = basePrice * (1 - loyalty);
    const finalPrice = afterLoyalty * (1 - group);
  
    return {
      total: parseFloat(finalPrice.toFixed(2)),
      breakdown: {
        basePrice: parseFloat(basePrice.toFixed(2)),
        loyaltyDiscount: loyalty,
        groupDiscount: group,
        afterLoyalty: parseFloat(afterLoyalty.toFixed(2)),
        finalPrice: parseFloat(finalPrice.toFixed(2)),
      },
      seats: seatDetails.map(s => ({
        seat: s.seat,
        base: s.base,
        isCenter: s.isCenter,
        centerMarkup: s.centerMarkup,
        age: s.age,
        ageDiscount: s.ageDiscount,
        finalPrice: parseFloat(s.finalPrice.toFixed(2)),
      })),
    };
  };

