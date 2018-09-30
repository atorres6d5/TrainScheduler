// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
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
  const grabsUserInput= function(){
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    //var firstTrain = moment($("#first-train-input").val().trim()).format("HH:mm");
    var trainFrequency = $("#frequency-input").val();
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      first: firstTrain,
      frequency: trainFrequency
    }
    return newTrain
  };
  // Clears all of the text-boxes
  var clear = function () {
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-input").val("");
    $("#frequency-input").val("");
  }

  // console.log({
  //   trainName,
  //   trainDestination,
  //   firstTrain,
  //   trainFrequency,
  //   newTrain: grabsUserInput()
  // })

  // Logs everything to console
  // console.log(newTrain.name);
  // console.log(newTrain.destination);
  // console.log(newTrain.first);
  // console.log(newTrain.frequency);

  // Uploads train data to the database
   database.ref().push(grabsUserInput(), clear());
});



// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log({ 
    childAdded: childSnapshot.val()
  }, "Snapshot");
  var newTrain = childSnapshot.val()

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;   
  var currentTime = moment();
  var firstTimeConverted = moment(newTrain.first, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % newTrain.frequency;
  var tMinutesTillTrain = newTrain.frequency - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("M-D hh:mm");

  //log all new vars
  console.log({
    newTrain,
    trainName,
    trainDestination,
    trainFrequency: newTrain.frequency,
    firstTrain: newTrain.first,
    currentTime,
    firstTimeConverted,
    diffTime,
    tRemainder,
    tMinutesTillTrain,
    nextTrain: nextTrain
  })

  // Train Info
  // console.log(trainName);
  // console.log(trainDestination);
  // console.log(trainFrequency);
  // console.log(nextTrain);
  // console.log(tMinutesTillTrain);


  // Prettify the first train
  //var firstTrainPretty = moment(firstTrain).format("HH:mm");
  //console.log('First Train', firstTrainPretty)
 
  // Create the new row
  var addNewRowToTable = function(){
      var newRow = $("<tr>").append(
        $("<td>").text(newTrain.name),
        $("<td>").text(newTrain.destination),    
        $("<td>").text(newTrain.frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(tMinutesTillTrain)
      );
      return newRow
    }

  // Append the new row to the table
  $("#train-table > tbody").append(addNewRowToTable());
});

