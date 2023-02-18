let fs = require("fs")
const input = fs.readFileSync("./input.txt", "utf-8")

// Split the input so each line is an element. Then split each line into an array of words.
function splitArr(input) {
  const inputArr = input.split('\r\n').map(line => line.split(' '))
  return inputArr
}

// Parse through the input array and create an object for each patient. Return array of objects.
function createPatientObjs(inputArr) {
  class PatientObj {
    constructor(name) {
      this.name = name;
      this.numberOfTreatments = 0;
      this.durationOfStay = {
        minutes: 0,
        hours: 0
      };
      this.dateIntake = '';
      this.dateDischarge = '';
      this.typesOfTreatments = {};
    }
  }

  const patientObjs = []

  for (const elem of inputArr) {
    if (elem[0] === 'Patient') {
      let name = elem[1]
      let newPatient = new PatientObj(name)
      patientObjs.push(newPatient)
    }
  }

  return patientObjs
}

// Parse through the input array and set the patient objects.
function setPatientObjs(patientObjs, inputArr) {
  let action, date, name, treatment

  for (const elem of inputArr) {
    if (elem[0] !== 'Action') continue

    action = elem[1]
    name = elem[2]
    date = elem[3]
    treatment = elem[4]

    for (let i = 0; i < patientObjs.length; i++) {
      if (patientObjs[i].name === name) {
        if (action === "Intake") patientObjs[i].dateIntake = date
        else if (action === "Discharge") patientObjs[i].dateDischarge = date
        else if (action === "Treatment") {
          if (patientObjs[i].typesOfTreatments[treatment] === true) break
          patientObjs[i].typesOfTreatments[treatment] = true
          patientObjs[i].numberOfTreatments = patientObjs[i].numberOfTreatments + 1
        }
      }
    }
  }

  return patientObjs
}

// Set total duration in hours and minutes.
function setPatientObjsDuration(patientObjs) {
  let intake, discharge

  for (const patient of patientObjs) {
    intake = new Date(patient.dateIntake)
    discharge = new Date(patient.dateDischarge)

    let milliseconds = Math.abs(intake - discharge)
    let minutes = milliseconds / 1000 / 60

    let hours = (Math.floor(minutes / 60)).toFixed(1)
    minutes = (minutes % 60).toFixed(1)
    
    patient.durationOfStay.minutes = minutes
    patient.durationOfStay.hours = hours
  }


  return patientObjs
}

// Format string and output result.
function formatPatientObjsOutput(patientObjs) {
  for (const patient of patientObjs) {
    console.log(`Patient ${patient.name} stayed for ${patient.durationOfStay.hours} hours and ${patient.durationOfStay.minutes} minutes and received ${patient.numberOfTreatments} treatments`)
  }
}

const inputArr = splitArr(input)
let patientObjs = createPatientObjs(inputArr)
patientObjs = setPatientObjs(patientObjs, inputArr)
patientObjs = setPatientObjsDuration(patientObjs)
formatPatientObjsOutput(patientObjs)

/*
Patient John stayed for 222.0 hours and 13.0 minutes and received 4 treatments
Patient Anne stayed for 123.0 hours and 34.0 minutes and received 1 treatments
Patient Polly stayed for 24.0 hours and 0.0 minutes and received 2 treatments
*/