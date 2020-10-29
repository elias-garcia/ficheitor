const dayjs = require("dayjs");

function buildAuthorizationHeader(accessToken) {
  return { authorization: `Bearer ${accessToken}` };
}

function getTodayDate() {
  return dayjs().format("YYYY-MM-DD");
}

function getSlotHour(slot) {
  const todayDate = getTodayDate();

  switch (slot) {
    case 1: {
      return `${todayDate}T${process.env.START_HOUR}:00:00+01:00`;
    }
    case 2: {
      return `${todayDate}T${process.env.BREAK_START_HOUR}:00:00+01:00`;
    }
    case 3: {
      return `${todayDate}T${process.env.BREAK_END_HOUR}:00:00+01:00`;
    }
    case 4: {
      return `${todayDate}T${process.env.END_HOUR}:00:00+01:00`;
    }
  }
}

function buildSign(userId, slot) {
  const date = getSlotHour(slot);

  return {
    DeviceId: "WebApp",
    EndDate: date,
    StartDate: date,
    TimezoneOffset: -60,
    UserId: userId,
  };
}

module.exports = {
  buildAuthorizationHeader,
  getTodayDate,
  buildSign,
};
