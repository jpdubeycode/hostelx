// Mock students (28).
// Sensitive fields (phone, email, guardian, fees) must only be rendered for admin. See utils/permissions.js

export const students = [
  {
    "id": 1,
    "regNo": "SL23-CSE101",
    "name": "Jai Prakash Dubey",
    "branch": "CSE",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 2,
    "roomId": "B-204",
    "isCommittee": true,
    "phone": "9817919317",
    "email": "jai.cse23@sliet.example.in",
    "guardian": {
      "name": "Mr. Rajesh Dubey",
      "relation": "Father",
      "phone": "9726113417"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2023-08-02"
  },
  {
    "id": 2,
    "regNo": "SL23-CSE102",
    "name": "Rahul Kumar",
    "branch": "CSE",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 2,
    "roomId": "B-204",
    "isCommittee": false,
    "phone": "9825838634",
    "email": "rahul.cse23@sliet.example.in",
    "guardian": {
      "name": "Mr. Sunil Kumar",
      "relation": "Father",
      "phone": "9732226834"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2023-08-03"
  },
  {
    "id": 3,
    "regNo": "SL23-ECE103",
    "name": "Aman Singh",
    "branch": "ECE",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 2,
    "roomId": "B-204",
    "isCommittee": false,
    "phone": "9833757951",
    "email": "aman.ece23@sliet.example.in",
    "guardian": {
      "name": "Mrs. Sunita Singh",
      "relation": "Mother",
      "phone": "9738340251"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2023-08-04"
  },
  {
    "id": 4,
    "regNo": "SL23-CSE104",
    "name": "Harpreet Singh",
    "branch": "CSE",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 1,
    "roomId": "B-101",
    "isCommittee": false,
    "phone": "9841677268",
    "email": "harpreet.cse23@sliet.example.in",
    "guardian": {
      "name": "Mr. Harish Singh",
      "relation": "Father",
      "phone": "9744453668"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2023-08-05"
  },
  {
    "id": 5,
    "regNo": "SL22-ME105",
    "name": "Mohit Sharma",
    "branch": "ME",
    "year": 3,
    "semester": 5,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 1,
    "roomId": "B-101",
    "isCommittee": false,
    "phone": "9849596585",
    "email": "mohit.me22@sliet.example.in",
    "guardian": {
      "name": "Mr. Mahesh Sharma",
      "relation": "Father",
      "phone": "9750567085"
    },
    "fees": {
      "hostel": "Pending",
      "mess": "Paid"
    },
    "joinedOn": "2022-08-01"
  },
  {
    "id": 6,
    "regNo": "SL24-ECE106",
    "name": "Karan Verma",
    "branch": "ECE",
    "year": 1,
    "semester": 1,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 1,
    "roomId": "B-102",
    "isCommittee": false,
    "phone": "9857515902",
    "email": "karan.ece24@sliet.example.in",
    "guardian": {
      "name": "Mrs. Kavita Verma",
      "relation": "Mother",
      "phone": "9756680502"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2024-08-02"
  },
  {
    "id": 7,
    "regNo": "SL22-CSE107",
    "name": "Sahil Gupta",
    "branch": "CSE",
    "year": 3,
    "semester": 5,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 1,
    "roomId": "B-103",
    "isCommittee": false,
    "phone": "9865435219",
    "email": "sahil.cse22@sliet.example.in",
    "guardian": {
      "name": "Mr. Rajesh Gupta",
      "relation": "Father",
      "phone": "9762793919"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Pending"
    },
    "joinedOn": "2022-08-03"
  },
  {
    "id": 8,
    "regNo": "SL22-EE108",
    "name": "Ankit Yadav",
    "branch": "EE",
    "year": 3,
    "semester": 5,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 1,
    "roomId": "B-103",
    "isCommittee": false,
    "phone": "9873354536",
    "email": "ankit.ee22@sliet.example.in",
    "guardian": {
      "name": "Mr. Sunil Yadav",
      "relation": "Father",
      "phone": "9768907336"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2022-08-04"
  },
  {
    "id": 9,
    "regNo": "SL22-CSE109",
    "name": "Rohan Mehta",
    "branch": "CSE",
    "year": 3,
    "semester": 5,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 1,
    "roomId": "B-103",
    "isCommittee": false,
    "phone": "9881273853",
    "email": "rohan.cse22@sliet.example.in",
    "guardian": {
      "name": "Mrs. Sunita Mehta",
      "relation": "Mother",
      "phone": "9775020753"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2022-08-05"
  },
  {
    "id": 10,
    "regNo": "SL21-ME110",
    "name": "Gurpreet Singh",
    "branch": "ME",
    "year": 4,
    "semester": 7,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 1,
    "roomId": "B-104",
    "isCommittee": false,
    "phone": "9889193170",
    "email": "gurpreet.me21@sliet.example.in",
    "guardian": {
      "name": "Mr. Harish Singh",
      "relation": "Father",
      "phone": "9781134170"
    },
    "fees": {
      "hostel": "Pending",
      "mess": "Paid"
    },
    "joinedOn": "2021-08-01"
  },
  {
    "id": 11,
    "regNo": "SL21-CE111",
    "name": "Vikas Jangra",
    "branch": "CE",
    "year": 4,
    "semester": 7,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 1,
    "roomId": "B-104",
    "isCommittee": false,
    "phone": "9897112487",
    "email": "vikas.ce21@sliet.example.in",
    "guardian": {
      "name": "Mr. Mahesh Jangra",
      "relation": "Father",
      "phone": "9787247587"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2021-08-02"
  },
  {
    "id": 12,
    "regNo": "SL23-EE112",
    "name": "Deepak Rana",
    "branch": "EE",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 2,
    "roomId": "B-202",
    "isCommittee": false,
    "phone": "9810503180",
    "email": "deepak.ee23@sliet.example.in",
    "guardian": {
      "name": "Mrs. Kavita Rana",
      "relation": "Mother",
      "phone": "9793361004"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2023-08-03"
  },
  {
    "id": 13,
    "regNo": "SL24-CSE113",
    "name": "Nikhil Bansal",
    "branch": "CSE",
    "year": 1,
    "semester": 1,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 2,
    "roomId": "B-202",
    "isCommittee": false,
    "phone": "9811295112",
    "email": "nikhil.cse24@sliet.example.in",
    "guardian": {
      "name": "Mr. Rajesh Bansal",
      "relation": "Father",
      "phone": "9799474421"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2024-08-04"
  },
  {
    "id": 14,
    "regNo": "SL24-ECE114",
    "name": "Arjun Thakur",
    "branch": "ECE",
    "year": 1,
    "semester": 1,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 3,
    "roomId": "B-301",
    "isCommittee": false,
    "phone": "9812087043",
    "email": "arjun.ece24@sliet.example.in",
    "guardian": {
      "name": "Mr. Sunil Thakur",
      "relation": "Father",
      "phone": "9710558783"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Pending"
    },
    "joinedOn": "2024-08-05"
  },
  {
    "id": 15,
    "regNo": "SL21-CSE115",
    "name": "Manpreet Gill",
    "branch": "CSE",
    "year": 4,
    "semester": 7,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 3,
    "roomId": "B-301",
    "isCommittee": true,
    "phone": "9812878975",
    "email": "manpreet.cse21@sliet.example.in",
    "guardian": {
      "name": "Mrs. Sunita Gill",
      "relation": "Mother",
      "phone": "9711170125"
    },
    "fees": {
      "hostel": "Pending",
      "mess": "Paid"
    },
    "joinedOn": "2021-08-01"
  },
  {
    "id": 16,
    "regNo": "SL23-ME116",
    "name": "Shubham Tiwari",
    "branch": "ME",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel B",
    "block": "B",
    "floor": 3,
    "roomId": "B-303",
    "isCommittee": false,
    "phone": "9813670907",
    "email": "shubham.me23@sliet.example.in",
    "guardian": {
      "name": "Mr. Harish Tiwari",
      "relation": "Father",
      "phone": "9711781467"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2023-08-02"
  },
  {
    "id": 17,
    "regNo": "SL22-CSE117",
    "name": "Abhishek Pandey",
    "branch": "CSE",
    "year": 3,
    "semester": 5,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 1,
    "roomId": "A-101",
    "isCommittee": false,
    "phone": "9814462838",
    "email": "abhishek.cse22@sliet.example.in",
    "guardian": {
      "name": "Mr. Mahesh Pandey",
      "relation": "Father",
      "phone": "9712392808"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2022-08-03"
  },
  {
    "id": 18,
    "regNo": "SL22-ECE118",
    "name": "Tanmay Joshi",
    "branch": "ECE",
    "year": 3,
    "semester": 5,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 1,
    "roomId": "A-101",
    "isCommittee": false,
    "phone": "9815254770",
    "email": "tanmay.ece22@sliet.example.in",
    "guardian": {
      "name": "Mrs. Kavita Joshi",
      "relation": "Mother",
      "phone": "9713004150"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2022-08-04"
  },
  {
    "id": 19,
    "regNo": "SL24-EE119",
    "name": "Parth Malhotra",
    "branch": "EE",
    "year": 1,
    "semester": 1,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 1,
    "roomId": "A-102",
    "isCommittee": false,
    "phone": "9816046702",
    "email": "parth.ee24@sliet.example.in",
    "guardian": {
      "name": "Mr. Rajesh Malhotra",
      "relation": "Father",
      "phone": "9713615492"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2024-08-05"
  },
  {
    "id": 20,
    "regNo": "SL23-CSE120",
    "name": "Yash Aggarwal",
    "branch": "CSE",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 1,
    "roomId": "A-103",
    "isCommittee": false,
    "phone": "9816838634",
    "email": "yash.cse23@sliet.example.in",
    "guardian": {
      "name": "Mr. Sunil Aggarwal",
      "relation": "Father",
      "phone": "9714226834"
    },
    "fees": {
      "hostel": "Pending",
      "mess": "Paid"
    },
    "joinedOn": "2023-08-01"
  },
  {
    "id": 21,
    "regNo": "SL23-CE121",
    "name": "Lakshay Chauhan",
    "branch": "CE",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 1,
    "roomId": "A-103",
    "isCommittee": false,
    "phone": "9817630565",
    "email": "lakshay.ce23@sliet.example.in",
    "guardian": {
      "name": "Mrs. Sunita Chauhan",
      "relation": "Mother",
      "phone": "9714838175"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Pending"
    },
    "joinedOn": "2023-08-02"
  },
  {
    "id": 22,
    "regNo": "SL21-ECE122",
    "name": "Ishaan Kapoor",
    "branch": "ECE",
    "year": 4,
    "semester": 7,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 1,
    "roomId": "A-103",
    "isCommittee": true,
    "phone": "9818422497",
    "email": "ishaan.ece21@sliet.example.in",
    "guardian": {
      "name": "Mr. Harish Kapoor",
      "relation": "Father",
      "phone": "9715449517"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2021-08-03"
  },
  {
    "id": 23,
    "regNo": "SL24-ME123",
    "name": "Ravi Teja",
    "branch": "ME",
    "year": 1,
    "semester": 1,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 2,
    "roomId": "A-201",
    "isCommittee": false,
    "phone": "9819214429",
    "email": "ravi.me24@sliet.example.in",
    "guardian": {
      "name": "Mr. Mahesh Teja",
      "relation": "Father",
      "phone": "9716060859"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2024-08-04"
  },
  {
    "id": 24,
    "regNo": "SL24-CSE124",
    "name": "Sourav Das",
    "branch": "CSE",
    "year": 1,
    "semester": 1,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 2,
    "roomId": "A-201",
    "isCommittee": false,
    "phone": "9820006360",
    "email": "sourav.cse24@sliet.example.in",
    "guardian": {
      "name": "Mrs. Kavita Das",
      "relation": "Mother",
      "phone": "9716672200"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2024-08-05"
  },
  {
    "id": 25,
    "regNo": "SL22-EE125",
    "name": "Vishal Saini",
    "branch": "EE",
    "year": 3,
    "semester": 5,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 2,
    "roomId": "A-203",
    "isCommittee": false,
    "phone": "9820798292",
    "email": "vishal.ee22@sliet.example.in",
    "guardian": {
      "name": "Mr. Rajesh Saini",
      "relation": "Father",
      "phone": "9717283542"
    },
    "fees": {
      "hostel": "Pending",
      "mess": "Paid"
    },
    "joinedOn": "2022-08-01"
  },
  {
    "id": 26,
    "regNo": "SL23-CSE126",
    "name": "Dhruv Arora",
    "branch": "CSE",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 2,
    "roomId": "A-203",
    "isCommittee": false,
    "phone": "9821590224",
    "email": "dhruv.cse23@sliet.example.in",
    "guardian": {
      "name": "Mr. Sunil Arora",
      "relation": "Father",
      "phone": "9717894884"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2023-08-02"
  },
  {
    "id": 27,
    "regNo": "SL22-CE127",
    "name": "Nitin Choudhary",
    "branch": "CE",
    "year": 3,
    "semester": 5,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 2,
    "roomId": "A-203",
    "isCommittee": false,
    "phone": "9822382155",
    "email": "nitin.ce22@sliet.example.in",
    "guardian": {
      "name": "Mrs. Sunita Choudhary",
      "relation": "Mother",
      "phone": "9718506225"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Paid"
    },
    "joinedOn": "2022-08-03"
  },
  {
    "id": 28,
    "regNo": "SL23-ECE128",
    "name": "Pranav Nair",
    "branch": "ECE",
    "year": 2,
    "semester": 3,
    "hostel": "Boys Hostel A",
    "block": "A",
    "floor": 2,
    "roomId": "A-204",
    "isCommittee": false,
    "phone": "9823174087",
    "email": "pranav.ece23@sliet.example.in",
    "guardian": {
      "name": "Mr. Harish Nair",
      "relation": "Father",
      "phone": "9719117567"
    },
    "fees": {
      "hostel": "Paid",
      "mess": "Pending"
    },
    "joinedOn": "2023-08-04"
  }
]