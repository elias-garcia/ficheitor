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
      return `${todayDate}T09:00:00+01:00`;
    }
    case 2: {
      return `${todayDate}T014:00:00+01:00`;
    }
    case 3: {
      return `${todayDate}T15:00:00+01:00`;
    }
    case 4: {
      return `${todayDate}T18:00:00+01:00`;
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
