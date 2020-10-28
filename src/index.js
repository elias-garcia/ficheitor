const dotenv = require("dotenv");
const CronJob = require("cron").CronJob;
const axios = require("axios").default;
const qs = require("qs");
const express = require("express");

const utils = require("./utils");

if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

async function login(username, password) {
  const body = { grant_type: "password", username, password };

  return axios
    .post(process.env.AUTH_URL, qs.stringify(body))
    .then((res) => res.data.access_token);
}

async function getUserId(accessToken) {
  const headers = utils.buildAuthorizationHeader(accessToken);

  return axios
    .get(`${process.env.API_URL}/users`, { headers })
    .then((res) => res.data.UserId);
}

async function getWorkingDay(userId, accessToken) {
  const todayDate = utils.getTodayDate();
  const headers = utils.buildAuthorizationHeader(accessToken);
  const params = {
    fromDate: todayDate,
    toDate: todayDate,
    pageIndex: 0,
    pageSize: 1,
  };

  return await axios
    .get(`${process.env.API_URL}/users/${userId}/diaries/presence`, { params, headers })
    .then((res) => res.data.Diaries[0]);
}

async function getSigns(accessToken) {
  const headers = utils.buildAuthorizationHeader(accessToken);

  return await axios
    .get(`${process.env.API_URL}/signs`, { headers })
    .then((res) => res.data);
}

async function postSign(userId, slot) {
  const headers = utils.buildAuthorizationHeader(accessToken);
  const body = utils.buildSign(userId, slot);

  return await axios
    .post(`${process.env.API_URL}/svc/signs/signs`, body, { headers })
    .then((res) => res.data);
}

async function main() {
  const accessToken = await login(process.env.USERNAME, process.env.PASSWORD);
  const userId = await getUserId(accessToken);
  const workingDay = await getWorkingDay(userId, accessToken);
  const signs = await getSigns(accessToken);

  if (workingDay.IsHoliday) {
    console.log("Holi... day! You don't need to clock in/out today :)");

    return;
  } else {
    if (signs.length === 4) {
      console.log("You have already clocked in/out for all of the today slots :D");
    }

    const nextSlot = signs.length + 1;

    await postSign(userId, nextSlot);
    console.log(`Clocked in/out successfully for slot number: ${nextSlot}`);
  }
}

async function keepAlive() {
  await axios.get(process.env.APP_URL);
}

(async () => {
  try {
    const keepAliveCron = new CronJob("*/15 * * * *", keepAlive);
    const signerCron = new CronJob("0 9,14,15,18 * * * *", main);
    const app = express();

    keepAliveCron.start();
    signerCron.start();

    app.get("/", (_, res) => {
      res.send("The app would be alive for another 30min :D");
    });

    app.listen(process.env.PORT, async () => {
      console.log(`App listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
})();