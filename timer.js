function getTimeRemaining() {
  const start = 'March 22 2022 17:00:00 GMT+0100';
  const startTime = new Date(start).getTime();

  const endline = 'March 22 2022 18:30:00 GMT+0100';
  const endlineTime = new Date(endline).getTime();

  const nowTime = new Date().getTime();
  let time = 0;
  if (nowTime < startTime) {
    time = start;
  } else if (nowTime < endlineTime) {
    time = endline;
  } else {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const total = Date.parse(time) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

function initializeClock(id, endtime) {
  const clock = document.getElementById(id);
  const daysSpan = clock.querySelector('.days');
  const daysText = clock.querySelector('.daysText');
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  const secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    const t = getTimeRemaining();

    if (t.days > 0) {
      if (t.days > 1) {
        daysText.innerHTML = ' days, ';
      } else {
        daysText.innerHTML = ' day, ';
      }
      daysSpan.innerHTML = t.days;
    } else {
      daysSpan.innerHTML = '';
      daysText.innerHTML = '';
    }
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
      clock.innerHTML = `Time's up!!!`;
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}

initializeClock('clockdiv');