let fs = require("fs")
const input = fs.readFileSync("./input.txt", "utf-8")

// Split the input so each line is an element. Then split each line into an array of words.
function splitArr(input) {
  const inputArr = input.split(/\r?\n/).map(line => line.split(' '))
  return inputArr
}

// Parse through the input array and create a map for each patient. Return a map of maps.
function createPatientMaps(inputArr) {
  const patientMaps = new Map()

  for (const line of inputArr) {
    if (line[0] === 'Patient') {
      const name = line[1]
      patientMaps.set(name, new Map(
        [
          ['name', name],
          ['durationOfStay', {
            minutes: null,
            hours: null
          }],
          ['dateIntake', null],
          ['dateDischarge', null],
          ['treatments', new Set()]
        ]
      ))
    }
  }

  return patientMaps
}

// Parse through the input array and set "actions" to patient maps.
function setPatientActions(patientMaps, inputArr) {
  for (const line of inputArr) {
    const [keyword, action, name, date, treatment] = line

    if (keyword !== 'Action') continue
    if (action === 'Intake') patientMaps.get(name).set('dateIntake', date)
    if (action === 'Discharge') patientMaps.get(name).set('dateDischarge', date)
    if (action === 'Treatment') patientMaps.get(name).get('treatments').add(treatment)
  }

  return patientMaps
}

// Iterate through patient maps and set total duration hours and minutes.
function setPatientDuration(patientMaps) {
  for (const patient of patientMaps.values()) {
    const dateIntake = new Date(patient.get('dateIntake'))
    const dateDischarge = new Date(patient.get('dateDischarge'))

    const milliseconds = Math.abs(dateIntake - dateDischarge)
    const minutes = ((milliseconds / 1000 / 60) % 60).toFixed(1)
    const hours = Math.floor((milliseconds / 1000 / 60) / 60).toFixed(1)

    patient.get('durationOfStay').minutes = minutes
    patient.get('durationOfStay').hours = hours
  }

  return patientMaps
}

// Iterate through patient maps, format strings, and output result.
function outputPatientMaps(patientMaps) {
  for (const patient of patientMaps.values()) {
    const patientStr = `Patient ${patient.get('name')} stayed for ${patient.get('durationOfStay').hours} hours and ${patient.get('durationOfStay').minutes} minutes and received ${patient.get('treatments').size} treatments`
    console.log(patientStr)
  }
}

const inputArr = splitArr(input)
let patientMaps = createPatientMaps(inputArr)
patientMaps = setPatientActions(patientMaps, inputArr)
patientMaps = setPatientDuration(patientMaps)
outputPatientMaps(patientMaps)