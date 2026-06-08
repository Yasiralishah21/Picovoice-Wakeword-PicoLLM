// // mini event tracker for wakeword sessions.

// //works like this 
// /*
// Frontend (Hero.jsx)
//         ↓
// POST /voice-status
//         ↓
// Backend stores events
//         ↓
// Dashboard fetches events
// */

// //server.js4
// const express = require("express");
// // Express helps create APIs like:
// // app.post(...)
// // app.get(...)
// const cors = require("cors");
// // Imports CORS middleware.
// // Without CORS: localhost:3000, cannot call, localhost:5000, because browsers block cross-origin requests.

// const app = express();
// // Creates the Express application. Think of it like, app = backend server
// app.use(cors());
// // Allows requests from different origins. (fetch "http://localhost:5000/voice-status" from React frontend.)
// app.use(express.json());
// // Automatically parses JSON body.
// /* Without this:
// req.body would be undefined.
// Example request:
// {
//   "recording": true
// }
// becomes: req.body.recording
// */


// // In-Memory Storage
// const sessions = new Map(); //Stores active sessions.
// // Example:
// // {
// // "User-1": {
//       // userId:"User-1",
//       // startTime:"..."
//   // }
// // }
// // Only active users remain here.
// const wakewordQueue = []; //Stores all events.  [ SESSION_START, WAKEWORD, SESSION_END ]
// const wakewordLog = []; //Stores only wakeword detections.


// let userCounter = 1; //Used to generate fake user IDs
// const ipToUser = new Map(); //Maps IP addresses to user IDs. Example: { "127.0.0.1" : "User-1" }



// /* GET OR CREATE USER ID */
// function getUserId(ip) { //Function receives an IP. Example : getUserId("127.0.0.1")
//   if (!ipToUser.has(ip)) { //Check: "Have we seen this IP before?"
//     ipToUser.set(ip, `User-${userCounter++}`); //If not: Create new user.
//   }
//   return ipToUser.get(ip); //Return the user ID.
// }


// //POST /voice-status
// app.post("/voice-status", (req, res) => { // Creates endpoint: POST /voice-status - Frontend calls this.
//  /* Example request:
//   const { recording, wakeword } = req.body; // Destructuring.
//   {
//   "recording": true,
//   "wakeword": "Hello Computer"
// }

// becomes:

// recording = true
// wakeword = "Hello Computer" 
// */
//   const now = new Date(); //Current timestamp.

//   const ip = req.ip; //Gets request IP.
//   const userId = getUserId(ip);  //Converts IP into user ID.

//    console.log("RAW REQUEST:", req.body); //Prints incoming data.
 
 
//    /* SESSION START */
//   if (recording === true && !wakeword) { //Recording started, No wakeword detected
//     sessions.set(userId, { //Add active session. 
//       userId,
//       startTime: now.toISOString()
//     });
//     /* Store:

// {
//  userId:"User-1",
//  startTime:"2025-02-10T10:00:00Z"
// }
//  */

//     wakewordQueue.push({ //Add event to timeline.
//       type: "SESSION_START",
//       userId,
//       wakeword: "-",
//       time: now.toISOString()
//     });

//     return res.json({ success: true }); //Immediately return response.
//   }

//   /* WAKEWORD */ 
// if (wakeword) { //Runs if wakeword exists.
//   const entry = { //Create event object.
//     type: "WAKEWORD", //Marks event type.
//     userId, //Stores user.
//     wakeword: String(wakeword), // Converts value into string. 123 becomes "123"
//     time: now.toISOString() // Stores timestamp.
//   };

//   wakewordQueue.push(entry); // Adds to full timeline.
//   wakewordLog.push(entry); // Adds to wakeword-only log.

//   console.log("🧠 WAKEWORD RECEIVED:", entry); // Logs event.

//   return res.json({ // Returns response.
//     success: true,
//     type: "wakeword"
//   });
// }

//   /* SESSION END */
//   if (recording === false) { // Recording stopped.
//     sessions.delete(userId); // Remove active session.

//     wakewordQueue.push({ // Add end event.
//       type: "SESSION_END", // Marks end.
//       userId,
//       wakeword: "Hello Computer",
//       time: now.toISOString() // Stores event details.
//     });

//     return res.json({ success: true }); // Send success.
//   }

//   res.json({ success: false }); // If none of the conditions matched.
// });




// /* 
// Creates:
// GET /debug-state
// Dashboard calls this.
// */
// app.get("/debug-state", (req, res) => { 
//   res.json({ // Send data.
//     sessions: Array.from(sessions.values()), // Converts Map to array.
//     queue: wakewordQueue, // Send full event timeline.
//     wakewords: wakewordLog   // 👈 THIS is what dashboard uses - Send wakeword-only history.
//   });
// });

// //Start Server
// app.listen(5000, () => {
//   console.log("🚀 Server running on 5000");
// });



// mini event tracker for wakeword sessions.

/*
Frontend (Hero.jsx)
        ↓
POST /voice-status
        ↓
Backend stores events
        ↓
Dashboard fetches events
*/

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   In-Memory Storage
========================= */

const sessions = new Map(); // active sessions only
const wakewordQueue = [];   // full event timeline
const wakewordLog = [];     // only wakeword events

let userCounter = 1;
const ipToUser = new Map();

/* =========================
   Get or Create User ID
========================= */

function getUserId(ip) {
  if (!ipToUser.has(ip)) {
    ipToUser.set(ip, `User-${userCounter++}`);
  }
  return ipToUser.get(ip);
}

/* =========================
   POST /voice-status
========================= */

app.post("/voice-status", (req, res) => {

  const now = new Date();

  const ip = req.ip;
  const userId = getUserId(ip);

  // ✅ FIX: properly extract values from request body
  const { recording, wakeword } = req.body || {};

  console.log("RAW REQUEST:", req.body);

  /* =========================
     SESSION START
  ========================= */
  if (recording === true && !wakeword) {

    sessions.set(userId, {
      userId,
      startTime: now.toISOString()
    });

    wakewordQueue.push({
      type: "SESSION_START",
      userId,
      wakeword: "-",
      time: now.toISOString()
    });

    return res.json({ success: true, type: "session_start" });
  }

  /* =========================
     WAKEWORD DETECTED
  ========================= */
  if (wakeword) {

    const entry = {
      type: "WAKEWORD",
      userId,
      wakeword: String(wakeword),
      time: now.toISOString()
    };

    wakewordQueue.push(entry);
    wakewordLog.push(entry);

    console.log("🧠 WAKEWORD RECEIVED:", entry);

    return res.json({
      success: true,
      type: "wakeword"
    });
  }

  /* =========================
     SESSION END
  ========================= */
  if (recording === false) {

    sessions.delete(userId);

    wakewordQueue.push({
      type: "SESSION_END",
      userId,
      wakeword: "-",
      time: now.toISOString()
    });

    return res.json({ success: true, type: "session_end" });
  }

  /* =========================
     FALLBACK
  ========================= */
  return res.json({ success: false });
});

/* =========================
   GET DEBUG STATE
========================= */

app.get("/debug-state", (req, res) => {
  res.json({
    sessions: Array.from(sessions.values()),
    queue: wakewordQueue,
    wakewords: wakewordLog
  });
});

/* =========================
   START SERVER
========================= */

app.listen(5000, () => {
  console.log("🚀 Server running on 5000");
});









