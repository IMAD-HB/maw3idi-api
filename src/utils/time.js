export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

export const isTimeInsideRange = (
  start,
  end,
  availabilityStart,
  availabilityEnd,
) => {
  const bookingStart = timeToMinutes(start);

  const bookingEnd = timeToMinutes(end);

  const availableStart = timeToMinutes(availabilityStart);

  const availableEnd = timeToMinutes(availabilityEnd);

  return bookingStart >= availableStart && bookingEnd <= availableEnd;
};
