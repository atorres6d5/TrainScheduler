// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
// Initialize Firebase


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDxvKiuE-5d6m_jf4fCxvgi7UC04-EZSJ4",
    authDomain: "trainscheduler-19598.firebaseapp.com",
    databaseURL: "https://trainscheduler-19598.firebaseio.com",
    projectId: "trainscheduler-19598",
    storageBucket: "trainscheduler-19598.appspot.com",
    messagingSenderId: "632711025701"
  };
  firebase.initializeApp(config);

  var database = firebase.database();



// 2. Button for adding Trainss
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  //var firstTrain = moment($("#first-train-input").val().trim()).format("HH:mm");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
     name: trainName,
     destination: trainDestination,
     first: firstTrain,
     frequency: trainFrequency
   };

  // Uploads train data to the database
  database.ref().push({
    name: trainName,
    destination: trainDestination,
    first: firstTrain,
    frequency: trainFrequency
  });

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;  
  var trainFrequency = childSnapshot.val().frequency;
  var firstTrain = childSnapshot.val().first;  
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm")); 
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  var tRemainder = diffTime % trainFrequency;
  console.log(tRemainder); 
  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain); 
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Employee Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFrequency);
  console.log(nextTrain);
  console.log(tMinutesTillTrain);


  // Prettify the first train
  //var firstTrainPretty = moment(firstTrain).format("HH:mm");
  //console.log('First Train', firstTrainPretty)
 
  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),    
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain)
  );

  // Append the new row to the table
  $("#employee-table > tbody").append(newRow);
});

